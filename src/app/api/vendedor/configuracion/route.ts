import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        email: true,
        phone: true,
        status: true,
        planTier: true,
        commissionRate: true,
        maxProducts: true,
        stripeOnboarded: true,
        returnPolicy: true,
        socialLinks: true,
        brandColors: true,
        businessHours: true,
        shippingInfo: true,
        announcement: true,
        announcementActive: true,
        location: true,
        avgRating: true,
        totalReviews: true,
        createdAt: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("GET /api/vendedor/configuracion error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      email,
      phone,
      slug,
      returnPolicy,
      socialLinks,
      brandColors,
      businessHours,
      shippingInfo,
      announcement,
      announcementActive,
      location,
    } = body;

    // Validate slug uniqueness if changed
    if (slug && slug !== store.slug) {
      const slugTaken = await db.store.findUnique({ where: { slug } });
      if (slugTaken) {
        return NextResponse.json({ error: "Ese slug ya esta en uso" }, { status: 409 });
      }
    }

    const updated = await db.store.update({
      where: { id: store.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(slug && { slug: slug.trim() }),
        ...(returnPolicy !== undefined && { returnPolicy }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(brandColors !== undefined && { brandColors }),
        ...(businessHours !== undefined && { businessHours }),
        ...(shippingInfo !== undefined && { shippingInfo }),
        ...(announcement !== undefined && { announcement }),
        ...(announcementActive !== undefined && { announcementActive }),
        ...(location !== undefined && { location }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        email: true,
        phone: true,
        status: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/vendedor/configuracion error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
