import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * GET /api/conversations
 * List conversations for current user (customer or seller)
 * Query params: page, limit, status
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isClosed = searchParams.get('isClosed');

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters',
        },
        { status: 400 }
      );
    }

    // Get user to determine role
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const where: any = {};

    // Filter by user role
    if (user.role === 'CUSTOMER') {
      where.customerId = userId;
    } else if (user.role === 'SELLER') {
      // Find the store owned by this seller
      const store = await db.store.findFirst({
        where: { ownerId: userId },
        select: { id: true },
      });

      if (!store) {
        return NextResponse.json(
          {
            success: false,
            error: 'No store found for this seller',
          },
          { status: 404 }
        );
      }

      where.storeId = store.id;
    } else {
      // Admin can see all conversations (no where filter)
    }

    // Filter by isClosed status if provided
    if (isClosed !== null) {
      where.isClosed = isClosed === 'true';
    }

    const [conversations, total] = await Promise.all([
      (db as any).conversation.findMany({
        where,
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
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              body: true,
              createdAt: true,
              sender: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (db as any).conversation.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/conversations]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create a new conversation
 * Body: { storeId, subject?, subOrderId? }
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';
    const body = await request.json();
    const { storeId, subject, subOrderId } = body;

    // Validate required fields
    if (!storeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: storeId',
        },
        { status: 400 }
      );
    }

    // Verify user is a customer
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only customers can create conversations',
        },
        { status: 403 }
      );
    }

    // Verify store exists
    const store = await db.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: 'Store not found',
        },
        { status: 404 }
      );
    }

    // If subOrderId provided, verify it exists and belongs to this store
    if (subOrderId) {
      const subOrder = await db.subOrder.findUnique({
        where: { id: subOrderId },
        select: { storeId: true },
      });

      if (!subOrder || subOrder.storeId !== storeId) {
        return NextResponse.json(
          {
            success: false,
            error: 'SubOrder not found or does not belong to this store',
          },
          { status: 404 }
        );
      }
    }

    // Check if conversation already exists
    const existingConversation = await (db as any).conversation.findFirst({
      where: {
        customerId: userId,
        storeId,
        subOrderId: subOrderId || null,
      },
    });

    if (existingConversation) {
      return NextResponse.json(
        {
          success: true,
          data: existingConversation,
          message: 'Conversation already exists',
        },
        { status: 200 }
      );
    }

    // Create conversation
    const conversation = await (db as any).conversation.create({
      data: {
        customerId: userId,
        storeId,
        subject: subject || null,
        subOrderId: subOrderId || null,
      },
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
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: conversation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/conversations]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create conversation',
      },
      { status: 500 }
    );
  }
}
