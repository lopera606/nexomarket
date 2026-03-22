import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * GET /api/conversations/[id]
 * Get conversation detail with messages (paginated)
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

    // Fetch conversation with pagination
    const conversation = await (db as any).conversation.findUnique({
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
          },
        },
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

    // Fetch paginated messages
    const [messages, messageTotal] = await Promise.all([
      (db as any).chatMessage.findMany({
        where: { conversationId: id },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
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

    // Reverse messages to show chronological order
    const messagesChronological = messages.reverse();

    return NextResponse.json(
      {
        success: true,
        data: {
          conversation,
          messages: messagesChronological,
          messagePagination: {
            page,
            limit,
            total: messageTotal,
            pages: Math.ceil(messageTotal / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/conversations/[id]]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversation',
      },
      { status: 500 }
    );
  }
}
