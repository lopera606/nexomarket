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

    if (status && ["PENDING", "CONFIRMED", "PARTIALLY_SHIPPED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customer: { firstName: { contains: search, mode: "insensitive" } } },
        { customer: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orders = await db.order.findMany({
      where,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        grandTotal: true,
        currency: true,
        createdAt: true,
        customer: {
          select: { firstName: true, lastName: true, email: true },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const mapped = orders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: `${o.customer.firstName} ${o.customer.lastName}`,
      customerEmail: o.customer.email,
      items: o._count.items,
      total: Number(o.grandTotal),
      currency: o.currency,
      status: o.status,
      date: o.createdAt.toISOString(),
    }));

    return NextResponse.json({ orders: mapped });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
