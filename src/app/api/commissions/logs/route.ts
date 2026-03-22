import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * GET /api/commissions/logs
 * List commission logs, filterable by storeId and dateRange
 * Query params: storeId, startDate, endDate, status, page, limit
 * Returns paginated results with totals
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
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

    const where: any = {};

    // Filter by store if provided
    if (storeId) {
      where.storeId = storeId;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Fetch logs and count
    const [logs, total] = await Promise.all([
      (db as any).commissionLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (db as any).commissionLog.count({ where }),
    ]);

    // Calculate totals for filtered results
    const aggregates = await (db as any).commissionLog.aggregate({
      where,
      _sum: {
        orderTotal: true,
        commissionAmount: true,
        sellerAmount: true,
      },
      _avg: {
        commissionRate: true,
      },
    });

    const totals = {
      totalOrders: total,
      totalOrderAmount: aggregates._sum.orderTotal
        ? parseFloat(aggregates._sum.orderTotal.toString())
        : 0,
      totalCommissionCollected: aggregates._sum.commissionAmount
        ? parseFloat(aggregates._sum.commissionAmount.toString())
        : 0,
      totalSellerAmount: aggregates._sum.sellerAmount
        ? parseFloat(aggregates._sum.sellerAmount.toString())
        : 0,
      avgCommissionRate: aggregates._avg.commissionRate
        ? parseFloat(aggregates._avg.commissionRate.toString())
        : 0,
    };

    return NextResponse.json(
      {
        success: true,
        data: logs,
        totals,
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
    console.error('[GET /api/commissions/logs]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commission logs',
      },
      { status: 500 }
    );
  }
}
