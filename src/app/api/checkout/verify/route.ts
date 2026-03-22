import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

interface VerifyResponse {
  success: boolean;
  sessionId?: string;
  paymentStatus?: string;
  paymentIntent?: string;
  customerEmail?: string | null;
  amountTotal?: number;
  currency?: string;
  error?: string;
}

/**
 * GET /api/checkout/verify
 * Verify payment status for a Stripe Checkout Session
 */
export async function GET(request: NextRequest): Promise<NextResponse<VerifyResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    // Validate session_id parameter
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'session_id query parameter is required',
        },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session not found',
        },
        { status: 404 }
      );
    }

    // Extract payment intent (could be an object if expanded or a string ID)
    const paymentIntent = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

    const paymentStatus = typeof session.payment_intent === 'string'
      ? null
      : session.payment_intent?.status;

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      paymentStatus: session.payment_status,
      paymentIntent: paymentIntent,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total ? session.amount_total / 100 : undefined, // Convert from cents to euros
      currency: session.currency?.toUpperCase(),
    });
  } catch (error) {
    console.error('GET /api/checkout/verify error:', error);

    // Handle Stripe-specific errors
    if (error instanceof Error) {
      if ('type' in error && error.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid session ID format',
          },
          { status: 400 }
        );
      }

      if ('statusCode' in error && error.statusCode === 404) {
        return NextResponse.json(
          {
            success: false,
            error: 'Session not found',
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment status',
      },
      { status: 500 }
    );
  }
}
