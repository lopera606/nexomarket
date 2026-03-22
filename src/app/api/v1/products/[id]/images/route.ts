import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";
import crypto from "crypto";

export const runtime = "nodejs";

interface UploadImageBody {
  data: string; // base64 image data
  altText?: string;
  isPrimary?: boolean;
  variantId?: string;
}

interface DeleteImageBody {
  imageId: string;
}

/**
 * GET /api/v1/products/[id]/images
 * List all images for a product
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
    const { id: productId } = await params;

    // Verify product belongs to store
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) {
      return NextResponse.json(
        apiResponse(false, undefined, "Product not found"),
        { status: 404 }
      );
    }

    if (product.storeId !== storeId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Unauthorized"),
        { status: 403 }
      );
    }

    const images = await db.productImage.findMany({
      where: { productId },
      orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(
      apiResponse(
        true,
        images.map((img: any) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          variantId: img.variantId,
          sortOrder: img.sortOrder,
        }))
      )
    );
  } catch (error) {
    console.error("GET /api/v1/products/[id]/images error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/products/[id]/images
 * Upload an image for a product
 * Body: { data: "base64...", altText?, isPrimary?, variantId? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;
    const { id: productId } = await params;

    let body: UploadImageBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.data || body.data.trim() === "") {
      return NextResponse.json(
        apiResponse(false, undefined, "Image data (base64) is required"),
        { status: 400 }
      );
    }

    // Verify product belongs to store
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) {
      return NextResponse.json(
        apiResponse(false, undefined, "Product not found"),
        { status: 404 }
      );
    }

    if (product.storeId !== storeId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Unauthorized"),
        { status: 403 }
      );
    }

    // If variant is specified, verify it belongs to this product
    if (body.variantId) {
      const variant = await db.productVariant.findUnique({
        where: { id: body.variantId },
        select: { productId: true },
      });

      if (!variant || variant.productId !== productId) {
        return NextResponse.json(
          apiResponse(false, undefined, "Variant not found or doesn't belong to this product"),
          { status: 404 }
        );
      }
    }

    // Generate a unique filename for the image
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(8).toString("hex");
    const filename = `${productId}/${timestamp}-${randomStr}.jpg`;

    // In production, upload to R2/S3. For now, generate a placeholder URL.
    // This is a stub implementation - replace with actual R2/S3 upload logic
    const imageUrl = `https://cdn.nexomarket.dev/images/${filename}`;

    // If isPrimary is true, unset primary on other images for this product
    if (body.isPrimary) {
      await db.productImage.updateMany({
        where: {
          productId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Create the image record
    const image = await db.productImage.create({
      data: {
        productId,
        url: imageUrl,
        altText: body.altText || null,
        isPrimary: body.isPrimary || false,
        variantId: body.variantId || null,
      },
    });

    return NextResponse.json(
      apiResponse(true, {
        id: image.id,
        url: image.url,
        altText: image.altText,
        isPrimary: image.isPrimary,
        variantId: image.variantId,
        createdAt: image.id, // Using ID as creation indicator
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/v1/products/[id]/images error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/products/[id]/images
 * Delete an image by providing imageId in body
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;
    const { id: productId } = await params;

    let body: DeleteImageBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    if (!body.imageId) {
      return NextResponse.json(
        apiResponse(false, undefined, "imageId is required"),
        { status: 400 }
      );
    }

    // Verify product belongs to store
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) {
      return NextResponse.json(
        apiResponse(false, undefined, "Product not found"),
        { status: 404 }
      );
    }

    if (product.storeId !== storeId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Unauthorized"),
        { status: 403 }
      );
    }

    // Verify image belongs to this product
    const image = await db.productImage.findUnique({
      where: { id: body.imageId },
    });

    if (!image) {
      return NextResponse.json(
        apiResponse(false, undefined, "Image not found"),
        { status: 404 }
      );
    }

    if (image.productId !== productId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Image doesn't belong to this product"),
        { status: 403 }
      );
    }

    // Delete the image
    await db.productImage.delete({
      where: { id: body.imageId },
    });

    return NextResponse.json(
      apiResponse(true, {
        id: body.imageId,
        message: "Image deleted successfully",
      })
    );
  } catch (error) {
    console.error("DELETE /api/v1/products/[id]/images error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
