import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * POST /api/v1/orders/[id]/accept
 * Accept a pending sub-order and change status to ACCEPTED
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;
    const { id } = await params;

    // Fetch the sub-order
    const subOrder = await db.subOrder.findUnique({
      where: { id },
      select: {
        storeId: true,
        status: true,
        id: true,
        subOrderNumber: true,
      },
    });

    if (!subOrder) {
      return NextResponse.json(
        apiResponse(false, undefined, "Sub-order not found"),
        { status: 404 }
      );
    }

    // Verify sub-order belongs to authenticated store
    if (subOrder.storeId !== storeId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Unauthorized"),
        { status: 403 }
      );
    }

    // Check if the sub-order is in PENDING status
    if (subOrder.status !== "PENDING") {
      return NextResponse.json(
        apiResponse(
          false,
          undefined,
          `Cannot accept sub-order with status ${subOrder.status}. Only PENDING orders can be accepted.`
        ),
        { status: 400 }
      );
    }

    // Update sub-order status to ACCEPTED
    const acceptedSubOrder = await db.subOrder.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
      include: {
        order: {
          select: {
            customer: {
              select: {
                email: true,
                firstName: true,
              },
            },
          },
        },
        items: {
          select: {
            productName: true,
            quantity: true,
          },
        },
      },
    });

    // Notify customer that their order was accepted
    const customer = acceptedSubOrder.order.customer;
    const order = await db.order.findFirst({
      where: { subOrders: { some: { id } } },
      select: { customerId: true },
    });
    if (order) {
      createNotification(
        order.customerId,
        "ORDER_UPDATE",
        "Pedido aceptado",
        `Tu sub-pedido ${acceptedSubOrder.subOrderNumber} ha sido aceptado por el vendedor y está siendo preparado.`,
        `/es/mi-cuenta/pedidos`
      ).catch(() => {});
    }

    return NextResponse.json(
      apiResponse(true, {
        id: acceptedSubOrder.id,
        subOrderNumber: acceptedSubOrder.subOrderNumber,
        status: acceptedSubOrder.status,
        acceptedAt: acceptedSubOrder.acceptedAt,
        message: "Sub-order accepted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/v1/orders/[id]/accept error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
