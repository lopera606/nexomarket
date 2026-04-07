import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
    });
    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    const subOrders = await db.subOrder.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            orderNumber: true,
            customer: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        items: {
          select: { productName: true, quantity: true, totalPrice: true },
        },
      },
    });

    const mapStatus = (status: string) => {
      switch (status) {
        case "PENDING":
        case "ACCEPTED":
        case "PROCESSING":
          return "En Preparación";
        case "SHIPPED":
          return "Enviado";
        case "DELIVERED":
          return "Entregado";
        case "CANCELLED":
          return "Cancelado";
        default:
          return status;
      }
    };

    const orders = subOrders.map((so) => ({
      id: so.subOrderNumber,
      customer: `${so.order.customer.firstName} ${so.order.customer.lastName}`.trim(),
      products: so.items
        .map((i) => `${i.productName}${i.quantity > 1 ? ` x ${i.quantity}` : ""}`)
        .join(", "),
      total: Number(so.subtotal),
      status: mapStatus(so.status),
      date: so.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
