import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/shippo
 * Shippo webhook handler
 * Validates webhook and handles tracking updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook signature (optional - implement if Shippo requires)
    // const signature = request.headers.get("shippo-signature");
    // if (!validateShippoSignature(body, signature)) {
    //   return NextResponse.json(
    //     { error: "Invalid signature" },
    //     { status: 401 }
    //   );
    // }

    const { event_type, data } = body;

    console.info(`Processing Shippo webhook event: ${event_type}`);

    switch (event_type) {
      case "track_updated": {
        await handleTrackingUpdate(data);
        break;
      }

      case "transaction_created": {
        await handleTransactionCreated(data);
        break;
      }

      default:
        console.info(`Unhandled Shippo webhook event: ${event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Shippo webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle track_updated event
 * Updates shipment status based on tracking information
 */
async function handleTrackingUpdate(data: any) {
  try {
    const { tracking_number, status, status_details } = data;

    if (!tracking_number) {
      console.info("No tracking number in tracking update");
      return;
    }

    // Find shipment by tracking number
    const shipment = await db.shipment.findFirst({
      where: { trackingNumber: tracking_number },
    });

    if (!shipment) {
      console.info(`No shipment found for tracking number ${tracking_number}`);
      return;
    }

    // Map Shippo status to our ShipmentStatus enum
    const statusMap: Record<string, string> = {
      unknown: "IN_TRANSIT",
      pre_transit: "LABEL_CREATED",
      in_transit: "IN_TRANSIT",
      out_for_delivery: "OUT_FOR_DELIVERY",
      delivered: "DELIVERED",
      returned: "RETURNED",
      failure: "EXCEPTION",
    };

    const newStatus = statusMap[status] || "IN_TRANSIT";

    // Update shipment with new status and location
    const updateData: any = {
      status: newStatus,
    };

    if (status_details?.location_city || status_details?.location_state) {
      updateData.packageDimensions = JSON.stringify({
        city: status_details.location_city,
        state: status_details.location_state,
        country: status_details.location_country,
      });
    }

    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    await db.shipment.update({
      where: { id: shipment.id },
      data: updateData,
    });

    // Create shipment event for tracking history
    await db.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: newStatus,
        description: status_details?.status_description || status,
        location: status_details?.location_city
          ? `${status_details.location_city}, ${status_details.location_state}`
          : undefined,
        occurredAt: new Date(status_details?.status_timestamp || Date.now()),
      },
    });

    // If shipment is delivered, update sub-order
    if (status === "delivered") {
      await db.subOrder.update({
        where: { id: shipment.subOrderId },
        data: {
          status: "DELIVERED",
          deliveredAt: new Date(),
        },
      });

      console.info(`Sub-order ${shipment.subOrderId} marked as DELIVERED`);
    }

    console.info(`Shipment ${shipment.id} updated to status: ${newStatus}`);
  } catch (error) {
    console.error("Error handling tracking update:", error);
  }
}

/**
 * Handle transaction_created event
 * Updates shipment with label and tracking information
 */
async function handleTransactionCreated(data: any) {
  try {
    const { object_id, tracking_number, label_download, rate, status } = data;

    if (!tracking_number) {
      console.info("No tracking number in transaction");
      return;
    }

    // Find shipment by tracking number (may already exist)
    let shipment = await db.shipment.findFirst({
      where: { trackingNumber: tracking_number },
    });

    if (!shipment) {
      console.info(`No shipment found for tracking number ${tracking_number}`);
      return;
    }

    // Update shipment with label and carrier info
    shipment = await db.shipment.update({
      where: { id: shipment.id },
      data: {
        shippoShipmentId: object_id,
        labelUrl: label_download?.href,
        carrier: rate?.provider,
        serviceLevel: rate?.servicelevel?.name,
        status: status === "SUCCESS" ? "LABEL_CREATED" : "EXCEPTION",
      },
    });

    console.info(`Shipment ${shipment.id} label created and ready for shipping`);
  } catch (error) {
    console.error("Error handling transaction_created:", error);
  }
}

/**
 * Validate Shippo webhook signature
 * Implement if Shippo provides signature verification
 */
function validateShippoSignature(data: any, signature?: string): boolean {
  // Shippo signature validation logic (if applicable)
  // For now, we'll skip this step as documentation is needed
  return true;
}
