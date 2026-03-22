import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * GET /api/incidents/[id]
 * Get incident detail with all messages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const incident = await db.incident.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            ownerId: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({ incident });
  } catch (error) {
    console.error('GET /api/incidents/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/incidents/[id]
 * Update incident status, resolution, priority, etc.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      status,
      priority,
      resolution,
      resolvedBy,
      sellerEvidence,
    } = body;

    const incident = await db.incident.findUnique({ where: { id } });
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;

      if (status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
        if (resolvedBy) updateData.resolvedBy = resolvedBy;
        if (resolution) updateData.resolution = resolution;
      }

      if (status === 'CLOSED') {
        updateData.closedAt = new Date();
      }

      if (status === 'ESCALATED') {
        updateData.escalatedAt = new Date();
      }
    }

    if (priority) updateData.priority = priority;
    if (sellerEvidence) updateData.sellerEvidence = sellerEvidence;
    if (resolution && !status) updateData.resolution = resolution;

    const updated = await db.incident.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        store: {
          select: { id: true, name: true, slug: true, ownerId: true },
        },
      },
    });

    // Notificar al cambiar estado
    if (status) {
      const statusLabels: Record<string, string> = {
        RESOLVED: 'Incidencia resuelta',
        CLOSED: 'Incidencia cerrada',
        ESCALATED: 'Incidencia escalada a administración',
        IN_MEDIATION: 'Incidencia en mediación',
        AWAITING_CUSTOMER: 'El vendedor ha respondido a tu incidencia',
        AWAITING_SELLER: 'El cliente ha respondido a tu incidencia',
      };

      const notifyUserId = ['AWAITING_CUSTOMER', 'RESOLVED', 'CLOSED'].includes(status)
        ? updated.customer.id
        : updated.store.ownerId;

      if (notifyUserId) {
        await db.notification.create({
          data: {
            userId: notifyUserId,
            type: 'ORDER_UPDATE',
            title: statusLabels[status] || `Incidencia ${updated.incidentNumber} actualizada`,
            body: `La incidencia ${updated.incidentNumber} ha cambiado de estado.`,
            actionUrl: `/dashboard/incidents/${updated.id}`,
          },
        });
      }
    }

    return NextResponse.json({ incident: updated });
  } catch (error) {
    console.error('PATCH /api/incidents/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}
