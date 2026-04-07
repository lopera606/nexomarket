import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    const reviews = await db.review.findMany({
      where: {
        product: { storeId: store.id },
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
        product: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Compute summary stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        ratingCounts[r.rating as keyof typeof ratingCounts]++;
      }
    });

    return NextResponse.json({
      reviews: reviews.map(r => ({
        id: r.id,
        author: `${r.customer.firstName} ${r.customer.lastName}`,
        rating: r.rating,
        title: r.title,
        body: r.body,
        product: r.product.name,
        productSlug: r.product.slug,
        isVerifiedPurchase: r.isVerifiedPurchase,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      })),
      summary: {
        totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
        ratingCounts,
      },
    });
  } catch (error) {
    console.error("GET /api/vendedor/resenas error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
