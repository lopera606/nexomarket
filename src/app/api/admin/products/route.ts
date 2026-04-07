import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};

    if (status && ["DRAFT", "ACTIVE", "PAUSED", "DELETED"].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { store: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const products = await db.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        status: true,
        createdAt: true,
        store: {
          select: { name: true, slug: true },
        },
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
        variants: {
          select: { stockQuantity: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const mapped = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      store: p.store.name,
      storeSlug: p.store.slug,
      price: Number(p.basePrice),
      stock: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
      status: p.status,
      imageUrl: p.images[0]?.url || null,
      date: p.createdAt.toISOString(),
    }));

    return NextResponse.json({ products: mapped });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
