import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

/**
 * GET /api/v1/orders
 * List all sub-orders for the authenticated store
 * Query params: page (default 1), limit (default 20), status, dateFrom, dateTo, search
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
    const search = searchParams.get("search");

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

    // If search is provided, search in related order and customer data
    if (search) {
      where.OR = [
        { subOrderNumber: { contains: search, mode: "insensitive" } },
        {
          order: {
            orderNumber: { contains: search, mode: "insensitive" },
          },
        },
        {
          order: {
            customer: {
              email: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // Get total count for pagination
    const total = await db.subOrder.count({ where });

    // Fetch sub-orders with pagination
    const subOrders = await db.subOrder.findMany({
      where,
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            shippingAddress: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        shipment: {
          select: {
            id: true,
            trackingNumber: true,
            carrier: true,
            status: true,
            labelUrl: true,
          },
        },
        payout: {
          select: {
            id: true,
            status: true,
            amount: true,
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

    const formattedSubOrders = subOrders.map((subOrder: any) => ({
      id: subOrder.id,
      subOrderNumber: subOrder.subOrderNumber,
      status: subOrder.status,
      subtotal: subOrder.subtotal.toString(),
      shippingCost: subOrder.shippingCost.toString(),
      platformCommission: subOrder.platformCommission.toString(),
      sellerPayout: subOrder.sellerPayout.toString(),
      sellerNotes: subOrder.sellerNotes,
      customer: {
        id: subOrder.order.customer.id,
        email: subOrder.order.customer.email,
        name: `${subOrder.order.customer.firstName} ${subOrder.order.customer.lastName}`,
      },
      order: {
        id: subOrder.order.id,
        orderNumber: subOrder.order.orderNumber,
        currency: subOrder.order.currency,
      },
      itemCount: subOrder.items.length,
      items: subOrder.items.map((item: any) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
      })),
      shippingAddress: subOrder.order.shippingAddress ? {
        fullName: subOrder.order.shippingAddress.fullName,
        streetLine1: subOrder.order.shippingAddress.streetLine1,
        city: subOrder.order.shippingAddress.city,
        state: subOrder.order.shippingAddress.state,
        postalCode: subOrder.order.shippingAddress.postalCode,
        country: subOrder.order.shippingAddress.country,
      } : null,
      shipment: subOrder.shipment ? {
        id: subOrder.shipment.id,
        trackingNumber: subOrder.shipment.trackingNumber,
        carrier: subOrder.shipment.carrier,
        status: subOrder.shipment.status,
        labelUrl: subOrder.shipment.labelUrl,
      } : null,
      payout: subOrder.payout ? {
        id: subOrder.payout.id,
        status: subOrder.payout.status,
        amount: subOrder.payout.amount.toString(),
      } : null,
      acceptedAt: subOrder.acceptedAt,
      shippedAt: subOrder.shippedAt,
      deliveredAt: subOrder.deliveredAt,
      createdAt: subOrder.createdAt,
      updatedAt: subOrder.updatedAt,
    }));

    return NextResponse.json(
      apiResponse(true, formattedSubOrders, undefined, {
        page,
        limit,
        total,
        totalPages,
      })
    );
  } catch (error) {
    console.error("GET /api/v1/orders error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
