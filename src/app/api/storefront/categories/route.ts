import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * GET /api/storefront/categories
 * Public API for listing categories with subcategories and product counts
 *
 * Query params:
 *   parent - Parent category slug (returns children of this category)
 *   flat   - If "true", returns flat list without nesting
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentSlug = searchParams.get("parent") || undefined;
    const flat = searchParams.get("flat") === "true";

    if (parentSlug) {
      // Get subcategories of a specific parent
      const parent = await db.category.findUnique({
        where: { slug: parentSlug },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
              _count: { select: { products: true } },
            },
          },
          _count: { select: { products: true } },
        },
      });

      if (!parent) {
        return NextResponse.json(
          { success: false, error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          description: parent.description,
          imageUrl: parent.imageUrl,
          productCount: parent._count.products,
          subcategories: parent.children.map((child: any): any => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
            description: child.description,
            imageUrl: child.imageUrl,
            productCount: child._count.products,
          })),
        },
      });
    }

    // Get all top-level categories with their children
    const categories = await db.category.findMany({
      where: {
        isActive: true,
        parentId: flat ? undefined : null, // Top-level only if not flat
      },
      orderBy: { sortOrder: "asc" },
      include: {
        children: flat
          ? undefined
          : {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
              include: {
                _count: { select: { products: true } },
              },
            },
        _count: { select: { products: true } },
      },
    });

    const formattedCategories = categories.map((cat: any): any => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      productCount: cat._count.products,
      subcategories: flat
        ? undefined
        : (cat as any).children?.map((child: any): any => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
            productCount: child._count.products,
          })),
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
      total: formattedCategories.length,
    });
  } catch (error) {
    console.error("GET /api/storefront/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
