import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * GET /api/conversations/[id]/messages
 * Get messages for a conversation (paginated)
 * Query params: page, limit
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

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

    // Verify conversation exists
    const conversation = await (db as any).conversation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    // Fetch paginated messages
    const [messages, total] = await Promise.all([
      (db as any).chatMessage.findMany({
        where: { conversationId: id },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (db as any).chatMessage.count({ where: { conversationId: id } }),
    ]);

    // Reverse to show chronological order
    const messagesChronological = messages.reverse();

    return NextResponse.json(
      {
        success: true,
        data: messagesChronological,
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
    console.error('[GET /api/conversations/[id]/messages]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Send a message in the conversation
 * Body: { body, attachments? }
 * Updates conversation lastMessageAt
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';
    const { id } = await params;
    const body = await request.json();
    const { body: messageBody, attachments } = body;

    // Validate required fields
    if (!messageBody || typeof messageBody !== 'string' || messageBody.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message body is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await (db as any).conversation.findUnique({
      where: { id },
      select: {
        id: true,
        customerId: true,
        storeId: true,
        isClosed: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    // Check if conversation is closed
    if (conversation.isClosed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot send messages to a closed conversation',
        },
        { status: 403 }
      );
    }

    // Verify user is either the customer or the seller of the store
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

    let senderRole = user.role;
    let isAuthorized = false;

    if (user.role === 'CUSTOMER' && conversation.customerId === userId) {
      isAuthorized = true;
    } else if (user.role === 'SELLER') {
      const store = await db.store.findFirst({
        where: {
          id: conversation.storeId,
          ownerId: userId,
        },
        select: { id: true },
      });
      isAuthorized = !!store;
    } else if (user.role === 'ADMIN') {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are not authorized to send messages in this conversation',
        },
        { status: 403 }
      );
    }

    // Create message
    const message = await (db as any).chatMessage.create({
      data: {
        conversationId: id,
        senderId: userId,
        senderRole,
        body: messageBody.trim(),
        attachments: attachments || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation lastMessageAt
    await (db as any).conversation.update({
      where: { id },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/conversations/[id]/messages]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
