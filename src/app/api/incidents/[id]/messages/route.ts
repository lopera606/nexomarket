import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RESPONSE_DEADLINES } from '@/lib/incident-policies';

export const runtime = 'nodejs';

/**
 * GET /api/incidents/[id]/messages
 * Get all messages for an incident
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const messages = await db.incidentMessage.findMany({
      where: { incidentId: id },
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
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('GET /api/incidents/[id]/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/incidents/[id]/messages
 * Add a message to an incident (customer, seller, or admin)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { senderId, senderRole, message, attachments, isInternal } = body;

    if (!senderId || !senderRole || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: senderId, senderRole, message' },
        { status: 400 }
      );
    }

    // Verificar que la incidencia existe
    const incident = await db.incident.findUnique({
      where: { id },
      include: {
        store: { select: { ownerId: true } },
      },
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // No permitir mensajes en incidencias cerradas
    if (['RESOLVED', 'CLOSED'].includes(incident.status)) {
      return NextResponse.json(
        { error: 'Cannot add messages to resolved or closed incidents' },
        { status: 400 }
      );
    }

    // Crear el mensaje
    const newMessage = await db.incidentMessage.create({
      data: {
        incidentId: id,
        senderId,
        senderRole: senderRole as any,
        body: message,
        attachments: attachments || null,
        isInternal: isInternal || false,
      },
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
    });

    // Actualizar estado de la incidencia según quién responde
    const updateData: any = {};

    if (senderRole === 'SELLER') {
      // Si es la primera respuesta del vendedor
      if (!incident.sellerFirstResponseAt) {
        updateData.sellerFirstResponseAt = new Date();
      }
      updateData.status = 'AWAITING_CUSTOMER';
      // Resetear deadline para respuesta del cliente
      const newDeadline = new Date();
      newDeadline.setHours(newDeadline.getHours() + RESPONSE_DEADLINES.FOLLOW_UP_RESPONSE_HOURS);
      updateData.deadlineAt = newDeadline;
    } else if (senderRole === 'CUSTOMER') {
      updateData.status = 'AWAITING_SELLER';
      const newDeadline = new Date();
      newDeadline.setHours(newDeadline.getHours() + RESPONSE_DEADLINES.FOLLOW_UP_RESPONSE_HOURS);
      updateData.deadlineAt = newDeadline;
    } else if (senderRole === 'ADMIN') {
      if (!isInternal) {
        updateData.status = 'IN_MEDIATION';
      }
    }

    if (Object.keys(updateData).length > 0) {
      await db.incident.update({
        where: { id },
        data: updateData,
      });
    }

    // Notificar a la otra parte
    const notifyUserId = senderRole === 'CUSTOMER'
      ? incident.store.ownerId
      : incident.customerId;

    if (notifyUserId && !isInternal) {
      await db.notification.create({
        data: {
          userId: notifyUserId,
          type: 'MESSAGE',
          title: `Nuevo mensaje en incidencia ${incident.incidentNumber}`,
          body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          actionUrl: `/dashboard/incidents/${incident.id}`,
        },
      });
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error('POST /api/incidents/[id]/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
