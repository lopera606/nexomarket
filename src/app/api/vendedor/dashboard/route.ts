import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
    });
    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Revenue this month (from SubOrders for this store)
    const revenueThisMonth = await db.subOrder.aggregate({
      where: {
        storeId: store.id,
        createdAt: { gte: startOfMonth },
      },
      _sum: { subtotal: true, platformCommission: true, sellerPayout: true },
      _count: true,
    });

    // Revenue last month for comparison
    const revenueLastMonth = await db.subOrder.aggregate({
      where: {
        storeId: store.id,
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
      _sum: { subtotal: true },
      _count: true,
    });

    // Active products count
    const activeProducts = await db.product.count({
      where: { storeId: store.id, status: "ACTIVE" },
    });

    const lastMonthProducts = await db.product.count({
      where: {
        storeId: store.id,
        status: "ACTIVE",
        createdAt: { lt: startOfMonth },
      },
    });

    // Average rating from store
    const avgRating = Number(store.avgRating) || 0;
    const totalReviews = store.totalReviews || 0;

    // Recent orders (last 10 SubOrders for this store)
    const recentOrders = await db.subOrder.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        order: {
          select: { orderNumber: true, customer: { select: { firstName: true, lastName: true } } },
        },
        items: {
          select: { productName: true, totalPrice: true, quantity: true },
        },
      },
    });

    // Top products by sales
    const topProducts = await db.product.findMany({
      where: { storeId: store.id, status: "ACTIVE" },
      orderBy: { totalSold: "desc" },
      take: 5,
      select: { id: true, name: true, totalSold: true, basePrice: true },
    });

    // Daily revenue for last 7 days
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySubOrders = await db.subOrder.findMany({
      where: {
        storeId: store.id,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { subtotal: true, createdAt: true },
    });

    // Build daily chart data
    const chartData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayRevenue = dailySubOrders
        .filter((so) => so.createdAt >= dayStart && so.createdAt < dayEnd)
        .reduce((sum, so) => sum + Number(so.subtotal), 0);
      chartData.push(Math.round(dayRevenue * 100) / 100);
    }

    // Commission rate
    const commissionRate = Number(store.commissionRate) || 6;
    const grossSales = Number(revenueThisMonth._sum.subtotal) || 0;
    const commission = Number(revenueThisMonth._sum.platformCommission) || 0;
    const netEarnings = Number(revenueThisMonth._sum.sellerPayout) || 0;
    const ordersThisMonth = revenueThisMonth._count || 0;

    // Calculate percentage changes
    const lastMonthGross = Number(revenueLastMonth._sum.subtotal) || 0;
    const lastMonthOrders = revenueLastMonth._count || 0;
    const revenueChange = lastMonthGross > 0 ? Math.round(((grossSales - lastMonthGross) / lastMonthGross) * 100) : 0;
    const ordersChange = lastMonthOrders > 0 ? Math.round(((ordersThisMonth - lastMonthOrders) / lastMonthOrders) * 100) : 0;
    const productsChange = activeProducts - lastMonthProducts;

    // Pending payout
    const pendingPayout = await db.sellerPayout.aggregate({
      where: { storeId: store.id, status: "PENDING" },
      _sum: { amount: true },
    });

    // Fulfillment rate (delivered vs total)
    const totalSubOrders = await db.subOrder.count({ where: { storeId: store.id } });
    const deliveredSubOrders = await db.subOrder.count({ where: { storeId: store.id, status: "DELIVERED" } });
    const fulfillmentRate = totalSubOrders > 0 ? Math.round((deliveredSubOrders / totalSubOrders) * 1000) / 10 : 0;

    // Map SubOrder status to display status
    const mapStatus = (status: string) => {
      switch (status) {
        case "PENDING":
        case "ACCEPTED":
        case "PROCESSING":
          return "En Preparación";
        case "SHIPPED":
          return "Enviado";
        case "DELIVERED":
          return "Entregado";
        case "CANCELLED":
          return "Cancelado";
        default:
          return status;
      }
    };

    return NextResponse.json({
      storeName: store.name,
      stats: {
        revenue: { value: grossSales, change: revenueChange },
        orders: { value: ordersThisMonth, change: ordersChange },
        products: { value: activeProducts, change: productsChange },
        rating: { value: avgRating, totalReviews },
      },
      commission: {
        rate: commissionRate,
        grossSales,
        commissionAmount: commission,
        netEarnings,
        transactions: ordersThisMonth,
        pendingPayout: Number(pendingPayout._sum.amount) || 0,
      },
      chartData,
      recentOrders: recentOrders.map((so) => ({
        id: so.subOrderNumber,
        product: so.items.map((i) => `${i.productName}${i.quantity > 1 ? ` x${i.quantity}` : ""}`).join(", "),
        amount: Number(so.subtotal),
        status: mapStatus(so.status),
        date: so.createdAt.toISOString(),
      })),
      topProducts: topProducts.map((p) => ({
        name: p.name,
        sales: p.totalSold,
        revenue: p.totalSold * Number(p.basePrice),
      })),
      fulfillmentRate,
    });
  } catch (error) {
    console.error("Error fetching seller dashboard:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
