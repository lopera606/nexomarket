import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * GET /api/commissions
 * List all commission tiers with category info
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [tiers, total] = await Promise.all([
      (db as any).commissionTier.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (db as any).commissionTier.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: tiers,
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
    console.error('[GET /api/commissions]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commission tiers',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/commissions
 * Create a new commission tier (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Admin access required.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      categoryId,
      name,
      description,
      baseRate,
      minRate,
      maxRate,
      volumeDiscount,
      volumeThreshold,
    } = body;

    // Validate required fields
    if (!name || baseRate === undefined || minRate === undefined || maxRate === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, baseRate, minRate, maxRate',
        },
        { status: 400 }
      );
    }

    // Validate rates
    if (baseRate < minRate || baseRate > maxRate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Base rate must be between min and max rates',
        },
        { status: 400 }
      );
    }

    // If categoryId provided, verify it exists
    if (categoryId) {
      const category = await db.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category not found',
          },
          { status: 404 }
        );
      }
    }

    const tier = await (db as any).commissionTier.create({
      data: {
        categoryId: categoryId || null,
        name,
        description: description || null,
        baseRate: parseFloat(baseRate),
        minRate: parseFloat(minRate),
        maxRate: parseFloat(maxRate),
        volumeDiscount: volumeDiscount ? parseFloat(volumeDiscount) : 0,
        volumeThreshold: volumeThreshold || 0,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: tier,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/commissions]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create commission tier',
      },
      { status: 500 }
    );
  }
}
