import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import crypto from "crypto";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler
 * Validates webhook signature and handles Stripe events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.info(`Processing Stripe webhook event: ${event.type}`);

    switch (event.type) {
      // Payment Intent succeeded
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      // Transfer created (seller payout initiated)
      case "transfer.created": {
        const transfer = event.data.object as any;
        await handleTransferCreated(transfer);
        break;
      }

      // Payout paid (seller payout completed)
      case "payout.paid": {
        const payout = event.data.object as any;
        await handlePayoutPaid(payout);
        break;
      }

      // Charge refunded
      case "charge.refunded": {
        const charge = event.data.object as any;
        await handleChargeRefunded(charge);
        break;
      }

      // Invoice paid (subscription payment)
      case "invoice.paid": {
        const invoice = event.data.object as any;
        await handleInvoicePaid(invoice);
        break;
      }

      // Subscription updated
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      // Subscription deleted
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.info(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle payment_intent.succeeded event
 * Update Payment record status to SUCCEEDED
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    const { id, amount, metadata, charges } = paymentIntent;

    if (!charges?.data?.[0]) {
      console.info("No charges found in payment intent");
      return;
    }

    const charge = charges.data[0];
    const metadata_orderId = metadata?.orderId;

    if (!metadata_orderId) {
      console.info("No orderId in payment intent metadata");
      return;
    }

    await db.payment.update({
      where: { stripePaymentIntentId: id },
      data: {
        status: "SUCCEEDED",
        stripeChargeId: charge.id,
        paymentMethodType: charge.payment_method_details?.type,
        lastFour: charge.payment_method_details?.card?.last4,
        cardBrand: charge.payment_method_details?.card?.brand,
        paidAt: new Date(charge.created * 1000),
      },
    });

    console.info(`Payment ${id} marked as succeeded`);
  } catch (error) {
    console.error("Error handling payment_intent.succeeded:", error);
  }
}

/**
 * Handle transfer.created event
 * Create SellerPayout record with PROCESSING status
 */
async function handleTransferCreated(transfer: any) {
  try {
    const { id, amount, metadata } = transfer;
    const storeId = metadata?.storeId;
    const subOrderId = metadata?.subOrderId;

    if (!storeId || !subOrderId) {
      console.info("Missing storeId or subOrderId in transfer metadata");
      return;
    }

    // Check if payout already exists
    const existingPayout = await db.sellerPayout.findUnique({
      where: { stripeTransferId: id },
    });

    if (existingPayout) {
      console.info(`Payout for transfer ${id} already exists`);
      return;
    }

    // Create or update payout record
    await db.sellerPayout.upsert({
      where: { subOrderId },
      create: {
        storeId,
        subOrderId,
        stripeTransferId: id,
        amount: Number(amount / 100), // Stripe amounts are in cents
        commissionDeducted: Number(0),
        status: "PROCESSING",
      },
      update: {
        stripeTransferId: id,
        status: "PROCESSING",
      },
    });

    console.info(`Payout ${id} created with PROCESSING status`);
  } catch (error) {
    console.error("Error handling transfer.created:", error);
  }
}

/**
 * Handle payout.paid event
 * Update SellerPayout status to PAID
 */
async function handlePayoutPaid(payout: any) {
  try {
    const { id, amount } = payout;

    const sellerPayout = await db.sellerPayout.findUnique({
      where: { stripeTransferId: id },
    });

    if (!sellerPayout) {
      console.info(`No SellerPayout found for transfer ${id}`);
      return;
    }

    await db.sellerPayout.update({
      where: { id: sellerPayout.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    console.info(`Payout ${id} marked as PAID`);
  } catch (error) {
    console.error("Error handling payout.paid:", error);
  }
}

/**
 * Handle charge.refunded event
 * Update Payment status to REFUNDED
 */
async function handleChargeRefunded(charge: any) {
  try {
    const { id, refunded, amount_refunded } = charge;

    if (!refunded) {
      console.info("Charge is not marked as refunded");
      return;
    }

    // Find payment by stripe charge ID
    const payment = await db.payment.findFirst({
      where: { stripeChargeId: id },
    });

    if (!payment) {
      console.info(`No payment found for charge ${id}`);
      return;
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "REFUNDED",
      },
    });

    console.info(`Payment for charge ${id} marked as REFUNDED`);
  } catch (error) {
    console.error("Error handling charge.refunded:", error);
  }
}

/**
 * Handle invoice.paid event
 * Subscription payment received
 */
async function handleInvoicePaid(invoice: any) {
  try {
    const { subscription: subscriptionId, amount_paid, status } = invoice;

    if (status !== "paid") {
      console.info("Invoice status is not 'paid'");
      return;
    }

    // Find store subscription by Stripe subscription ID
    const storeSubscription = await db.storeSubscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (!storeSubscription) {
      console.info(`No store subscription found for ${subscriptionId}`);
      return;
    }

    // Log payment record or update subscription status if needed
    console.info(`Invoice paid for subscription ${subscriptionId}, amount: ${amount_paid / 100}`);
  } catch (error) {
    console.error("Error handling invoice.paid:", error);
  }
}

/**
 * Handle customer.subscription.updated event
 * Update subscription status and period
 */
async function handleSubscriptionUpdated(subscription: any) {
  try {
    const { id, status, current_period_start, current_period_end, cancel_at_period_end } = subscription;

    // Find store subscription by Stripe subscription ID
    const storeSubscription = await db.storeSubscription.findFirst({
      where: { stripeSubscriptionId: id },
    });

    if (!storeSubscription) {
      console.info(`No store subscription found for ${id}`);
      return;
    }

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      trialing: "TRIALING",
      canceled: "CANCELLED",
    };

    await db.storeSubscription.update({
      where: { id: storeSubscription.id },
      data: {
        status: (statusMap[status] || "ACTIVE") as any,
        currentPeriodStart: new Date(current_period_start * 1000),
        currentPeriodEnd: new Date(current_period_end * 1000),
        cancelAtPeriodEnd: cancel_at_period_end || false,
      },
    });

    console.info(`Subscription ${id} updated to status: ${status}`);
  } catch (error) {
    console.error("Error handling customer.subscription.updated:", error);
  }
}

/**
 * Handle customer.subscription.deleted event
 * Update subscription status to CANCELLED
 */
async function handleSubscriptionDeleted(subscription: any) {
  try {
    const { id } = subscription;

    // Find store subscription by Stripe subscription ID
    const storeSubscription = await db.storeSubscription.findFirst({
      where: { stripeSubscriptionId: id },
    });

    if (!storeSubscription) {
      console.info(`No store subscription found for ${id}`);
      return;
    }

    await db.storeSubscription.update({
      where: { id: storeSubscription.id },
      data: {
        status: "CANCELLED",
      },
    });

    console.info(`Subscription ${id} marked as CANCELLED`);
  } catch (error) {
    console.error("Error handling customer.subscription.deleted:", error);
  }
}
