import { NextResponse } from "next/server";
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

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Current month sub-orders
    const currentSubOrders = await db.subOrder.findMany({
      where: {
        storeId: store.id,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["ACCEPTED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
      select: {
        sellerPayout: true,
        createdAt: true,
        order: {
          select: { customerId: true },
        },
      },
    });

    // Previous month sub-orders for comparison
    const prevSubOrders = await db.subOrder.findMany({
      where: {
        storeId: store.id,
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        status: { in: ["ACCEPTED", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
      select: {
        sellerPayout: true,
      },
    });

    const currentRevenue = currentSubOrders.reduce((sum, so) => sum + Number(so.sellerPayout), 0);
    const prevRevenue = prevSubOrders.reduce((sum, so) => sum + Number(so.sellerPayout), 0);
    const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    const currentOrders = currentSubOrders.length;
    const prevOrders = prevSubOrders.length;
    const ordersChange = prevOrders > 0 ? ((currentOrders - prevOrders) / prevOrders) * 100 : 0;

    const uniqueCustomers = new Set(currentSubOrders.map(so => so.order.customerId));
    const avgTicket = currentOrders > 0 ? currentRevenue / currentOrders : 0;

    // Top products by sales
    const topProducts = await db.orderItem.groupBy({
      by: ["productId", "productName"],
      where: {
        subOrder: {
          storeId: store.id,
          createdAt: { gte: thirtyDaysAgo },
          status: { in: ["ACCEPTED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        },
      },
      _sum: { totalPrice: true, quantity: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 5,
    });

    // Revenue by day of week
    const revenueByDay: Record<string, number> = {
      Lun: 0, Mar: 0, Mie: 0, Jue: 0, Vie: 0, Sab: 0, Dom: 0,
    };
    const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    currentSubOrders.forEach(so => {
      const dayName = dayNames[so.createdAt.getDay()];
      revenueByDay[dayName] += Number(so.sellerPayout);
    });

    return NextResponse.json({
      monthly: {
        revenue: currentRevenue,
        revenueChange: Number(revenueChange.toFixed(1)),
        orders: currentOrders,
        ordersChange: Number(ordersChange.toFixed(1)),
        newClients: uniqueCustomers.size,
        avgTicket: Number(avgTicket.toFixed(2)),
      },
      topProducts: topProducts.map(p => ({
        name: p.productName,
        productId: p.productId,
        revenue: Number(p._sum.totalPrice || 0),
        quantity: p._sum.quantity || 0,
      })),
      revenueByDay,
    });
  } catch (error) {
    console.error("GET /api/vendedor/estadisticas error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
