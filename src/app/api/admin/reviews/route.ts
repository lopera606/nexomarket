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
    const rating = searchParams.get("rating");

    const where: any = {};

    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      where.status = status;
    }

    if (rating) {
      const ratingNum = parseInt(rating);
      if (ratingNum >= 1 && ratingNum <= 5) {
        where.rating = ratingNum;
      }
    }

    if (search) {
      where.OR = [
        { customer: { firstName: { contains: search, mode: "insensitive" } } },
        { customer: { lastName: { contains: search, mode: "insensitive" } } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
        product: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const mapped = reviews.map(r => ({
      id: r.id,
      user: `${r.customer.firstName} ${r.customer.lastName}`,
      product: r.product.name,
      rating: r.rating,
      title: r.title,
      text: r.body || "",
      status: r.status,
      date: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ reviews: mapped });
  } catch (error) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Se requiere id y status (APPROVED o REJECTED)" },
        { status: 400 }
      );
    }

    const review = await db.review.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("PUT /api/admin/reviews error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
