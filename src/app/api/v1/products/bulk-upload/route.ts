import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface ProductRow {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  sku?: string;
  precio: number;
  precio_comparacion?: number;
  stock: number;
  peso_kg?: number;
  tags?: string;
  variante_talla?: string;
  variante_color?: string;
  variante_stock?: number;
  variante_precio?: number;
  unidad_venta?: string;
  cantidad_minima?: number;
  incremento_cantidad?: number;
  estado?: string;
  [key: string]: any;
}

interface ProcessedProduct {
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  basePrice: number;
  compareAtPrice?: number;
  stock: number;
  weightKg?: number;
  tags?: string[];
  variants: Array<{
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    options: Record<string, string>;
  }>;
  status: string;
}

const VALID_CATEGORIES = [
  'electronics', 'fashion', 'home', 'sports', 'books', 'games', 'beauty', 'groceries',
  'electrónica', 'moda', 'hogar y cocina', 'deportes', 'libros', 'juguetes', 'belleza', 'supermercado',
];

const CATEGORY_MAP: Record<string, string> = {
  'electrónica': 'electronics',
  'electronica': 'electronics',
  'moda': 'fashion',
  'hogar y cocina': 'home',
  'hogar': 'home',
  'deportes': 'sports',
  'libros': 'books',
  'juguetes': 'games',
  'belleza': 'beauty',
  'supermercado': 'groceries',
};

function normalizeCategory(cat: string): string {
  const lower = cat.toLowerCase().trim();
  return CATEGORY_MAP[lower] || lower;
}

function parseExcelData(rows: Record<string, any>[]): { products: ProcessedProduct[]; errors: string[] } {
  const products: ProcessedProduct[] = [];
  const errors: string[] = [];
  const productMap = new Map<string, ProcessedProduct>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 because row 1 is header

    // Normalize column names (lowercase, trim, remove accents for matching)
    const normalized: Record<string, any> = {};
    for (const [key, value] of Object.entries(row)) {
      const k = key.toLowerCase().trim()
        .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
      normalized[k] = value;
    }

    const nombre = (normalized['nombre'] || normalized['nombre_producto'] || normalized['name'] || normalized['producto'] || '').toString().trim();
    if (!nombre) {
      errors.push(`Fila ${rowNum}: Nombre del producto es obligatorio`);
      continue;
    }

    const precioRaw = normalized['precio'] || normalized['price'] || normalized['precio_base'] || 0;
    const precio = parseFloat(precioRaw.toString().replace(',', '.').replace('€', '').trim());
    if (isNaN(precio) || precio <= 0) {
      errors.push(`Fila ${rowNum}: Precio inválido para "${nombre}" (${precioRaw})`);
      continue;
    }

    const stockRaw = normalized['stock'] || normalized['cantidad'] || normalized['stock_quantity'] || 0;
    const stock = parseInt(stockRaw.toString());

    const precioComp = normalized['precio_comparacion'] || normalized['compare_price'] || normalized['precio_anterior'] || null;
    const pesoRaw = normalized['peso_kg'] || normalized['peso'] || normalized['weight'] || null;

    // Extract all variant_* columns dynamically
    const variantOptions: Record<string, string> = {};
    const variantCols = Object.keys(normalized).filter(k => k.startsWith('variante_'));

    for (const colKey of variantCols) {
      const attrName = colKey.substring(9); // Remove 'variante_' prefix
      const value = (normalized[colKey] || '').toString().trim();
      if (value) {
        variantOptions[attrName] = value;
      }
    }

    const variante_stock = parseInt((normalized['variante_stock'] || normalized['stock_variante'] || stock || '0').toString());
    const variante_precio = parseFloat((normalized['variante_precio'] || normalized['precio_variante'] || '0').toString().replace(',', '.'));

    // Extract unit-based columns
    const unidad_venta = (normalized['unidad_venta'] || normalized['selling_unit'] || '').toString().trim() || undefined;
    const cantidad_minima = normalized['cantidad_minima'] || normalized['min_quantity'] ? parseFloat((normalized['cantidad_minima'] || normalized['min_quantity']).toString().replace(',', '.')) : undefined;
    const incremento_cantidad = normalized['incremento_cantidad'] || normalized['quantity_step'] ? parseFloat((normalized['incremento_cantidad'] || normalized['quantity_step']).toString().replace(',', '.')) : undefined;

    // Check if this is a variant row for an existing product
    const productKey = nombre.toLowerCase();
    const hasVariantOptions = Object.keys(variantOptions).length > 0;

    if (productMap.has(productKey) && hasVariantOptions) {
      // Add variant to existing product
      const existing = productMap.get(productKey)!;
      const variantParts = Object.values(variantOptions).filter(Boolean);
      existing.variants.push({
        name: variantParts.join(' / '),
        sku: (normalized['sku'] || normalized['sku_variante'] || `${nombre.substring(0, 10)}-${variantParts.join('-')}-${Date.now()}`).toString().replace(/\s/g, '-'),
        price: variante_precio > 0 ? variante_precio : existing.basePrice,
        stockQuantity: variante_stock,
        options: variantOptions,
      });
    } else {
      // New product
      const product: ProcessedProduct = {
        name: nombre,
        description: (normalized['descripcion'] || normalized['description'] || '').toString().trim() || undefined,
        category: normalized['categoria'] || normalized['category'] ? normalizeCategory((normalized['categoria'] || normalized['category']).toString()) : undefined,
        sku: (normalized['sku'] || '').toString().trim() || undefined,
        basePrice: precio,
        compareAtPrice: precioComp ? parseFloat(precioComp.toString().replace(',', '.').replace('€', '').trim()) : undefined,
        stock: isNaN(stock) ? 0 : stock,
        weightKg: pesoRaw ? parseFloat(pesoRaw.toString().replace(',', '.')) : undefined,
        tags: normalized['tags'] || normalized['etiquetas'] ? (normalized['tags'] || normalized['etiquetas']).toString().split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
        variants: [],
        status: (normalized['estado'] || normalized['status'] || 'borrador').toString().toLowerCase(),
      };

      // Add initial variant if present
      if (hasVariantOptions) {
        const variantParts = Object.values(variantOptions).filter(Boolean);
        product.variants.push({
          name: variantParts.join(' / '),
          sku: (normalized['sku_variante'] || `${nombre.substring(0, 10)}-${variantParts.join('-')}-${Date.now()}`).toString().replace(/\s/g, '-'),
          price: variante_precio > 0 ? variante_precio : precio,
          stockQuantity: variante_stock,
          options: variantOptions,
        });
      }

      productMap.set(productKey, product);
      products.push(product);
    }
  }

  return { products, errors };
}

/**
 * POST /api/v1/products/bulk-upload
 * Upload products in bulk from JSON (parsed from Excel on client side)
 *
 * Body: { rows: Array<Record<string, any>> }
 * Each row represents a product or variant row from the Excel file
 */
export async function POST(request: NextRequest) {
  try {
    let body: { rows: Record<string, any>[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "JSON inválido en el cuerpo de la petición" },
        { status: 400 }
      );
    }

    if (!body.rows || !Array.isArray(body.rows) || body.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se encontraron filas de datos. Asegúrate de que el Excel contiene datos." },
        { status: 400 }
      );
    }

    if (body.rows.length > 500) {
      return NextResponse.json(
        { success: false, error: "Máximo 500 filas por subida. Divide tu archivo en partes más pequeñas." },
        { status: 400 }
      );
    }

    const { products, errors } = parseExcelData(body.rows);

    // Build response summary
    const summary = {
      totalRows: body.rows.length,
      productsFound: products.length,
      totalVariants: products.reduce((sum: number, p: any) => sum + p.variants.length, 0),
      validationErrors: errors.length,
      categories: [...new Set(products.map((p: any) => p.category).filter(Boolean))],
      priceRange: products.length > 0 ? {
        min: Math.min(...products.map((p: any) => p.basePrice)),
        max: Math.max(...products.map((p: any) => p.basePrice)),
      } : null,
    };

    // In a real implementation with DB, we would save to database here
    // For now, return the parsed data for the frontend to confirm
    return NextResponse.json({
      success: true,
      message: `Se procesaron ${products.length} productos correctamente`,
      summary,
      products: products.map((p: any) => ({
        name: p.name,
        description: p.description,
        category: p.category,
        sku: p.sku,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        weightKg: p.weightKg,
        tags: p.tags,
        variantCount: p.variants.length,
        variants: p.variants,
        status: p.status,
      })),
      errors,
    });
  } catch (error) {
    console.error("POST /api/v1/products/bulk-upload error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/products/bulk-upload
 * Returns the expected Excel template format
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    templateInfo: {
      description: "Plantilla para subida masiva de productos a NexoMarket",
      downloadUrl: "/plantilla-productos.xlsx",
      columns: [
        { name: "nombre", required: true, description: "Nombre del producto", example: "iPhone 15 Pro 128GB" },
        { name: "descripcion", required: false, description: "Descripción detallada", example: "Smartphone Apple con chip A17 Pro..." },
        { name: "categoria", required: false, description: "Categoría del producto", example: "Electrónica", values: ["Electrónica", "Moda", "Hogar y Cocina", "Deportes", "Libros", "Juguetes", "Belleza", "Supermercado"] },
        { name: "sku", required: false, description: "Código SKU único", example: "IPH15P-128-BLK" },
        { name: "precio", required: true, description: "Precio en EUR", example: "1199.99" },
        { name: "precio_comparacion", required: false, description: "Precio anterior (tachado)", example: "1399.99" },
        { name: "stock", required: true, description: "Unidades disponibles", example: "50" },
        { name: "peso_kg", required: false, description: "Peso en kilogramos", example: "0.187" },
        { name: "tags", required: false, description: "Etiquetas separadas por coma", example: "apple,smartphone,5g" },
        { name: "variante_talla", required: false, description: "Talla de la variante", example: "M" },
        { name: "variante_color", required: false, description: "Color de la variante", example: "Negro" },
        { name: "variante_material", required: false, description: "Material (atributo de variante genérico)", example: "Algodón" },
        { name: "variante_largo", required: false, description: "Largo (atributo de variante genérico)", example: "50cm" },
        { name: "variante_almacenamiento", required: false, description: "Almacenamiento (atributo de variante genérico)", example: "512GB" },
        { name: "variante_stock", required: false, description: "Stock de la variante", example: "25" },
        { name: "variante_precio", required: false, description: "Precio específico de variante", example: "1249.99" },
        { name: "unidad_venta", required: false, description: "Unidad de venta (e.g. unidad, metro, kg, litro, m2, pack)", example: "metro" },
        { name: "cantidad_minima", required: false, description: "Cantidad mínima a vender", example: "0.5" },
        { name: "incremento_cantidad", required: false, description: "Incremento de cantidad permitido", example: "0.1" },
        { name: "estado", required: false, description: "Estado del producto", example: "activo", values: ["borrador", "activo", "pausado"] },
      ],
      notes: [
        "Para añadir variantes a un producto, repite el nombre del producto en filas adicionales con diferentes variante_*",
        "Puedes usar cualquier columna variante_* (variante_talla, variante_color, variante_material, variante_largo, etc.)",
        "Para productos vendidos por unidades (metro, kg, litro, m2, pack), usa unidad_venta, cantidad_minima, incremento_cantidad",
        "Los precios usan punto o coma como separador decimal",
        "Máximo 500 filas por subida",
        "Las categorías pueden estar en español o inglés",
      ],
    },
  });
}
