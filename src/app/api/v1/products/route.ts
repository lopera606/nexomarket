import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticateApiKey, apiResponse } from "@/lib/api-auth";
import { PLANS } from "@/config/plans";

export const runtime = "nodejs";

interface CreateProductBody {
  name: string;
  description?: string;
  basePrice: number;
  compareAtPrice?: number;
  categoryId?: string;
  sku?: string;
  attributes?: Record<string, any>;
  variants?: Array<{
    name: string;
    sku: string;
    price: number;
    compareAtPrice?: number;
    stockQuantity?: number;
    options?: Record<string, string>;
  }>;
}

/**
 * GET /api/v1/products
 * List all products for the authenticated store
 * Query params: page (default 1), limit (default 20), status, category, search
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId } = auth.data!;

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Build filter conditions
    const where: any = {
      storeId,
    };

    if (status) {
      where.status = status as any;
    }

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await db.product.count({ where });

    // Fetch products with pagination
    const products = await db.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          include: {
            images: true,
          },
        },
        images: {
          where: { variantId: null }, // Only product-level images
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPages = Math.ceil(total / limit);

    const formattedProducts = products.map((product: any) => ({
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
      variantCount: product.variants.length,
      imageCount: product.images.length,
      reviewCount: product._count.reviews,
      orderCount: product._count.orderItems,
      publishedAt: product.publishedAt,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(
      apiResponse(true, formattedProducts, undefined, {
        page,
        limit,
        total,
        totalPages,
      })
    );
  } catch (error) {
    console.error("GET /api/v1/products error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/products
 * Create a new product for the authenticated store
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);
    if (!auth.authenticated) {
      return NextResponse.json(auth.response);
    }

    const { storeId, planTier } = auth.data!;

    // Parse request body
    let body: CreateProductBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        apiResponse(false, undefined, "Invalid JSON in request body"),
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        apiResponse(false, undefined, "Product name is required"),
        { status: 400 }
      );
    }

    if (body.basePrice === undefined || body.basePrice <= 0) {
      return NextResponse.json(
        apiResponse(false, undefined, "Base price must be greater than 0"),
        { status: 400 }
      );
    }

    // Check product limit based on plan
    const planConfig = PLANS[planTier as keyof typeof PLANS];
    if (planConfig.maxProducts > 0) {
      const currentCount = await db.product.count({
        where: { storeId },
      });

      if (currentCount >= planConfig.maxProducts) {
        return NextResponse.json(
          apiResponse(
            false,
            undefined,
            `You have reached the maximum of ${planConfig.maxProducts} products for your ${planTier} plan`
          ),
          { status: 403 }
        );
      }
    }

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100) + `-${Date.now()}`;

    // Create product with transaction to handle variants
    const product = await db.product.create({
      data: {
        storeId,
        name: body.name,
        slug,
        description: body.description || null,
        basePrice: Number(body.basePrice),
        compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
        categoryId: body.categoryId,
        sku: body.sku,
        attributes: body.attributes || undefined,
        status: "DRAFT",
        variants: {
          create: body.variants?.map((variant: any) => ({
            name: variant.name,
            sku: variant.sku,
            price: Number(variant.price),
            compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
            stockQuantity: variant.stockQuantity || 0,
            options: variant.options || undefined,
          })) || [],
        },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

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
        categoryId: product.categoryId,
        variantCount: product.variants.length,
        createdAt: product.createdAt,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/v1/products error:", error);
    return NextResponse.json(
      apiResponse(false, undefined, "Internal server error"),
      { status: 500 }
    );
  }
}
