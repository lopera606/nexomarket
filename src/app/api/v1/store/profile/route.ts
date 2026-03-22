import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

interface UpdateProfileBody {
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  email?: string;
  phone?: string;
  returnPolicy?: Record<string, any>;
  socialLinks?: Record<string, string>;
}

/**
 * GET /api/v1/store/profile
 * Get store profile information
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;

    const store = await db.store.findUnique({
      where: { id: storeId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        apiResponse(false, undefined, "Store not found"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      apiResponse(true, {
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        logoUrl: store.logoUrl,
        bannerUrl: store.bannerUrl,
        email: store.email,
        phone: store.phone,
        status: store.status,
        planTier: store.planTier,
        avgRating: store.avgRating.toString(),
        totalReviews: store.totalReviews,
        commissionRate: store.commissionRate.toString(),
        maxProducts: store.maxProducts,
        returnPolicy: store.returnPolicy,
        socialLinks: store.socialLinks,
        stripeOnboarded: store.stripeOnboarded,
        owner: {
          id: store.owner.id,
          email: store.owner.email,
          firstName: store.owner.firstName,
          lastName: store.owner.lastName,
        },
        subscription: store.subscription ? {
          status: store.subscription.status,
          currentPeriodStart: store.subscription.currentPeriodStart,
          currentPeriodEnd: store.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: store.subscription.cancelAtPeriodEnd,
          plan: {
            tier: store.subscription.plan.tier,
            name: store.subscription.plan.name,
            monthlyPrice: store.subscription.plan.monthlyPriceCents / 100,
            commissionRate: store.subscription.plan.commissionRate.toString(),
            maxProducts: store.subscription.plan.maxProducts,
          },
        } : null,
        approvedAt: store.approvedAt,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      })
    );
  } catch (error) {
    console.error("GET /api/v1/store/profile error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/store/profile
 * Update store profile information
 */
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;

    let body: UpdateProfileBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (body.name !== undefined && body.name.trim() !== "") {
      updateData.name = body.name;
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    if (body.logoUrl !== undefined) {
      updateData.logoUrl = body.logoUrl || null;
    }

    if (body.bannerUrl !== undefined) {
      updateData.bannerUrl = body.bannerUrl || null;
    }

    if (body.email !== undefined) {
      updateData.email = body.email || null;
    }

    if (body.phone !== undefined) {
      updateData.phone = body.phone || null;
    }

    if (body.returnPolicy !== undefined) {
      updateData.returnPolicy = body.returnPolicy || null;
    }

    if (body.socialLinks !== undefined) {
      updateData.socialLinks = body.socialLinks || null;
    }

    // Update the store
    const updatedStore = await db.store.update({
      where: { id: storeId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      apiResponse(true, {
        id: updatedStore.id,
        name: updatedStore.name,
        slug: updatedStore.slug,
        description: updatedStore.description,
        logoUrl: updatedStore.logoUrl,
        bannerUrl: updatedStore.bannerUrl,
        email: updatedStore.email,
        phone: updatedStore.phone,
        returnPolicy: updatedStore.returnPolicy,
        socialLinks: updatedStore.socialLinks,
        updatedAt: updatedStore.updatedAt,
      })
    );
  } catch (error) {
    console.error("PUT /api/v1/store/profile error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
