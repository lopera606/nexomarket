import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// One-time seed endpoint - protected by secret
export async function POST(request: NextRequest) {
  const { secret } = await request.json().catch(() => ({ secret: "" }));

  if (secret !== process.env.GOD_MODE_SECRET && secret !== "nexo-seed-2026") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    // Check if already seeded
    const existingUsers = await db.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ message: "DB ya tiene datos", users: existingUsers });
    }

    const pwd = await hash("Admin123!", 12);
    const sellerPwd = await hash("Seller123!", 12);
    const clientPwd = await hash("Cliente123!", 12);

    // Categories
    const categories = [
      { name: "Electrónica", slug: "electronica", description: "Smartphones, tablets y gadgets", sortOrder: 1 },
      { name: "Moda", slug: "moda", description: "Ropa, zapatos y accesorios", sortOrder: 2 },
      { name: "Hogar y Jardín", slug: "hogar-jardin", description: "Muebles, decoración y jardín", sortOrder: 3 },
      { name: "Deportes", slug: "deportes", description: "Equipamiento deportivo", sortOrder: 4 },
      { name: "Libros", slug: "libros", description: "Libros físicos y digitales", sortOrder: 5 },
      { name: "Gaming", slug: "gaming", description: "Consolas, juegos y accesorios", sortOrder: 6 },
      { name: "Belleza", slug: "belleza", description: "Cosmética y cuidado personal", sortOrder: 7 },
      { name: "Alimentación", slug: "alimentacion", description: "Productos gourmet y bebidas", sortOrder: 8 },
      { name: "Informática", slug: "informatica", description: "Ordenadores y componentes", sortOrder: 9 },
      { name: "Audio", slug: "audio", description: "Auriculares, altavoces y más", sortOrder: 10 },
    ];

    for (const cat of categories) {
      await db.category.create({ data: cat });
    }

    // Admin user
    const admin = await db.user.create({
      data: {
        email: "admin@nexomarket.com",
        passwordHash: pwd,
        firstName: "Admin",
        lastName: "NexoMarket",
        role: "ADMIN",
        isVerified: true,
      },
    });

    // Seller 1 - TechStore
    const seller1 = await db.user.create({
      data: {
        email: "vendedor1@nexomarket.com",
        passwordHash: sellerPwd,
        firstName: "Carlos",
        lastName: "Martínez",
        role: "SELLER",
        isVerified: true,
      },
    });

    const store1 = await db.store.create({
      data: {
        ownerId: seller1.id,
        name: "TechStore",
        slug: "techstore",
        description: "Tu tienda de tecnología de confianza. Los mejores gadgets y electrónica.",
        email: "info@techstore.com",
        status: "ACTIVE",
        approvedAt: new Date(),
      },
    });

    // Seller 2 - ModaPlus
    const seller2 = await db.user.create({
      data: {
        email: "vendedor2@nexomarket.com",
        passwordHash: sellerPwd,
        firstName: "María",
        lastName: "López",
        role: "SELLER",
        isVerified: true,
      },
    });

    const store2 = await db.store.create({
      data: {
        ownerId: seller2.id,
        name: "ModaPlus",
        slug: "modaplus",
        description: "Moda actual para toda la familia. Marcas premium a precios increíbles.",
        email: "info@modaplus.com",
        status: "ACTIVE",
        approvedAt: new Date(),
      },
    });

    // Seller 3 - HogarStyle
    const seller3 = await db.user.create({
      data: {
        email: "vendedor3@nexomarket.com",
        passwordHash: sellerPwd,
        firstName: "Pedro",
        lastName: "García",
        role: "SELLER",
        isVerified: true,
      },
    });

    const store3 = await db.store.create({
      data: {
        ownerId: seller3.id,
        name: "HogarStyle",
        slug: "hogarstyle",
        description: "Todo para tu hogar. Decoración, muebles y accesorios con estilo.",
        email: "info@hogarstyle.com",
        status: "ACTIVE",
        approvedAt: new Date(),
      },
    });

    // Customer
    const customer = await db.user.create({
      data: {
        email: "cliente@nexomarket.com",
        passwordHash: clientPwd,
        firstName: "Ana",
        lastName: "Ruiz",
        role: "CUSTOMER",
        isVerified: true,
      },
    });

    // Get categories for products
    const catElec = await db.category.findUnique({ where: { slug: "electronica" } });
    const catModa = await db.category.findUnique({ where: { slug: "moda" } });
    const catHogar = await db.category.findUnique({ where: { slug: "hogar-jardin" } });

    // Products for TechStore
    const products1 = [
      { name: "Smartphone Galaxy Pro", slug: "smartphone-galaxy-pro", basePrice: 699.99, description: "El último smartphone con cámara de 200MP", categoryId: catElec?.id },
      { name: "Auriculares Bluetooth Pro", slug: "auriculares-bluetooth-pro", basePrice: 149.99, description: "Cancelación de ruido activa, 30h batería", categoryId: catElec?.id },
      { name: "Tablet Ultra 12", slug: "tablet-ultra-12", basePrice: 499.99, description: "Pantalla AMOLED de 12 pulgadas", categoryId: catElec?.id },
      { name: "Smartwatch Deportivo", slug: "smartwatch-deportivo", basePrice: 249.99, description: "GPS integrado, monitor cardíaco, resistente al agua", categoryId: catElec?.id },
    ];

    for (const p of products1) {
      const product = await db.product.create({
        data: { ...p, storeId: store1.id, status: "ACTIVE", publishedAt: new Date() },
      });
      await db.productVariant.create({
        data: { productId: product.id, name: "Estándar", sku: `TS-${product.id.slice(0,8)}`, price: p.basePrice, stockQuantity: 50 },
      });
      await db.productImage.create({
        data: { productId: product.id, url: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600`, altText: p.name, isPrimary: true, sortOrder: 0 },
      });
    }

    // Products for ModaPlus
    const products2 = [
      { name: "Zapatillas Running Air", slug: "zapatillas-running-air", basePrice: 129.99, description: "Máxima amortiguación para runners", categoryId: catModa?.id },
      { name: "Chaqueta Técnica Waterproof", slug: "chaqueta-tecnica-waterproof", basePrice: 189.99, description: "Impermeable y transpirable", categoryId: catModa?.id },
      { name: "Bolso Cuero Premium", slug: "bolso-cuero-premium", basePrice: 89.99, description: "Cuero genuino, diseño atemporal", categoryId: catModa?.id },
    ];

    for (const p of products2) {
      const product = await db.product.create({
        data: { ...p, storeId: store2.id, status: "ACTIVE", publishedAt: new Date() },
      });
      await db.productVariant.create({
        data: { productId: product.id, name: "Talla única", sku: `MP-${product.id.slice(0,8)}`, price: p.basePrice, stockQuantity: 30 },
      });
      await db.productImage.create({
        data: { productId: product.id, url: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600`, altText: p.name, isPrimary: true, sortOrder: 0 },
      });
    }

    // Products for HogarStyle
    const products3 = [
      { name: "Lámpara LED Diseño", slug: "lampara-led-diseno", basePrice: 79.99, description: "Luz cálida regulable, diseño nórdico", categoryId: catHogar?.id },
      { name: "Set Sábanas Algodón Egipcio", slug: "set-sabanas-algodon-egipcio", basePrice: 69.99, description: "600 hilos, suavidad premium", categoryId: catHogar?.id },
      { name: "Cafetera Espresso Automática", slug: "cafetera-espresso-automatica", basePrice: 299.99, description: "15 bares, molinillo integrado", categoryId: catHogar?.id },
    ];

    for (const p of products3) {
      const product = await db.product.create({
        data: { ...p, storeId: store3.id, status: "ACTIVE", publishedAt: new Date() },
      });
      await db.productVariant.create({
        data: { productId: product.id, name: "Estándar", sku: `HS-${product.id.slice(0,8)}`, price: p.basePrice, stockQuantity: 20 },
      });
      await db.productImage.create({
        data: { productId: product.id, url: `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600`, altText: p.name, isPrimary: true, sortOrder: 0 },
      });
    }

    // Create subscriptions for stores
    for (const store of [store1, store2, store3]) {
      await db.storeSubscription.create({
        data: { storeId: store.id, plan: "FREE", status: "ACTIVE", startDate: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      seeded: {
        users: 5,
        stores: 3,
        categories: categories.length,
        products: products1.length + products2.length + products3.length,
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
