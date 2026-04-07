import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("GET /api/mi-cuenta/direcciones error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { label, fullName, streetLine1, streetLine2, city, state, postalCode, country, phone, isDefault } = body;

    if (!fullName || !streetLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (fullName, streetLine1, city, state, postalCode)" },
        { status: 400 }
      );
    }

    // If setting as default, unset others
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await db.address.create({
      data: {
        userId: session.user.id,
        label: label || "Casa",
        fullName: fullName.trim(),
        streetLine1: streetLine1.trim(),
        streetLine2: streetLine2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country || "MX",
        phone: phone?.trim() || null,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("POST /api/mi-cuenta/direcciones error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isDefault, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID de la direccion" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Direccion no encontrada" }, { status: 404 });
    }

    // If setting as default, unset others
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await db.address.update({
      where: { id },
      data: {
        ...updateData,
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("PUT /api/mi-cuenta/direcciones error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Se requiere el ID de la direccion" }, { status: 400 });
    }

    const existing = await db.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Direccion no encontrada" }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/mi-cuenta/direcciones error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
