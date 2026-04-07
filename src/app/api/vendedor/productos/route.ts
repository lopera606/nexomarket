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

    const products = await db.product.findMany({
      where: {
        storeId: store.id,
        status: { not: "DELETED" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          select: {
            id: true,
            name: true,
            stockQuantity: true,
            lowStockThreshold: true,
            price: true,
          },
        },
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
      },
    });

    const result = products.map((product) => {
      // Calculate total stock from variants
      const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      const hasLowStock = product.variants.some(
        (v) => v.stockQuantity > 0 && v.stockQuantity <= v.lowStockThreshold
      );

      let status: string;
      if (product.status === "PAUSED") {
        status = "Pausado";
      } else if (product.status === "DRAFT") {
        status = "Borrador";
      } else if (totalStock === 0) {
        status = "Agotado";
      } else if (hasLowStock) {
        status = "Stock Bajo";
      } else {
        status = "Activo";
      }

      return {
        id: product.id,
        name: product.name,
        price: Number(product.basePrice),
        stock: totalStock,
        status,
        image: product.images[0]?.url || "https://placehold.co/80x80/f3f4f6/a3a3a3?text=...",
        sales: product.totalSold,
      };
    });

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
