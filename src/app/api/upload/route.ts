import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { url, productId, altText, isPrimary } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Se requiere una URL de imagen valida" },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "URL invalida" },
        { status: 400 }
      );
    }

    // Validate image extension or common image hosts
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
    const imageHosts = ["unsplash.com", "images.unsplash.com", "picsum.photos", "imgur.com", "i.imgur.com", "cloudinary.com"];
    const urlLower = url.toLowerCase();
    const urlObj = new URL(url);

    const hasImageExtension = imageExtensions.some((ext) => urlLower.includes(ext));
    const isImageHost = imageHosts.some((host) => urlObj.hostname.includes(host));

    if (!hasImageExtension && !isImageHost) {
      return NextResponse.json(
        { error: "La URL no parece ser una imagen valida. Formatos aceptados: jpg, png, webp, gif, svg" },
        { status: 400 }
      );
    }

    // If productId is provided, verify seller owns the product and save to DB
    if (productId) {
      const product = await db.product.findFirst({
        where: {
          id: productId,
          store: { ownerId: session.user.id },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado o no tienes permiso" },
          { status: 404 }
        );
      }

      // If isPrimary, unset other primary images
      if (isPrimary) {
        await db.productImage.updateMany({
          where: { productId },
          data: { isPrimary: false },
        });
      }

      const image = await db.productImage.create({
        data: {
          productId,
          url,
          altText: altText || null,
          isPrimary: isPrimary ?? false,
          sortOrder: 0,
        },
      });

      return NextResponse.json({ success: true, image }, { status: 201 });
    }

    // If no productId, just validate and return the URL
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
