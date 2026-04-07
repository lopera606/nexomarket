import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where: { customerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            variantName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            imageUrl: true,
          },
        },
        subOrders: {
          select: {
            id: true,
            status: true,
            shippedAt: true,
            deliveredAt: true,
            acceptedAt: true,
            shipment: {
              select: {
                trackingNumber: true,
                trackingUrl: true,
                status: true,
                estimatedDelivery: true,
              },
            },
          },
        },
      },
    });

    // Map status for display
    const mapOrderStatus = (status: string) => {
      switch (status) {
        case "PENDING":
        case "CONFIRMED":
          return "En Proceso";
        case "PARTIALLY_SHIPPED":
        case "SHIPPED":
          return "En Tránsito";
        case "DELIVERED":
          return "Entregado";
        case "CANCELLED":
          return "Cancelado";
        case "REFUNDED":
          return "Reembolsado";
        default:
          return status;
      }
    };

    // Build timeline from order + subOrder statuses
    const buildTimeline = (order: (typeof orders)[0]) => {
      const timeline = [
        {
          step: "Confirmado",
          date: order.placedAt
            ? order.placedAt.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
            : order.createdAt.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
          completed: true,
        },
      ];

      const hasAccepted = order.subOrders.some((so) => so.acceptedAt);
      const hasShipped = order.subOrders.some((so) => so.shippedAt);
      const allDelivered =
        order.subOrders.length > 0 && order.subOrders.every((so) => so.deliveredAt);

      timeline.push({
        step: "Preparando",
        date: hasAccepted
          ? order.subOrders.find((so) => so.acceptedAt)!.acceptedAt!.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })
          : hasAccepted
          ? ""
          : "En curso",
        completed: hasAccepted || hasShipped || allDelivered,
      });

      timeline.push({
        step: "Enviado",
        date: hasShipped
          ? order.subOrders.find((so) => so.shippedAt)!.shippedAt!.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })
          : "—",
        completed: hasShipped || allDelivered,
      });

      const estimatedDelivery = order.subOrders
        .map((so) => so.shipment?.estimatedDelivery)
        .find((d) => d);

      timeline.push({
        step: "Entregado",
        date: allDelivered
          ? order.subOrders.find((so) => so.deliveredAt)!.deliveredAt!.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })
          : estimatedDelivery
          ? `Est. ${estimatedDelivery.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`
          : "—",
        completed: allDelivered,
      });

      return timeline;
    };

    const result = orders.map((order) => ({
      id: order.orderNumber,
      date: order.createdAt.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      total: Number(order.grandTotal),
      status: mapOrderStatus(order.status),
      items: order.items.map((item) => ({
        name: item.productName + (item.variantName ? ` (${item.variantName})` : ""),
        qty: item.quantity,
        price: Number(item.totalPrice),
        img: item.imageUrl || "https://placehold.co/80x80/f3f4f6/a3a3a3?text=...",
      })),
      timeline: buildTimeline(order),
    }));

    // Compute stats
    const totalOrders = orders.length;
    const inTransit = orders.filter((o) => ["SHIPPED", "PARTIALLY_SHIPPED"].includes(o.status)).length;
    // Count reviews pending (items from delivered orders without reviews)
    const deliveredOrderIds = orders.filter((o) => o.status === "DELIVERED").map((o) => o.id);
    let pendingReviews = 0;
    if (deliveredOrderIds.length > 0) {
      const reviewedItems = await db.review.count({
        where: { customerId: session.user.id },
      });
      const deliveredItems = await db.orderItem.count({
        where: { order: { customerId: session.user.id, status: "DELIVERED" } },
      });
      pendingReviews = Math.max(0, deliveredItems - reviewedItems);
    }
    const favorites = await db.wishlist.count({ where: { userId: session.user.id } });

    return NextResponse.json({
      stats: {
        totalOrders,
        inTransit,
        pendingReviews,
        favorites,
      },
      orders: result,
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
