import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Decimal } from '@prisma/client/runtime/library';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

interface CalculationRequest {
  orderTotal: number;
  categoryId?: string;
  storeId?: string;
}

interface CalculationResponse {
  commissionRate: number;
  commissionAmount: number;
  sellerAmount: number;
  tierName: string | null;
}

/**
 * POST /api/commissions/calculate
 * Calculate commission for a given order amount and category
 * Body: { orderTotal, categoryId?, storeId? }
 * Returns: { commissionRate, commissionAmount, sellerAmount, tierName }
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    const { orderTotal, categoryId, storeId } = body;

    // Validate orderTotal
    if (orderTotal === undefined || orderTotal <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid orderTotal. Must be a positive number.',
        },
        { status: 400 }
      );
    }

    let commissionRate = 6; // Default platform rate
    let tierName: string | null = null;

    // Step 1: Try to get category-specific commission tier
    if (categoryId) {
      const categoryTier = await (db as any).commissionTier.findFirst({
        where: {
          categoryId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          baseRate: true,
          volumeDiscount: true,
          volumeThreshold: true,
        },
      });

      if (categoryTier) {
        commissionRate = parseFloat(categoryTier.baseRate.toString());
        tierName = categoryTier.name;

        // Apply volume discount if store exceeds threshold
        if (storeId && categoryTier.volumeThreshold > 0) {
          const monthlyVolume = await getStoreMonthlyVolume(storeId);
          if (monthlyVolume >= categoryTier.volumeThreshold) {
            const volumeDiscount = parseFloat(categoryTier.volumeDiscount.toString());
            commissionRate = Math.max(0, commissionRate - volumeDiscount);
          }
        }

        return calculateAndRespond(orderTotal, commissionRate, tierName);
      }
    }

    // Step 2: Try to get store-specific commission rate
    if (storeId) {
      const store = await db.store.findUnique({
        where: { id: storeId },
        select: { commissionRate: true },
      });

      if (store) {
        commissionRate = parseFloat(store.commissionRate.toString());
        tierName = 'Store Default';
        return calculateAndRespond(orderTotal, commissionRate, tierName);
      }
    }

    // Step 3: Get platform default from settings
    const defaultSettings = await (db as any).platformSettings.findUnique({
      where: { key: 'defaultCommissionRate' },
      select: { value: true },
    });

    if (defaultSettings) {
      commissionRate = parseFloat(defaultSettings.value);
      tierName = 'Platform Default';
    }

    return calculateAndRespond(orderTotal, commissionRate, tierName);
  } catch (error) {
    console.error('[POST /api/commissions/calculate]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate commission',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate commission and return response
 */
function calculateAndRespond(
  orderTotal: number,
  commissionRate: number,
  tierName: string | null
): NextResponse {
  const orderTotalDecimal = new Decimal(orderTotal);
  const rateDecimal = new Decimal(commissionRate / 100);

  const commissionAmount = parseFloat(orderTotalDecimal.times(rateDecimal).toFixed(2));
  const sellerAmount = parseFloat(orderTotalDecimal.minus(new Decimal(commissionAmount)).toFixed(2));

  const response: CalculationResponse = {
    commissionRate,
    commissionAmount,
    sellerAmount,
    tierName,
  };

  return NextResponse.json(
    {
      success: true,
      data: response,
    },
    { status: 200 }
  );
}

/**
 * Helper function to get store's monthly sales volume
 */
async function getStoreMonthlyVolume(storeId: string): Promise<number> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await (db as any).commissionLog.aggregate({
    where: {
      storeId,
      createdAt: {
        gte: monthStart,
        lt: now,
      },
    },
    _sum: {
      orderTotal: true,
    },
  });

  return result._sum.orderTotal ? parseFloat(result._sum.orderTotal.toString()) : 0;
}
