import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * GET /api/commissions/[id]
 * Get a single commission tier detail
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tier = await (db as any).commissionTier.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!tier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Commission tier not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: tier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/commissions/[id]]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commission tier',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/commissions/[id]
 * Update a commission tier (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if tier exists
    const existingTier = await (db as any).commissionTier.findUnique({
      where: { id },
    });

    if (!existingTier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Commission tier not found',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      baseRate,
      minRate,
      maxRate,
      volumeDiscount,
      volumeThreshold,
      isActive,
    } = body;

    // Validate rates if provided
    if (baseRate !== undefined && minRate !== undefined && maxRate !== undefined) {
      if (baseRate < minRate || baseRate > maxRate) {
        return NextResponse.json(
          {
            success: false,
            error: 'Base rate must be between min and max rates',
          },
          { status: 400 }
        );
      }
    }

    const updatedTier = await (db as any).commissionTier.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(baseRate !== undefined && { baseRate: parseFloat(baseRate) }),
        ...(minRate !== undefined && { minRate: parseFloat(minRate) }),
        ...(maxRate !== undefined && { maxRate: parseFloat(maxRate) }),
        ...(volumeDiscount !== undefined && { volumeDiscount: parseFloat(volumeDiscount) }),
        ...(volumeThreshold !== undefined && { volumeThreshold }),
        ...(isActive !== undefined && { isActive }),
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
        data: updatedTier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[PATCH /api/commissions/[id]]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update commission tier',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/commissions/[id]
 * Deactivate a commission tier (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if tier exists
    const existingTier = await (db as any).commissionTier.findUnique({
      where: { id },
    });

    if (!existingTier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Commission tier not found',
        },
        { status: 404 }
      );
    }

    // Soft deactivate instead of hard delete
    const deactivatedTier = await (db as any).commissionTier.update({
      where: { id },
      data: {
        isActive: false,
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
        data: deactivatedTier,
        message: 'Commission tier deactivated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[DELETE /api/commissions/[id]]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to deactivate commission tier',
      },
      { status: 500 }
    );
  }
}
