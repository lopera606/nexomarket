import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

/**
 * GET /api/v1/store/stats
 * Get store statistics and analytics
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;

    // Fetch store basic info
    const store = await db.store.findUnique({
      where: { id: storeId },
      select: {
        avgRating: true,
        totalReviews: true,
      },
    });

    if (!store) {
      return NextResponse.json(
        apiResponse(false, undefined, "Store not found"),
        { status: 404 }
      );
    }

    // Count total products
    const totalProducts = await db.product.count({
      where: { storeId },
    });

    // Count total sub-orders
    const totalOrders = await db.subOrder.count({
      where: { storeId },
    });

    // Get revenue from payouts (sum of all seller payouts)
    const payoutStats = await db.sellerPayout.aggregate({
      where: { storeId },
      _sum: { amount: true },
    });

    const totalRevenue = payoutStats._sum.amount?.toString() || "0";

    // Get orders grouped by status
    const ordersByStatus = await db.subOrder.groupBy({
      by: ["status"],
      where: { storeId },
      _count: true,
    });

    const ordersByStatusMap: Record<string, number> = {};
    ordersByStatus.forEach((item: any) => {
      ordersByStatusMap[item.status] = item._count;
    });

    // Get top products by sales
    const topProducts = await db.product.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        basePrice: true,
        totalSold: true,
        avgRating: true,
        totalReviews: true,
      },
      orderBy: {
        totalSold: "desc",
      },
      take: 10,
    });

    // Get revenue by month (last 12 months)
    const revenueByMonth: Array<{
      month: string;
      revenue: string;
    }> = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const monthKey = `${year}-${month}`;

      const startDate = new Date(year, date.getMonth(), 1);
      const endDate = new Date(year, date.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      const monthRevenue = await db.sellerPayout.aggregate({
        where: {
          storeId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { amount: true },
      });

      revenueByMonth.push({
        month: monthKey,
        revenue: (monthRevenue._sum.amount || 0).toString(),
      });
    }

    return NextResponse.json(
      apiResponse(true, {
        totalRevenue,
        totalOrders,
        totalProducts,
        avgRating: store.avgRating.toString(),
        totalReviews: store.totalReviews,
        ordersByStatus: ordersByStatusMap,
        topProducts: topProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          basePrice: product.basePrice.toString(),
          totalSold: product.totalSold,
          avgRating: product.avgRating.toString(),
          totalReviews: product.totalReviews,
        })),
        revenueByMonth,
        summary: {
          activeProducts: await db.product.count({
            where: {
              storeId,
              status: "ACTIVE",
            },
          }),
          pendingOrders: ordersByStatusMap["PENDING"] || 0,
          shippedOrders: ordersByStatusMap["SHIPPED"] || 0,
          deliveredOrders: ordersByStatusMap["DELIVERED"] || 0,
          cancelledOrders: ordersByStatusMap["CANCELLED"] || 0,
        },
      })
    );
  } catch (error) {
    console.error("GET /api/v1/store/stats error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
