import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  RESPONSE_DEADLINES,
  PENALTY_POINTS,
  PENALTY_CONFIG,
  ESCALATION_RULES,
  calculateHealthScore,
  getPenaltyLevel,
} from '@/lib/incident-policies';

export const runtime = 'nodejs';

/**
 * POST /api/cron/evaluate-incidents
 * Automated evaluation of overdue incidents and penalty application.
 * This endpoint should be called periodically (e.g., every hour via cron).
 *
 * Protected by CRON_SECRET header to prevent unauthorized access.
 *
 * Actions performed:
 * 1. Check for incidents where seller hasn't responded within deadline
 * 2. Send reminders before deadline
 * 3. Auto-escalate incidents past escalation deadline
 * 4. Apply penalties for overdue responses
 * 5. Close old resolved incidents
 * 6. Evaluate stores with high incident rates
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      reminders: 0,
      escalated: 0,
      penaltiesApplied: 0,
      autoClosed: 0,
      highIncidentStores: 0,
    };

    // ============================================================
    // 1. SEND REMINDERS (36h since creation, seller hasn't responded)
    // ============================================================
    const reminderCutoff = new Date(now);
    reminderCutoff.setHours(reminderCutoff.getHours() - ESCALATION_RULES.NO_RESPONSE.reminderAfterHours);

    const needReminder = await db.incident.findMany({
      where: {
        status: 'AWAITING_SELLER',
        sellerFirstResponseAt: null,
        createdAt: { lte: reminderCutoff },
        deadlineAt: { gt: now }, // Deadline hasn't passed yet
      },
      include: {
        store: { select: { ownerId: true, name: true } },
      },
    });

    for (const incident of needReminder) {
      const hoursLeft = Math.round(
        (incident.deadlineAt!.getTime() - now.getTime()) / (1000 * 60 * 60)
      );

      await db.notification.create({
        data: {
          userId: incident.store.ownerId,
          type: 'SYSTEM',
          title: `Recordatorio: Incidencia ${incident.incidentNumber} pendiente`,
          body: `Tienes ${hoursLeft}h para responder a esta incidencia antes de que se apliquen penalizaciones.`,
          actionUrl: `/dashboard/incidents/${incident.id}`,
        },
      });
      results.reminders++;
    }

    // ============================================================
    // 2. APPLY PENALTIES FOR OVERDUE RESPONSES
    // ============================================================
    const overdue = await db.incident.findMany({
      where: {
        status: 'AWAITING_SELLER',
        sellerFirstResponseAt: null,
        deadlineAt: { lte: now },
      },
      include: {
        store: { select: { id: true, ownerId: true, name: true } },
      },
    });

    for (const incident of overdue) {
      // Check if we already penalized for this incident
      const existingPenalty = await db.storePenalty.findFirst({
        where: {
          storeId: incident.storeId,
          incidentId: incident.id,
          type: 'WARNING',
        },
      });

      if (!existingPenalty) {
        // Check if repeat offender
        const recentNoResponse = await db.storePenalty.count({
          where: {
            storeId: incident.storeId,
            reason: { contains: 'sin respuesta' },
            createdAt: {
              gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        });

        const points = recentNoResponse > 0
          ? PENALTY_POINTS.NO_RESPONSE_REPEAT
          : PENALTY_POINTS.NO_RESPONSE_FIRST;

        const penaltyType = recentNoResponse > 0
          ? 'COMMISSION_INCREASE'
          : 'WARNING';

        await db.storePenalty.create({
          data: {
            storeId: incident.storeId,
            incidentId: incident.id,
            type: penaltyType,
            reason: `Incidencia ${incident.incidentNumber} sin respuesta en ${RESPONSE_DEADLINES.FIRST_RESPONSE_HOURS}h.`,
            points,
            details: {
              incidentNumber: incident.incidentNumber,
              isRepeat: recentNoResponse > 0,
              hoursOverdue: Math.round((now.getTime() - incident.deadlineAt!.getTime()) / (1000 * 60 * 60)),
            },
            expiresAt: new Date(now.getTime() + PENALTY_CONFIG.POINTS_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
          },
        });

        // Notify store owner
        await db.notification.create({
          data: {
            userId: incident.store.ownerId,
            type: 'SYSTEM',
            title: 'Penalización aplicada: Sin respuesta a incidencia',
            body: `Se han añadido ${points} puntos de penalización por no responder a la incidencia ${incident.incidentNumber} en el plazo establecido.`,
            actionUrl: '/dashboard/store/health',
          },
        });

        results.penaltiesApplied++;
      }
    }

    // ============================================================
    // 3. AUTO-ESCALATE (5 days without response)
    // ============================================================
    const escalationCutoff = new Date(now);
    escalationCutoff.setHours(
      escalationCutoff.getHours() - ESCALATION_RULES.NO_RESPONSE.escalationHours
    );

    const needEscalation = await db.incident.findMany({
      where: {
        status: 'AWAITING_SELLER',
        sellerFirstResponseAt: null,
        createdAt: { lte: escalationCutoff },
      },
    });

    for (const incident of needEscalation) {
      await db.incident.update({
        where: { id: incident.id },
        data: {
          status: 'ESCALATED',
          priority: 'URGENT',
          escalatedAt: now,
        },
      });
      results.escalated++;
    }

    // ============================================================
    // 4. AUTO-CLOSE OLD RESOLVED INCIDENTS (30 days after resolution)
    // ============================================================
    const closeCutoff = new Date(now);
    closeCutoff.setDate(closeCutoff.getDate() - RESPONSE_DEADLINES.MAX_RESOLUTION_DAYS);

    const toClose = await db.incident.updateMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: { lte: closeCutoff },
      },
      data: {
        status: 'CLOSED',
        closedAt: now,
      },
    });
    results.autoClosed = toClose.count;

    // ============================================================
    // 5. EVALUATE HIGH INCIDENT RATE STORES
    // ============================================================
    const windowStart = new Date(now);
    windowStart.setDate(windowStart.getDate() - PENALTY_CONFIG.HIGH_INCIDENT_WINDOW_DAYS);

    // Find stores with high incident counts
    const storeIncidentCounts = await db.incident.groupBy({
      by: ['storeId'],
      where: { createdAt: { gte: windowStart } },
      _count: { id: true },
      having: {
        id: { _count: { gte: PENALTY_CONFIG.HIGH_INCIDENT_COUNT } },
      },
    });

    for (const storeData of storeIncidentCounts) {
      // Check if already penalized for high rate recently
      const existingHighRate = await db.storePenalty.findFirst({
        where: {
          storeId: storeData.storeId,
          reason: { contains: 'tasa alta de incidencias' },
          createdAt: { gte: windowStart },
        },
      });

      if (!existingHighRate) {
        const store = await db.store.findUnique({
          where: { id: storeData.storeId },
          select: { ownerId: true },
        });

        if (store) {
          await db.storePenalty.create({
            data: {
              storeId: storeData.storeId,
              type: 'VISIBILITY_REDUCTION',
              reason: `Tasa alta de incidencias: ${storeData._count.id} incidencias en los últimos ${PENALTY_CONFIG.HIGH_INCIDENT_WINDOW_DAYS} días.`,
              points: PENALTY_POINTS.HIGH_INCIDENT_RATE,
              details: {
                incidentCount: storeData._count.id,
                windowDays: PENALTY_CONFIG.HIGH_INCIDENT_WINDOW_DAYS,
              },
              expiresAt: new Date(now.getTime() + PENALTY_CONFIG.POINTS_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
            },
          });

          await db.notification.create({
            data: {
              userId: store.ownerId,
              type: 'SYSTEM',
              title: 'Penalización: Tasa alta de incidencias',
              body: `Tu tienda ha acumulado ${storeData._count.id} incidencias en ${PENALTY_CONFIG.HIGH_INCIDENT_WINDOW_DAYS} días. Se ha reducido tu visibilidad temporalmente.`,
              actionUrl: '/dashboard/store/health',
            },
          });

          results.highIncidentStores++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      evaluatedAt: now.toISOString(),
      results,
    });
  } catch (error) {
    console.error('POST /api/cron/evaluate-incidents error:', error);
    return NextResponse.json(
      { error: 'Evaluation failed' },
      { status: 500 }
    );
  }
}
