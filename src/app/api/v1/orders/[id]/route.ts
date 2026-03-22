import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

/**
 * GET /api/v1/orders/[id]
 * Get a single sub-order with full details
 */
export async function GET(
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

    const subOrder = await db.subOrder.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
            shippingAddress: true,
            billingAddress: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
        shipment: {
          include: {
            events: {
              orderBy: { occurredAt: "desc" },
            },
          },
        },
        payout: true,
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

    return NextResponse.json(
      apiResponse(true, {
        id: subOrder.id,
        subOrderNumber: subOrder.subOrderNumber,
        status: subOrder.status,
        subtotal: subOrder.subtotal.toString(),
        shippingCost: subOrder.shippingCost.toString(),
        platformCommission: subOrder.platformCommission.toString(),
        sellerPayout: subOrder.sellerPayout.toString(),
        sellerNotes: subOrder.sellerNotes,
        customer: {
          id: subOrder.order.customer.id,
          email: subOrder.order.customer.email,
          firstName: subOrder.order.customer.firstName,
          lastName: subOrder.order.customer.lastName,
          phone: subOrder.order.customer.phone,
          fullName: `${subOrder.order.customer.firstName} ${subOrder.order.customer.lastName}`,
        },
        order: {
          id: subOrder.order.id,
          orderNumber: subOrder.order.orderNumber,
          status: subOrder.order.status,
          grandTotal: subOrder.order.grandTotal.toString(),
          currency: subOrder.order.currency,
          customerNotes: subOrder.order.customerNotes,
        },
        items: subOrder.items.map((item: any) => ({
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            basePrice: item.product.basePrice.toString(),
          },
          variant: item.variant ? {
            id: item.variant.id,
            name: item.variant.name,
            sku: item.variant.sku,
          } : null,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: item.totalPrice.toString(),
          imageUrl: item.imageUrl,
        })),
        shippingAddress: subOrder.order.shippingAddress ? {
          id: subOrder.order.shippingAddress.id,
          label: subOrder.order.shippingAddress.label,
          fullName: subOrder.order.shippingAddress.fullName,
          streetLine1: subOrder.order.shippingAddress.streetLine1,
          streetLine2: subOrder.order.shippingAddress.streetLine2,
          city: subOrder.order.shippingAddress.city,
          state: subOrder.order.shippingAddress.state,
          postalCode: subOrder.order.shippingAddress.postalCode,
          country: subOrder.order.shippingAddress.country,
          phone: subOrder.order.shippingAddress.phone,
        } : null,
        billingAddress: subOrder.order.billingAddress ? {
          id: subOrder.order.billingAddress.id,
          label: subOrder.order.billingAddress.label,
          fullName: subOrder.order.billingAddress.fullName,
          streetLine1: subOrder.order.billingAddress.streetLine1,
          streetLine2: subOrder.order.billingAddress.streetLine2,
          city: subOrder.order.billingAddress.city,
          state: subOrder.order.billingAddress.state,
          postalCode: subOrder.order.billingAddress.postalCode,
          country: subOrder.order.billingAddress.country,
          phone: subOrder.order.billingAddress.phone,
        } : null,
        shipment: subOrder.shipment ? {
          id: subOrder.shipment.id,
          trackingNumber: subOrder.shipment.trackingNumber,
          carrier: subOrder.shipment.carrier,
          serviceLevel: subOrder.shipment.serviceLevel,
          status: subOrder.shipment.status,
          labelUrl: subOrder.shipment.labelUrl,
          shippingCost: subOrder.shipment.shippingCost?.toString(),
          weightKg: subOrder.shipment.weightKg?.toString(),
          estimatedDelivery: subOrder.shipment.estimatedDelivery,
          deliveredAt: subOrder.shipment.deliveredAt,
          events: subOrder.shipment.events.map((event: any) => ({
            id: event.id,
            status: event.status,
            description: event.description,
            location: event.location,
            occurredAt: event.occurredAt,
          })),
        } : null,
        payout: subOrder.payout ? {
          id: subOrder.payout.id,
          status: subOrder.payout.status,
          amount: subOrder.payout.amount.toString(),
          commissionDeducted: subOrder.payout.commissionDeducted.toString(),
          paidAt: subOrder.payout.paidAt,
        } : null,
        acceptedAt: subOrder.acceptedAt,
        shippedAt: subOrder.shippedAt,
        deliveredAt: subOrder.deliveredAt,
        createdAt: subOrder.createdAt,
        updatedAt: subOrder.updatedAt,
      })
    );
  } catch (error) {
    console.error("GET /api/v1/orders/[id] error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
