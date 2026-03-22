import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * GET /api/v1/invoices
 * List invoices from Stripe with optional filters
 * Query params: limit, starting_after, status, customer
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25")));
    const startingAfter = searchParams.get("starting_after") || undefined;
    const status = searchParams.get("status") || undefined;
    const customer = searchParams.get("customer") || undefined;

    const params: any = { limit };
    if (startingAfter) params.starting_after = startingAfter;
    if (status) params.status = status;
    if (customer) params.customer = customer;

    const invoices = await stripe.invoices.list(params);

    const formattedInvoices = invoices.data.map((inv: any): any => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      currency: inv.currency?.toUpperCase(),
      amount_due: inv.amount_due / 100,
      amount_paid: inv.amount_paid / 100,
      tax: inv.tax ? inv.tax / 100 : 0,
      total: inv.total / 100,
      customer_email: inv.customer_email,
      customer_name: inv.customer_name,
      invoice_pdf: inv.invoice_pdf,
      hosted_invoice_url: inv.hosted_invoice_url,
      created: new Date(inv.created * 1000).toISOString(),
      due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
      paid_at: inv.status_transitions?.paid_at
        ? new Date(inv.status_transitions.paid_at * 1000).toISOString()
        : null,
      metadata: inv.metadata,
      lines: inv.lines?.data?.map((line: any): any => ({
        description: line.description,
        quantity: line.quantity,
        amount: line.amount / 100,
        currency: line.currency?.toUpperCase(),
      })),
    }));

    return NextResponse.json({
      success: true,
      data: formattedInvoices,
      has_more: invoices.has_more,
      total_count: formattedInvoices.length,
    });
  } catch (error) {
    console.error("GET /api/v1/invoices error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/invoices/send
 * Resend an invoice email to the customer
 */
export async function POST(request: NextRequest) {
  try {
    const { invoiceId, action } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: "invoiceId is required" },
        { status: 400 }
      );
    }

    if (action === "send") {
      await stripe.invoices.sendInvoice(invoiceId);
      return NextResponse.json({
        success: true,
        message: "Invoice sent successfully",
      });
    }

    if (action === "void") {
      await stripe.invoices.voidInvoice(invoiceId);
      return NextResponse.json({
        success: true,
        message: "Invoice voided successfully",
      });
    }

    // Default: retrieve invoice details
    const invoice: any = await stripe.invoices.retrieve(invoiceId);
    return NextResponse.json({
      success: true,
      data: {
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        invoice_pdf: invoice.invoice_pdf,
        hosted_invoice_url: invoice.hosted_invoice_url,
        amount_paid: invoice.amount_paid / 100,
        total: invoice.total / 100,
        tax: invoice.tax ? invoice.tax / 100 : 0,
        customer_email: invoice.customer_email,
      },
    });
  } catch (error) {
    console.error("POST /api/v1/invoices error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process invoice action" },
      { status: 500 }
    );
  }
}
