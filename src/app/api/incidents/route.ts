import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  generateIncidentNumber,
  calculateResponseDeadline,
  getAutoPriority,
  RESPONSE_DEADLINES,
} from '@/lib/incident-policies';

export const runtime = 'nodejs';

/**
 * GET /api/incidents
 * List incidents - filtered by role (customer sees theirs, seller sees store's, admin sees all)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const storeId = searchParams.get('storeId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role') || 'customer'; // customer | seller | admin

    const where: any = {};

    if (role === 'customer' && userId) {
      where.customerId = userId;
    } else if (role === 'seller' && storeId) {
      where.storeId = storeId;
    }
    // admin: no filter = all incidents

    if (status) {
      where.status = status;
    }

    const [incidents, total] = await Promise.all([
      db.incident.findMany({
        where,
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
          },
          store: {
            select: { id: true, name: true, slug: true, logoUrl: true },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { body: true, createdAt: true, senderRole: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.incident.count({ where }),
    ]);

    return NextResponse.json({
      incidents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/incidents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/incidents
 * Create a new incident (customer only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerId,
      storeId,
      subOrderId,
      type,
      subject,
      description,
      evidence,
    } = body;

    // Validación básica
    if (!customerId || !storeId || !type || !subject || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, storeId, type, subject, description' },
        { status: 400 }
      );
    }

    // Verificar que el cliente existe
    const customer = await db.user.findUnique({ where: { id: customerId } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verificar que la tienda existe
    const store = await db.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Obtener monto del pedido para prioridad automática
    let orderAmount: number | undefined;
    if (subOrderId) {
      const subOrder = await db.subOrder.findUnique({
        where: { id: subOrderId },
        select: { subtotal: true },
      });
      orderAmount = subOrder ? Number(subOrder.subtotal) : undefined;
    }

    const incidentNumber = generateIncidentNumber();
    const deadline = calculateResponseDeadline();
    const priority = getAutoPriority(type, orderAmount);

    const incident = await db.incident.create({
      data: {
        incidentNumber,
        customerId,
        storeId,
        subOrderId: subOrderId || null,
        type,
        status: 'AWAITING_SELLER',
        priority: priority as any,
        subject,
        description,
        customerEvidence: evidence || null,
        deadlineAt: deadline,
      },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        store: {
          select: { id: true, name: true, slug: true, ownerId: true },
        },
      },
    });

    // Crear mensaje inicial automático (la descripción del cliente)
    await db.incidentMessage.create({
      data: {
        incidentId: incident.id,
        senderId: customerId,
        senderRole: 'CUSTOMER',
        body: description,
        attachments: evidence || null,
      },
    });

    // Crear notificación para el vendedor
    if (store.ownerId) {
      await db.notification.create({
        data: {
          userId: store.ownerId,
          type: 'ORDER_UPDATE',
          title: `Nueva incidencia: ${incidentNumber}`,
          body: `Un cliente ha abierto una incidencia: "${subject}". Tienes ${RESPONSE_DEADLINES.FIRST_RESPONSE_HOURS}h para responder.`,
          actionUrl: `/dashboard/incidents/${incident.id}`,
        },
      });
    }

    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error('POST /api/incidents error:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
}
