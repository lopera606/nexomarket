import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    const shipments = await db.shipment.findMany({
      where: {
        subOrder: { storeId: store.id },
      },
      include: {
        subOrder: {
          select: {
            subOrderNumber: true,
            status: true,
            order: {
              select: {
                customer: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
        events: {
          orderBy: { occurredAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Compute summary stats
    const activeShipments = shipments.filter(s => ["LABEL_CREATED", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(s.status));
    const outForDelivery = shipments.filter(s => s.status === "OUT_FOR_DELIVERY");
    const delivered = shipments.filter(s => s.status === "DELIVERED");

    return NextResponse.json({
      shipments: shipments.map(s => ({
        id: s.subOrder.subOrderNumber,
        shipmentId: s.id,
        customer: `${s.subOrder.order.customer.firstName} ${s.subOrder.order.customer.lastName}`,
        carrier: s.carrier || "Sin asignar",
        trackingNumber: s.trackingNumber || "",
        trackingUrl: s.trackingUrl,
        status: s.status,
        estimatedDelivery: s.estimatedDelivery?.toISOString() || null,
        shippedAt: s.shippedAt?.toISOString() || null,
        deliveredAt: s.deliveredAt?.toISOString() || null,
        createdAt: s.createdAt.toISOString(),
        events: s.events.map(e => ({
          status: e.status,
          description: e.description,
          location: e.location,
          occurredAt: e.occurredAt.toISOString(),
        })),
      })),
      summary: {
        active: activeShipments.length,
        outForDelivery: outForDelivery.length,
        delivered: delivered.length,
      },
    });
  } catch (error) {
    console.error("GET /api/vendedor/seguimiento error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
