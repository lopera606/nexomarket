import { NextRequest, NextResponse } from 'next/server';
import { createShippingLabel } from '@/lib/shippo';

interface LabelRequestBody {
  rateId: string;
}

interface LabelResponse {
  labelUrl: string;
  trackingNumber: string;
  trackingUrlProvider: string;
  objectId: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LabelResponse | { error: string }>> {
  try {
    const body: LabelRequestBody = await request.json();

    // Validate required fields
    if (!body.rateId) {
      return NextResponse.json(
        { error: 'Missing required field: rateId' },
        { status: 400 }
      );
    }

    const { rateId } = body;

    // Validate rateId is not empty
    if (typeof rateId !== 'string' || rateId.trim().length === 0) {
      return NextResponse.json(
        { error: 'rateId must be a non-empty string' },
        { status: 400 }
      );
    }

    // Create shipping label via Shippo
    const label = await createShippingLabel(rateId);

    return NextResponse.json({
      objectId: label.object_id,
      labelUrl: label.label_url,
      trackingNumber: label.tracking_number,
      trackingUrlProvider: label.tracking_url_provider,
      ...(label.test_mode && { testMode: true }),
    });
  } catch (error) {
    console.error('Error creating shipping label:', error);

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
      { error: `Failed to create shipping label: ${errorMessage}` },
      { status: 500 }
    );
  }
}
