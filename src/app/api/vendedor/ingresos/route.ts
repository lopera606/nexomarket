import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    const now = new Date();
    let startDate: Date;
    let previousStart: Date;

    switch (period) {
      case "30d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        previousStart = new Date(startDate);
        previousStart.setDate(previousStart.getDate() - 30);
        break;
      case "90d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 90);
        previousStart = new Date(startDate);
        previousStart.setDate(previousStart.getDate() - 90);
        break;
      case "12m":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        previousStart = new Date(startDate);
        previousStart.setFullYear(previousStart.getFullYear() - 1);
        break;
      default: // 7d
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        previousStart = new Date(startDate);
        previousStart.setDate(previousStart.getDate() - 7);
    }

    // Current period suborders
    const currentSubOrders = await db.subOrder.findMany({
      where: {
        storeId: store.id,
        createdAt: { gte: startDate },
      },
      select: { subtotal: true, createdAt: true, platformCommission: true, sellerPayout: true },
    });

    // Previous period revenue
    const prevRevenue = await db.subOrder.aggregate({
      where: {
        storeId: store.id,
        createdAt: { gte: previousStart, lt: startDate },
      },
      _sum: { subtotal: true },
      _count: true,
    });

    const totalRevenue = currentSubOrders.reduce((sum, so) => sum + Number(so.subtotal), 0);
    const prevTotal = Number(prevRevenue._sum.subtotal) || 0;
    const change = prevTotal > 0 ? Math.round(((totalRevenue - prevTotal) / prevTotal) * 100) : 0;

    // Build daily/monthly chart data
    const daily: number[] = [];
    const days: string[] = [];
    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    if (period === "12m") {
      // Monthly buckets
      for (let i = 11; i >= 0; i--) {
        const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mEnd = new Date(m.getFullYear(), m.getMonth() + 1, 1);
        const monthRev = currentSubOrders
          .filter((so) => so.createdAt >= m && so.createdAt < mEnd)
          .reduce((sum, so) => sum + Number(so.subtotal), 0);
        daily.push(Math.round(monthRev * 100) / 100);
        days.push(monthLabels[m.getMonth()]);
      }
    } else {
      const numDays = period === "7d" ? 7 : period === "30d" ? 30 : 90;
      for (let i = numDays - 1; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const dayRev = currentSubOrders
          .filter((so) => so.createdAt >= dayStart && so.createdAt < dayEnd)
          .reduce((sum, so) => sum + Number(so.subtotal), 0);
        daily.push(Math.round(dayRev * 100) / 100);
        if (numDays <= 7) {
          days.push(dayLabels[day.getDay()]);
        }
      }
    }

    // Revenue by category
    const categoryRevenue = await db.orderItem.groupBy({
      by: ["productId"],
      where: {
        subOrder: { storeId: store.id, createdAt: { gte: startDate } },
      },
      _sum: { totalPrice: true },
    });

    const productIds = categoryRevenue.map((c) => c.productId);
    const productsWithCategory = productIds.length > 0
      ? await db.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            category: { select: { name: true } },
          },
        })
      : [];

    const productCategoryMap = new Map(
      productsWithCategory.map((p) => [p.id, p.category?.name || "Sin categoría"])
    );

    const categoryMap = new Map<string, number>();
    categoryRevenue.forEach((cr) => {
      const catName = productCategoryMap.get(cr.productId) || "Sin categoría";
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + Number(cr._sum.totalPrice));
    });

    const totalCatRevenue = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0) || 1;
    const categories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => ({
        name: entry[0],
        revenue: Math.round(entry[1] * 100) / 100,
        percentage: Math.round((entry[1] / totalCatRevenue) * 100),
      }));

    // Top products
    const topProducts = await db.product.findMany({
      where: { storeId: store.id, status: "ACTIVE" },
      orderBy: { totalSold: "desc" },
      take: 5,
      select: { name: true, totalSold: true, basePrice: true },
    });

    // Summary stats
    const ordersCount = currentSubOrders.length;
    const avgTicket = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;
    const prevOrders = prevRevenue._count || 0;
    const ordersChange = prevOrders > 0 ? Math.round(((ordersCount - prevOrders) / prevOrders) * 100) : 0;

    return NextResponse.json({
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        change,
        trend: change >= 0 ? "up" : "down",
      },
      chart: { daily, days },
      categories,
      topProducts: topProducts.map((p) => ({
        name: p.name,
        revenue: p.totalSold * Number(p.basePrice),
        orders: p.totalSold,
      })),
      summary: {
        avgTicket,
        ordersCount,
        ordersChange,
        conversionRate: 3.2, // Would need analytics data for real conversion rate
      },
    });
  } catch (error) {
    console.error("Error fetching seller revenue:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
