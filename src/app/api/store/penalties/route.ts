import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  PENALTY_THRESHOLDS,
  PENALTY_CONFIG,
  getPenaltyLevel,
} from '@/lib/incident-policies';

export const runtime = 'nodejs';

/**
 * GET /api/store/penalties?storeId=xxx
 * List all penalties for a store
 */
export async function GET(request: NextRequest) {
  try {
    const storeId = request.nextUrl.searchParams.get('storeId');
    const statusFilter = request.nextUrl.searchParams.get('status');

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId query parameter is required' },
        { status: 400 }
      );
    }

    const where: any = { storeId };
    if (statusFilter) {
      where.status = statusFilter;
    }

    const penalties = await db.storePenalty.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate active points
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - PENALTY_CONFIG.POINTS_EXPIRY_DAYS);

    const activePoints = penalties
      .filter((p: any) =>
        p.status === 'ACTIVE' &&
        p.createdAt >= windowStart
      )
      .reduce((sum: number, p: any) => sum + p.points, 0);

    const level = getPenaltyLevel(activePoints);

    return NextResponse.json({
      penalties,
      summary: {
        activePoints,
        level,
        totalPenalties: penalties.length,
        activePenalties: penalties.filter((p: any) => p.status === 'ACTIVE').length,
      },
    });
  } catch (error) {
    console.error('GET /api/store/penalties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch penalties' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/store/penalties
 * Issue a penalty to a store (admin or automated)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeId,
      incidentId,
      type,
      reason,
      points,
      details,
      issuedBy,
      expiresInDays,
    } = body;

    if (!storeId || !type || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: storeId, type, reason' },
        { status: 400 }
      );
    }

    const store = await db.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Calculate expiration date
    let expiresAt: Date | null = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    const penalty = await db.storePenalty.create({
      data: {
        storeId,
        incidentId: incidentId || null,
        type,
        reason,
        points: points || 0,
        details: details || null,
        issuedBy: issuedBy || null,
        expiresAt,
      },
    });

    // Notify store owner
    await db.notification.create({
      data: {
        userId: store.ownerId,
        type: 'SYSTEM',
        title: 'Penalización aplicada a tu tienda',
        body: `Se ha aplicado una penalización de tipo "${type}": ${reason}`,
        actionUrl: '/dashboard/store/health',
      },
    });

    // Check if penalty level triggers store suspension
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - PENALTY_CONFIG.POINTS_EXPIRY_DAYS);

    const totalPoints = await db.storePenalty.aggregate({
      where: {
        storeId,
        status: 'ACTIVE',
        createdAt: { gte: windowStart },
      },
      _sum: { points: true },
    });

    const currentPoints = (totalPoints._sum.points || 0);
    const level = getPenaltyLevel(currentPoints);

    // Auto-suspend store if threshold reached
    if (level.zone === 'red' && store.status === 'ACTIVE') {
      await db.store.update({
        where: { id: storeId },
        data: { status: 'SUSPENDED' },
      });

      await db.notification.create({
        data: {
          userId: store.ownerId,
          type: 'SYSTEM',
          title: 'Tu tienda ha sido suspendida temporalmente',
          body: `Debido a la acumulación de ${currentPoints} puntos de penalización, tu tienda ha sido suspendida. Puedes apelar esta decisión en un plazo de ${PENALTY_CONFIG.APPEAL_WINDOW_DAYS} días.`,
          actionUrl: '/dashboard/store/health',
        },
      });
    }

    return NextResponse.json({
      penalty,
      currentLevel: level,
      totalActivePoints: currentPoints,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/store/penalties error:', error);
    return NextResponse.json(
      { error: 'Failed to create penalty' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/store/penalties
 * Appeal a penalty (store owner)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { penaltyId, action, appealReason, revokedBy } = body;

    if (!penaltyId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: penaltyId, action' },
        { status: 400 }
      );
    }

    const penalty = await db.storePenalty.findUnique({
      where: { id: penaltyId },
    });

    if (!penalty) {
      return NextResponse.json({ error: 'Penalty not found' }, { status: 404 });
    }

    if (action === 'appeal') {
      if (penalty.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'Only active penalties can be appealed' },
          { status: 400 }
        );
      }

      if (penalty.appealedAt) {
        return NextResponse.json(
          { error: 'This penalty has already been appealed' },
          { status: 400 }
        );
      }

      if (!appealReason) {
        return NextResponse.json(
          { error: 'Appeal reason is required' },
          { status: 400 }
        );
      }

      await db.storePenalty.update({
        where: { id: penaltyId },
        data: {
          status: 'APPEALED',
          appealReason,
          appealedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: 'Appeal submitted' });
    }

    if (action === 'revoke') {
      await db.storePenalty.update({
        where: { id: penaltyId },
        data: {
          status: 'REVOKED',
          revokedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: 'Penalty revoked' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('PATCH /api/store/penalties error:', error);
    return NextResponse.json(
      { error: 'Failed to update penalty' },
      { status: 500 }
    );
  }
}
