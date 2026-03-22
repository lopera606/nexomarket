import { NextRequest, NextResponse } from 'next/server';
import {
  getShippingRates,
  ShippoAddress,
  ShippoParcel,
  ShippingRate,
} from '@/lib/shippo';

interface RatesRequestBody {
  addressTo: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    email?: string;
  };
  parcel: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
}

interface RatesResponse {
  rates: Array<{
    provider: string;
    servicelevel: string;
    amount: string;
    currency: string;
    estimated_days: number | null;
    duration_terms: string;
    object_id: string;
  }>;
}

// Default warehouse address in Madrid, Spain
const WAREHOUSE_ADDRESS: ShippoAddress = {
  name: 'NexoMarket Warehouse',
  street1: 'Calle Gran Vía 28',
  city: 'Madrid',
  state: 'Madrid',
  zip: '28013',
  country: 'ES',
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<RatesResponse | { error: string }>> {
  try {
    const body: RatesRequestBody = await request.json();

    // Validate required fields
    if (!body.addressTo || !body.parcel) {
      return NextResponse.json(
        { error: 'Missing required fields: addressTo and parcel' },
        { status: 400 }
      );
    }

    const { addressTo, parcel } = body;

    // Validate address fields
    if (
      !addressTo.name ||
      !addressTo.street1 ||
      !addressTo.city ||
      !addressTo.state ||
      !addressTo.zip ||
      !addressTo.country
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required address fields: name, street1, city, state, zip, country',
        },
        { status: 400 }
      );
    }

    // Validate parcel fields
    if (
      !parcel.weight ||
      !parcel.length ||
      !parcel.width ||
      !parcel.height
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required parcel fields: weight, length, width, height',
        },
        { status: 400 }
      );
    }

    // Validate numeric values
    if (
      isNaN(parcel.weight) ||
      isNaN(parcel.length) ||
      isNaN(parcel.width) ||
      isNaN(parcel.height)
    ) {
      return NextResponse.json(
        { error: 'Parcel dimensions must be valid numbers' },
        { status: 400 }
      );
    }

    // Create ShippoParcel object (in cm and kg)
    const shippoParcel: ShippoParcel = {
      length: parcel.length.toString(),
      width: parcel.width.toString(),
      height: parcel.height.toString(),
      distance_unit: 'cm',
      weight: parcel.weight.toString(),
      mass_unit: 'kg',
    };

    // Create ShippoAddress object for destination
    const shippoAddressTo: ShippoAddress = {
      name: addressTo.name,
      street1: addressTo.street1,
      city: addressTo.city,
      state: addressTo.state,
      zip: addressTo.zip,
      country: addressTo.country,
      ...(addressTo.phone && { phone: addressTo.phone }),
      ...(addressTo.email && { email: addressTo.email }),
    };

    // Get shipping rates from Shippo
    const rates: ShippingRate[] = await getShippingRates(
      WAREHOUSE_ADDRESS,
      shippoAddressTo,
      shippoParcel
    );

    // Format response
    const formattedRates = rates.map((rate: any) => ({
      object_id: rate.object_id,
      provider: rate.provider,
      servicelevel: rate.servicelevel.name,
      amount: rate.amount,
      currency: rate.currency,
      estimated_days: rate.estimated_days,
      duration_terms: rate.duration_terms,
    }));

    return NextResponse.json({ rates: formattedRates });
  } catch (error) {
    console.error('Error fetching shipping rates:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to fetch shipping rates: ${errorMessage}` },
      { status: 500 }
    );
  }
}
