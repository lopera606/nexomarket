import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

interface Address {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

interface Parcel {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
  weight: number; // kg
}

interface CreateLabelRequest {
  subOrderId: string;
  rateId: string;
  addressFrom: Address;
  addressTo: Address;
  parcels: Parcel[];
}

/**
 * POST /api/v1/shipping/labels
 * Generate a shipping label for a sub-order
 * This is a stub implementation that returns a mock label URL
 * In production, integrate with Shippo API to generate real labels
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;

    let body: CreateLabelRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.subOrderId || !body.rateId || !body.addressFrom || !body.addressTo || !body.parcels) {
      return NextResponse.json(
        apiResponse(
          false,
          undefined,
          "subOrderId, rateId, addressFrom, addressTo, and parcels are required"
        ),
        { status: 400 }
      );
    }

    // Verify the sub-order belongs to the authenticated store
    const subOrder = await db.subOrder.findUnique({
      where: { id: body.subOrderId },
      select: { storeId: true, status: true },
    });

    if (!subOrder) {
      return NextResponse.json(
        apiResponse(false, undefined, "Sub-order not found"),
        { status: 404 }
      );
    }

    if (subOrder.storeId !== storeId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Unauthorized"),
        { status: 403 }
      );
    }

    // STUB IMPLEMENTATION: In production, call Shippo API
    // For now, return a mock label URL

    const timestamp = Date.now();
    const mockLabelUrl = `https://labels.shippo.com/mock-labels/${body.subOrderId}-${timestamp}.pdf`;
    const mockTrackingNumber = `${Date.now().toString().slice(-10).toUpperCase()}`;

    // In production, you would:
    // 1. Create a transaction with the selected rate
    // 2. Get label_download URL from the transaction
    // 3. Create shipment record with tracking info
    //
    // Example:
    // const transaction = await shippo.transactions.create({
    //   rate: body.rateId,
    //   label_file_type: "PDF",
    // });
    //
    // const labelUrl = transaction.label_download.href;
    // const trackingNumber = transaction.tracking_number;

    // Check if shipment already exists for this sub-order
    let shipment = await db.shipment.findUnique({
      where: { subOrderId: body.subOrderId },
    });

    if (shipment) {
      // Update existing shipment
      shipment = await db.shipment.update({
        where: { subOrderId: body.subOrderId },
        data: {
          labelUrl: mockLabelUrl,
          trackingNumber: mockTrackingNumber,
          status: "LABEL_CREATED",
        },
      });
    } else {
      // Create new shipment
      shipment = await db.shipment.create({
        data: {
          subOrderId: body.subOrderId,
          labelUrl: mockLabelUrl,
          trackingNumber: mockTrackingNumber,
          status: "LABEL_CREATED",
        },
      });
    }

    return NextResponse.json(
      apiResponse(true, {
        id: shipment.id,
        subOrderId: shipment.subOrderId,
        labelUrl: shipment.labelUrl,
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        message: "Shipping label generated successfully (stub implementation)",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/v1/shipping/labels error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * STUB: Integration helper for Shippo API
 * Uncomment and implement when Shippo API keys are available
 */
/*
import { shippo } from "@/lib/shippo";

async function createShippoLabel(
  rateId: string,
  addressFrom: Address,
  addressTo: Address,
  parcels: Parcel[]
) {
  try {
    // Create transaction to generate label
    const transaction = await shippo.transactions.create({
      rate: rateId,
      label_file_type: "PDF",
    });

    return {
      labelUrl: transaction.label_download.href,
      trackingNumber: transaction.tracking_number,
      carrier: transaction.rate.provider,
      serviceLevel: transaction.rate.servicelevel.name,
    };
  } catch (error) {
    console.error("Shippo transaction error:", error);
    throw error;
  }
}
*/
