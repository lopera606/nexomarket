import { NextRequest, NextResponse } from "next/server";
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

interface ShippingRatesRequest {
  addressFrom: Address;
  addressTo: Address;
  parcels: Parcel[];
}

interface ShippingRate {
  rateId: string;
  carrier: string;
  serviceLevel: string;
  estimatedDays: number;
  cost: number;
  currency: string;
}

/**
 * POST /api/v1/shipping/rates
 * Get shipping rates from Shippo API
 * This is a stub implementation that returns mock rates
 * In production, integrate with Shippo API: https://goshippo.com/
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    let body: ShippingRatesRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.addressFrom || !body.addressTo || !body.parcels || body.parcels.length === 0) {
      return NextResponse.json(
        apiResponse(
          false,
          undefined,
          "addressFrom, addressTo, and parcels array are required"
        ),
        { status: 400 }
      );
    }

    // STUB IMPLEMENTATION: In production, call Shippo API
    // For now, return mock rates based on destination country and weight

    const mockRates: ShippingRate[] = [
      {
        rateId: `rate_${Date.now()}_1`,
        carrier: "DHL",
        serviceLevel: "EXPRESS",
        estimatedDays: 2,
        cost: 450.00,
        currency: "MXN",
      },
      {
        rateId: `rate_${Date.now()}_2`,
        carrier: "FedEx",
        serviceLevel: "STANDARD",
        estimatedDays: 4,
        cost: 280.00,
        currency: "MXN",
      },
      {
        rateId: `rate_${Date.now()}_3`,
        carrier: "UPS",
        serviceLevel: "ECONOMY",
        estimatedDays: 6,
        cost: 180.00,
        currency: "MXN",
      },
    ];

    // In production, you would:
    // 1. Transform addressFrom, addressTo, and parcels to Shippo format
    // 2. Call shippo.shipments.create()
    // 3. Call shippo.rates.list() with shipment ID
    // 4. Return actual rates
    //
    // Example:
    // const shippoRates = await getShippoRates(
    //   body.addressFrom,
    //   body.addressTo,
    //   body.parcels
    // );

    return NextResponse.json(
      apiResponse(true, {
        addressFrom: body.addressFrom,
        addressTo: body.addressTo,
        rates: mockRates,
        message: "Mock shipping rates - integrate with Shippo for real rates",
      })
    );
  } catch (error) {
    console.error("POST /api/v1/shipping/rates error:", error);
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

async function getShippoRates(
  addressFrom: Address,
  addressTo: Address,
  parcels: Parcel[]
) {
  try {
    // Create shipment
    const shipment = await shippo.shipments.create({
      object_purpose: "PURCHASE",
      address_from: {
        name: addressFrom.name,
        street1: addressFrom.street1,
        street2: addressFrom.street2,
        city: addressFrom.city,
        state: addressFrom.state,
        zip: addressFrom.zip,
        country: addressFrom.country,
        phone: addressFrom.phone,
        email: addressFrom.email,
      },
      address_to: {
        name: addressTo.name,
        street1: addressTo.street1,
        street2: addressTo.street2,
        city: addressTo.city,
        state: addressTo.state,
        zip: addressTo.zip,
        country: addressTo.country,
        phone: addressTo.phone,
        email: addressTo.email,
      },
      parcels: parcels.map((p: any) => ({
        length: p.length.toString(),
        width: p.width.toString(),
        height: p.height.toString(),
        distance_unit: "CM",
        weight: p.weight.toString(),
        mass_unit: "KG",
      })),
    });

    // Get rates for this shipment
    const rates = await shippo.rates.list({
      shipment: shipment.object_id,
    });

    return rates.results.map((rate: any) => ({
      rateId: rate.object_id,
      carrier: rate.provider,
      serviceLevel: rate.servicelevel.name,
      estimatedDays: rate.estimated_days,
      cost: parseFloat(rate.amount),
      currency: rate.currency,
    }));
  } catch (error) {
    console.error("Shippo API error:", error);
    throw error;
  }
}
*/
