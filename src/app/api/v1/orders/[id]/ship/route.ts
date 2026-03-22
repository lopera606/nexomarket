import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

interface ShipOrderBody {
  trackingNumber: string;
  carrier: string;
  serviceLevel?: string;
}

/**
 * POST /api/v1/orders/[id]/ship
 * Mark a sub-order as shipped with tracking information
 * Creates or updates a shipment record
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

    let body: ShipOrderBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.trackingNumber || body.trackingNumber.trim() === "") {
      return NextResponse.json(
        apiResponse(false, undefined, "trackingNumber is required"),
        { status: 400 }
      );
    }

    if (!body.carrier || body.carrier.trim() === "") {
      return NextResponse.json(
        apiResponse(false, undefined, "carrier is required"),
        { status: 400 }
      );
    }

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

    // Check if the sub-order is in a shippable status
    const shippableStatuses = ["ACCEPTED", "PROCESSING", "SHIPPED"];
    if (!shippableStatuses.includes(subOrder.status)) {
      return NextResponse.json(
        apiResponse(
          false,
          undefined,
          `Cannot ship sub-order with status ${subOrder.status}`
        ),
        { status: 400 }
      );
    }

    // Check if a shipment already exists
    const existingShipment = await db.shipment.findUnique({
      where: { subOrderId: id },
    });

    if (existingShipment) {
      // Update existing shipment
      const updatedShipment = await db.shipment.update({
        where: { subOrderId: id },
        data: {
          trackingNumber: body.trackingNumber,
          carrier: body.carrier,
          serviceLevel: body.serviceLevel || null,
          status: "IN_TRANSIT",
          shippedAt: new Date(),

        },
      });

      // Update sub-order status if not already shipped
      if (subOrder.status !== "SHIPPED") {
        await db.subOrder.update({
          where: { id },
          data: {
            status: "SHIPPED",
            shippedAt: new Date(),
  
          },
        });
      }

      return NextResponse.json(
        apiResponse(true, {
          id: updatedShipment.id,
          subOrderId: updatedShipment.subOrderId,
          trackingNumber: updatedShipment.trackingNumber,
          carrier: updatedShipment.carrier,
          serviceLevel: updatedShipment.serviceLevel,
          status: updatedShipment.status,
          shippedAt: updatedShipment.shippedAt,
          message: "Shipment updated and sub-order marked as shipped",
        })
      );
    } else {
      // Create new shipment record
      const shipment = await db.shipment.create({
        data: {
          subOrderId: id,
          trackingNumber: body.trackingNumber,
          carrier: body.carrier,
          serviceLevel: body.serviceLevel || null,
          status: "IN_TRANSIT",
          shippedAt: new Date(),
        },
      });

      // Update sub-order status
      await db.subOrder.update({
        where: { id },
        data: {
          status: "SHIPPED",
          shippedAt: new Date(),

        },
      });

      return NextResponse.json(
        apiResponse(true, {
          id: shipment.id,
          subOrderId: shipment.subOrderId,
          trackingNumber: shipment.trackingNumber,
          carrier: shipment.carrier,
          serviceLevel: shipment.serviceLevel,
          status: shipment.status,
          shippedAt: shipment.shippedAt,
          message: "Sub-order marked as shipped successfully",
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("POST /api/v1/orders/[id]/ship error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
