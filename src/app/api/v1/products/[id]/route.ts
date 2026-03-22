import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";

export const runtime = "nodejs";

interface UpdateProductBody {
  name?: string;
  description?: string;
  basePrice?: number;
  compareAtPrice?: number;
  categoryId?: string;
  sku?: string;
  status?: string;
  attributes?: Record<string, any>;
  isFeatured?: boolean;
}

/**
 * GET /api/v1/products/[id]
 * Get a single product by ID (must belong to authenticated store)
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

    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          include: {
            images: true,
          },
        },
        images: {
          where: { variantId: null },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            status: true,
            createdAt: true,
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        apiResponse(false, undefined, "Product not found"),
        { status: 404 }
      );
    }

    // Verify product belongs to authenticated store
    if (product.storeId !== storeId) {
      return NextResponse.json(
        apiResponse(false, undefined, "Unauthorized"),
        { status: 403 }
      );
    }

    return NextResponse.json(
      apiResponse(true, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice.toString(),
        compareAtPrice: product.compareAtPrice?.toString(),
        status: product.status,
        sku: product.sku,
        isFeatured: product.isFeatured,
        attributes: product.attributes,
        avgRating: product.avgRating.toString(),
        totalReviews: product.totalReviews,
        totalSold: product.totalSold,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        } : null,
        variants: product.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price.toString(),
          compareAtPrice: v.compareAtPrice?.toString(),
          stockQuantity: v.stockQuantity,
          options: v.options,
          images: v.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            altText: img.altText,
          })),
        })),
        images: product.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
        })),
        reviewCount: product._count.reviews,
        recentReviews: product.reviews,
        publishedAt: product.publishedAt,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
    );
  } catch (error) {
    console.error("GET /api/v1/products/[id] error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/products/[id]
 * Update a product (partial update)
 */
export async function PUT(
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

    let body: UpdateProductBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Verify product belongs to store
    const product = await db.product.findUnique({
      where: { id },
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

    // Build update data
    const updateData: any = {};

    if (body.name !== undefined) {
      updateData.name = body.name;
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    if (body.basePrice !== undefined) {
      if (body.basePrice <= 0) {
        return NextResponse.json(
          apiResponse(false, undefined, "Base price must be greater than 0"),
          { status: 400 }
        );
      }
      updateData.basePrice = Number(body.basePrice);
    }

    if (body.compareAtPrice !== undefined) {
      updateData.compareAtPrice = Number(body.compareAtPrice);
    }

    if (body.categoryId !== undefined) {
      updateData.categoryId = body.categoryId;
    }

    if (body.sku !== undefined) {
      updateData.sku = body.sku;
    }

    if (body.status !== undefined) {
      updateData.status = body.status as any;
    }

    if (body.attributes !== undefined) {
      updateData.attributes = body.attributes;
    }

    if (body.isFeatured !== undefined) {
      updateData.isFeatured = body.isFeatured;
    }

    updateData.updatedAt = new Date();

    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return NextResponse.json(
      apiResponse(true, {
        id: updatedProduct.id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        description: updatedProduct.description,
        basePrice: updatedProduct.basePrice.toString(),
        compareAtPrice: updatedProduct.compareAtPrice?.toString(),
        status: updatedProduct.status,
        sku: updatedProduct.sku,
        isFeatured: updatedProduct.isFeatured,
        updatedAt: updatedProduct.updatedAt,
      })
    );
  } catch (error) {
    console.error("PUT /api/v1/products/[id] error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/products/[id]
 * Soft delete a product (set status to DELETED)
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
    const { id } = await params;

    // Verify product belongs to store
    const product = await db.product.findUnique({
      where: { id },
      select: { storeId: true, status: true },
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

    // Soft delete by setting status to DELETED
    await db.product.update({
      where: { id },
      data: {
        status: "DELETED",
      },
    });

    return NextResponse.json(
      apiResponse(true, {
        id,
        message: "Product deleted successfully",
      })
    );
  } catch (error) {
    console.error("DELETE /api/v1/products/[id] error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
