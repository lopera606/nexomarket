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
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && ["PENDING", "ACTIVE", "SUSPENDED"].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { owner: { firstName: { contains: search, mode: "insensitive" } } },
        { owner: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const stores = await db.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        planTier: true,
        avgRating: true,
        totalReviews: true,
        commissionRate: true,
        createdAt: true,
        approvedAt: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            products: true,
            subOrders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Get revenue per store from suborders
    const storesWithRevenue = await Promise.all(
      stores.map(async (store) => {
        const revenue = await db.subOrder.aggregate({
          where: { storeId: store.id, status: { in: ["DELIVERED", "SHIPPED"] } },
          _sum: { total: true },
        });
        return {
          ...store,
          revenue: revenue._sum.total ? Number(revenue._sum.total) : 0,
        };
      })
    );

    return NextResponse.json(storesWithRevenue);
  } catch (error) {
    console.error("GET /api/admin/stores error:", error);
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

    if (!id || !status) {
      return NextResponse.json({ error: "Se requiere id y status" }, { status: 400 });
    }

    if (!["PENDING", "ACTIVE", "SUSPENDED"].includes(status)) {
      return NextResponse.json({ error: "Status invalido" }, { status: 400 });
    }

    const store = await db.store.update({
      where: { id },
      data: {
        status,
        ...(status === "ACTIVE" && { approvedAt: new Date() }),
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("PUT /api/admin/stores error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
