import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if ((session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Platform-wide stats in parallel
    const [
      gmvResult,
      gmvLastMonth,
      commissionsResult,
      totalUsers,
      totalStores,
      totalOrders,
      totalProducts,
      pendingStores,
      recentOrders,
      topStoresRaw,
      monthlyRevenueRaw,
    ] = await Promise.all([
      // GMV this month
      db.order.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { grandTotal: true },
        _count: true,
      }),
      // GMV last month
      db.order.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
        _sum: { grandTotal: true },
      }),
      // Total commissions
      db.subOrder.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _sum: { platformCommission: true },
      }),
      // Total users
      db.user.count(),
      // Total stores
      db.store.count(),
      // Total orders
      db.order.count(),
      // Total products
      db.product.count({ where: { status: "ACTIVE" } }),
      // Pending store approvals
      db.store.findMany({
        where: { status: "PENDING" },
        select: {
          id: true,
          name: true,
          owner: { select: { firstName: true, lastName: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      // Recent orders
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          grandTotal: true,
          status: true,
          createdAt: true,
          customer: { select: { firstName: true, lastName: true } },
        },
      }),
      // Top stores by revenue (from SubOrders)
      db.subOrder.groupBy({
        by: ["storeId"],
        _sum: { subtotal: true },
        _count: true,
        orderBy: { _sum: { subtotal: "desc" } },
        take: 5,
      }),
      // Monthly revenue for last 12 months
      db.order.findMany({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear() - 1, now.getMonth(), 1),
          },
        },
        select: { grandTotal: true, createdAt: true },
      }),
    ]);

    // Resolve top stores with names
    const topStoreIds = topStoresRaw.map((s) => s.storeId);
    const storeDetails = await db.store.findMany({
      where: { id: { in: topStoreIds } },
      select: { id: true, name: true, avgRating: true },
    });

    const storeMap = new Map(storeDetails.map((s) => [s.id, s]));
    const topStores = topStoresRaw.map((s, idx) => {
      const store = storeMap.get(s.storeId);
      return {
        id: s.storeId,
        rank: idx + 1,
        name: store?.name || "Tienda desconocida",
        revenue: Number(s._sum.subtotal) || 0,
        orders: s._count,
        rating: Number(store?.avgRating) || 0,
      };
    });

    // Build monthly revenue chart (last 12 months)
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const revenueByMonth: { month: string; value: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      const monthRevenue = monthlyRevenueRaw
        .filter((o) => o.createdAt >= m && o.createdAt < mEnd)
        .reduce((sum, o) => sum + Number(o.grandTotal), 0);
      revenueByMonth.push({
        month: monthNames[m.getMonth()],
        value: Math.round(monthRevenue * 100) / 100,
      });
    }

    const totalRevenueYear = revenueByMonth.reduce((s, m) => s + m.value, 0);
    const avgMonthlyRevenue = Math.round(totalRevenueYear / 12);
    const peakRevenue = Math.max(...revenueByMonth.map((m) => m.value));

    const gmv = Number(gmvResult._sum.grandTotal) || 0;
    const gmvLast = Number(gmvLastMonth._sum.grandTotal) || 0;
    const gmvChange = gmvLast > 0 ? Math.round(((gmv - gmvLast) / gmvLast) * 100) : 0;
    const commissions = Number(commissionsResult._sum.platformCommission) || 0;

    // Recent activity from recent orders + pending stores
    const recentActivity = [
      ...pendingStores.slice(0, 2).map((s) => ({
        id: s.id,
        type: "store_registered",
        title: "Nueva tienda registrada",
        description: s.name,
        time: formatTimeAgo(s.createdAt),
        dotColor: "#5B2FE8",
      })),
      ...recentOrders.slice(0, 3).map((o) => ({
        id: o.id,
        type: "order_completed",
        title: `Pedido ${o.status === "DELIVERED" ? "completado" : "nuevo"}`,
        description: `${o.orderNumber} - €${Number(o.grandTotal).toFixed(2)}`,
        time: formatTimeAgo(o.createdAt),
        dotColor: o.status === "DELIVERED" ? "#10B981" : "#FF6B35",
      })),
    ].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5);

    return NextResponse.json({
      stats: {
        gmv: { value: gmv, change: gmvChange },
        commissions: { value: commissions, change: gmvChange },
        orders: { value: totalOrders, change: gmvChange },
        users: { value: totalUsers, change: 0 },
        stores: { value: totalStores, change: 0 },
        products: { value: totalProducts, change: 0 },
      },
      revenueChart: revenueByMonth,
      revenueSummary: {
        total: Math.round(totalRevenueYear),
        average: avgMonthlyRevenue,
        peak: Math.round(peakRevenue),
      },
      pendingStores: pendingStores.map((s) => ({
        id: s.id,
        name: s.name,
        owner: `${s.owner.firstName} ${s.owner.lastName}`.trim(),
        appliedDate: s.createdAt.toISOString().split("T")[0],
      })),
      recentActivity,
      topStores,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return "hace unos minutos";
}
