import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

/**
 * GET /api/v1/store/payouts
 * List all payouts for the authenticated store
 * Query params: page (default 1), limit (default 20), status, dateFrom, dateTo
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build filter conditions
    const where: any = {
      storeId,
    };

    if (status) {
      where.status = status as any;
    }

    if (dateFrom) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(dateFrom),
      };
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt = {
        ...where.createdAt,
        lte: toDate,
      };
    }

    // Get total count for pagination
    const total = await db.sellerPayout.count({ where });

    // Fetch payouts with pagination
    const payouts = await db.sellerPayout.findMany({
      where,
      include: {
        subOrder: {
          select: {
            id: true,
            subOrderNumber: true,
            status: true,
            subtotal: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPages = Math.ceil(total / limit);

    // Calculate summary statistics
    const stats = await db.sellerPayout.aggregate({
      where,
      _sum: {
        amount: true,
        commissionDeducted: true,
      },
      _count: true,
    });

    const formattedPayouts = payouts.map((payout: any) => ({
      id: payout.id,
      status: payout.status,
      amount: payout.amount.toString(),
      commissionDeducted: payout.commissionDeducted.toString(),
      currency: payout.currency,
      stripeTransferId: payout.stripeTransferId,
      subOrder: {
        id: payout.subOrder.id,
        subOrderNumber: payout.subOrder.subOrderNumber,
        status: payout.subOrder.status,
        subtotal: payout.subOrder.subtotal.toString(),
      },
      paidAt: payout.paidAt,
      createdAt: payout.createdAt,
    }));

    return NextResponse.json(
      apiResponse(true, formattedPayouts, undefined, {
        page,
        limit,
        total,
        totalPages,
      }),
      {
        headers: {
          "x-total-amount": (stats._sum.amount || 0).toString(),
          "x-total-commission": (stats._sum.commissionDeducted || 0).toString(),
        },
      }
    );
  } catch (error) {
    console.error("GET /api/v1/store/payouts error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
