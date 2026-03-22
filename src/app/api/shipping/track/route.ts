import { NextRequest, NextResponse } from 'next/server';
import { trackShipment } from '@/lib/shippo';

interface TrackingResponse {
  trackingNumber: string;
  carrier: string;
  status: string;
  statusDetail: string;
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  estimatedDeliveryDate: string | null;
  eta: string | null;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<TrackingResponse | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const carrier = searchParams.get('carrier');
    const trackingNumber = searchParams.get('tracking_number');

    // Validate required query parameters
    if (!carrier) {
      return NextResponse.json(
        { error: 'Missing required query parameter: carrier' },
        { status: 400 }
      );
    }

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required query parameter: tracking_number' },
        { status: 400 }
      );
    }

    // Validate parameters are not empty
    if (
      typeof carrier !== 'string' ||
      carrier.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'carrier must be a non-empty string' },
        { status: 400 }
      );
    }

    if (
      typeof trackingNumber !== 'string' ||
      trackingNumber.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'tracking_number must be a non-empty string' },
        { status: 400 }
      );
    }

    // Get tracking information from Shippo
    const tracking = await trackShipment(carrier, trackingNumber);

    return NextResponse.json({
      trackingNumber: tracking.tracking_number,
      carrier: tracking.carrier,
      status: tracking.status,
      statusDetail: tracking.status_detail,
      location: tracking.location,
      estimatedDeliveryDate: tracking.estimated_delivery_date,
      eta: tracking.eta,
    });
  } catch (error) {
    console.error('Error tracking shipment:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Handle specific Shippo API errors
    if (errorMessage.includes('Shippo API error')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to track shipment: ${errorMessage}` },
      { status: 500 }
    );
  }
}
