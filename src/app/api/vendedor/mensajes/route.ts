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

    const conversations = await db.conversation.findMany({
      where: { storeId: store.id },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            sender: {
              select: { firstName: true, lastName: true, role: true },
            },
          },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: 30,
    });

    return NextResponse.json({
      conversations: conversations.map(c => ({
        id: c.id,
        customer: `${c.customer.firstName} ${c.customer.lastName}`,
        customerId: c.customerId,
        subject: c.subject,
        isClosed: c.isClosed,
        lastMessageAt: c.lastMessageAt.toISOString(),
        unreadCount: c.messages.filter(m => !m.isRead && m.senderId !== session.user!.id).length,
        messages: c.messages.reverse().map(m => ({
          id: m.id,
          sender: m.senderRole === "SELLER" ? "seller" : "customer",
          senderName: `${m.sender.firstName} ${m.sender.lastName}`,
          text: m.body,
          time: m.createdAt.toISOString(),
          isRead: m.isRead,
        })),
      })),
    });
  } catch (error) {
    console.error("GET /api/vendedor/mensajes error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
