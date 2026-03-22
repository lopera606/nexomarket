import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/storefront/products
 * Public API for storefront product search and filtering
 * No authentication required - returns only ACTIVE products
 *
 * Query params:
 *   q          - Search query (searches name, description, sku)
 *   category   - Category slug to filter
 *   subcategory - Subcategory slug to filter
 *   minPrice   - Minimum price filter
 *   maxPrice   - Maximum price filter
 *   rating     - Minimum rating filter (e.g. 4 = 4 stars and up)
 *   brand      - Brand name filter
 *   sort       - Sort option: relevance, price-asc, price-desc, rating, newest, bestseller
 *   page       - Page number (default 1)
 *   limit      - Items per page (default 24, max 100)
 *   featured   - Only featured products (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse parameters
    const q = searchParams.get("q") || undefined;
    const categorySlug = searchParams.get("category") || undefined;
    const subcategorySlug = searchParams.get("subcategory") || undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const minRating = searchParams.get("rating")
      ? parseFloat(searchParams.get("rating")!)
      : undefined;
    const brand = searchParams.get("brand") || undefined;
    const sort = searchParams.get("sort") || "relevance";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "24"))
    );
    const featured = searchParams.get("featured") === "true";

    // Build where conditions - only ACTIVE products
    const where: any = {
      status: "ACTIVE",
    };

    // Text search
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ];
    }

    // Category filter (supports parent or child category)
    if (categorySlug) {
      const category = await db.category.findUnique({
        where: { slug: categorySlug },
        include: { children: true },
      });

      if (category) {
        // Include products from this category and all its children
        const categoryIds = [
          category.id,
          ...category.children.map((c: any): any => c.id),
        ];
        where.categoryId = { in: categoryIds };
      }
    }

    // Subcategory filter (more specific than category)
    if (subcategorySlug && !categorySlug) {
      const subcategory = await db.category.findUnique({
        where: { slug: subcategorySlug },
      });
      if (subcategory) {
        where.categoryId = subcategory.id;
      }
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined)
        (where.basePrice as any).gte = Number(minPrice);
      if (maxPrice !== undefined)
        (where.basePrice as any).lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating !== undefined) {
      where.avgRating = { gte: Number(minRating) };
    }

    // Brand filter (stored in attributes JSON)
    if (brand) {
      where.attributes = {
        path: ["brand"],
        string_contains: brand,
      };
    }

    // Featured filter
    if (featured) {
      where.isFeatured = true;
    }

    // Build sort order
    let orderBy: any = {};
    switch (sort) {
      case "price-asc":
        orderBy = { basePrice: "asc" };
        break;
      case "price-desc":
        orderBy = { basePrice: "desc" };
        break;
      case "rating":
        orderBy = { avgRating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "bestseller":
        orderBy = { totalSold: "desc" };
        break;
      default:
        // Relevance: if search query, no specific order; otherwise newest
        orderBy = q ? { totalSold: "desc" } : { createdAt: "desc" };
    }

    // Count total
    const total = await db.product.count({ where });

    // Fetch products
    const products = await db.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true, parentId: true },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true, altText: true },
        },
        store: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });

    // Format response
    const formattedProducts = products.map((p: any): any => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description
        ? p.description.substring(0, 200) +
          (p.description.length > 200 ? "..." : "")
        : null,
      price: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      discount: p.compareAtPrice
        ? Math.round(
            ((Number(p.compareAtPrice) - Number(p.basePrice)) /
              Number(p.compareAtPrice)) *
              100
          )
        : 0,
      rating: Number(p.avgRating),
      reviewCount: p._count.reviews,
      totalSold: p.totalSold,
      isFeatured: p.isFeatured,
      image: p.images[0]?.url || null,
      imageAlt: p.images[0]?.altText || p.name,
      category: p.category
        ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
        : null,
      store: p.store
        ? { id: p.store.id, name: p.store.name, slug: p.store.slug }
        : null,
      attributes: p.attributes,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
      filters: {
        q,
        category: categorySlug,
        subcategory: subcategorySlug,
        minPrice,
        maxPrice,
        minRating,
        brand,
        sort,
        featured,
      },
    });
  } catch (error) {
    console.error("GET /api/storefront/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search products" },
      { status: 500 }
    );
  }
}
