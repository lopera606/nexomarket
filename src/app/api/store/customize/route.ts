import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * GET /api/store/customize?storeId=xxx
 * Get store customization data
 */
export async function GET(request: NextRequest) {
  try {
    const storeId = request.nextUrl.searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
    }

    const store = await db.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        email: true,
        phone: true,
        socialLinks: true,
        brandColors: true,
        businessHours: true,
        shippingInfo: true,
        storeFeatures: true,
        seoMetadata: true,
        paymentMethods: true,
        announcement: true,
        announcementActive: true,
        location: true,
        languages: true,
        certifications: true,
        faqContent: true,
        returnPolicy: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error('GET /api/store/customize error:', error);
    return NextResponse.json({ error: 'Failed to fetch store data' }, { status: 500 });
  }
}

/**
 * PATCH /api/store/customize
 * Update store customization settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, ...updates } = body;

    if (!storeId) {
      return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
    }

    // Validate store exists
    const store = await db.store.findUnique({
      where: { id: storeId },
      select: { id: true, ownerId: true },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Build update data - only include fields that are present
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.logoUrl !== undefined) updateData.logoUrl = updates.logoUrl;
    if (updates.bannerUrl !== undefined) updateData.bannerUrl = updates.bannerUrl;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;

    // JSON fields
    if (updates.socialLinks !== undefined) updateData.socialLinks = updates.socialLinks;
    if (updates.brandColors !== undefined) updateData.brandColors = updates.brandColors;
    if (updates.businessHours !== undefined) updateData.businessHours = updates.businessHours;
    if (updates.shippingInfo !== undefined) updateData.shippingInfo = updates.shippingInfo;
    if (updates.storeFeatures !== undefined) updateData.storeFeatures = updates.storeFeatures;
    if (updates.seoMetadata !== undefined) updateData.seoMetadata = updates.seoMetadata;
    if (updates.paymentMethods !== undefined) updateData.paymentMethods = updates.paymentMethods;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.certifications !== undefined) updateData.certifications = updates.certifications;
    if (updates.faqContent !== undefined) updateData.faqContent = updates.faqContent;
    if (updates.returnPolicy !== undefined) updateData.returnPolicy = updates.returnPolicy;

    // Simple fields
    if (updates.announcement !== undefined) updateData.announcement = updates.announcement;
    if (updates.announcementActive !== undefined) updateData.announcementActive = updates.announcementActive;
    if (updates.languages !== undefined) updateData.languages = updates.languages;

    const updatedStore = await db.store.update({
      where: { id: storeId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      store: {
        id: updatedStore.id,
        name: updatedStore.name,
        slug: updatedStore.slug,
      },
    });
  } catch (error) {
    console.error('PATCH /api/store/customize error:', error);

    // Handle unique constraint violations (e.g., slug already taken)
    if ((error as any)?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe una tienda con ese URL. Elige otro.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update store customization' },
      { status: 500 }
    );
  }
}
