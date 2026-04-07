import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data (in reverse dependency order)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.subOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned existing data.');

  // ============================================================
  // CATEGORIES (15)
  // ============================================================
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Electronica', slug: 'electronics', description: 'Dispositivos electronicos, gadgets y accesorios', sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: 'Moda', slug: 'fashion', description: 'Ropa, calzado y complementos', sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: 'Hogar y Jardin', slug: 'home-garden', description: 'Muebles, decoracion y jardineria', sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: 'Deportes', slug: 'sports', description: 'Equipamiento deportivo y fitness', sortOrder: 4 },
    }),
    prisma.category.create({
      data: { name: 'Libros', slug: 'books', description: 'Libros, ebooks y material de lectura', sortOrder: 5 },
    }),
    prisma.category.create({
      data: { name: 'Gaming', slug: 'gaming', description: 'Videojuegos, consolas y accesorios gaming', sortOrder: 6 },
    }),
    prisma.category.create({
      data: { name: 'Belleza', slug: 'beauty', description: 'Cosmetica, cuidado personal y perfumeria', sortOrder: 7 },
    }),
    prisma.category.create({
      data: { name: 'Supermercado', slug: 'groceries', description: 'Alimentacion, bebidas y productos del hogar', sortOrder: 8 },
    }),
    prisma.category.create({
      data: { name: 'Informatica', slug: 'computing', description: 'Ordenadores, componentes y perifericos', sortOrder: 9 },
    }),
    prisma.category.create({
      data: { name: 'Audio', slug: 'audio', description: 'Auriculares, altavoces y equipos de sonido', sortOrder: 10 },
    }),
    prisma.category.create({
      data: { name: 'Relojes', slug: 'watches', description: 'Relojes de pulsera y smartwatches', sortOrder: 11 },
    }),
    prisma.category.create({
      data: { name: 'Fotografia', slug: 'photography', description: 'Camaras, objetivos y accesorios fotograficos', sortOrder: 12 },
    }),
    prisma.category.create({
      data: { name: 'TV y Video', slug: 'tv-video', description: 'Televisores, proyectores y streaming', sortOrder: 13 },
    }),
    prisma.category.create({
      data: { name: 'Bebe', slug: 'baby', description: 'Articulos para bebes y primera infancia', sortOrder: 14 },
    }),
    prisma.category.create({
      data: { name: 'Otros', slug: 'others', description: 'Otros productos y categorias', sortOrder: 15 },
    }),
  ]);

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    catMap[c.slug] = c.id;
  }

  console.log(`Created ${categories.length} categories.`);

  // ============================================================
  // USERS (5)
  // ============================================================
  const passwordAdmin = await hash('Admin123!', 12);
  const passwordSeller = await hash('Seller123!', 12);
  const passwordCustomer = await hash('Cliente123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@nexomarket.com',
      passwordHash: passwordAdmin,
      firstName: 'Admin',
      lastName: 'NexoMarket',
      role: 'ADMIN',
      isVerified: true,
      locale: 'es',
      preferredCurrency: 'EUR',
    },
  });

  const seller1 = await prisma.user.create({
    data: {
      email: 'vendedor1@nexomarket.com',
      passwordHash: passwordSeller,
      firstName: 'Carlos',
      lastName: 'Martinez',
      role: 'SELLER',
      isVerified: true,
      locale: 'es',
      preferredCurrency: 'EUR',
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'vendedor2@nexomarket.com',
      passwordHash: passwordSeller,
      firstName: 'Maria',
      lastName: 'Lopez',
      role: 'SELLER',
      isVerified: true,
      locale: 'es',
      preferredCurrency: 'EUR',
    },
  });

  const seller3 = await prisma.user.create({
    data: {
      email: 'vendedor3@nexomarket.com',
      passwordHash: passwordSeller,
      firstName: 'Pablo',
      lastName: 'Garcia',
      role: 'SELLER',
      isVerified: true,
      locale: 'es',
      preferredCurrency: 'EUR',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'cliente@nexomarket.com',
      passwordHash: passwordCustomer,
      firstName: 'Ana',
      lastName: 'Rodriguez',
      role: 'CUSTOMER',
      isVerified: true,
      locale: 'es',
      preferredCurrency: 'EUR',
    },
  });

  console.log('Created 5 users.');

  // Create customer address
  const customerAddress = await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Casa',
      fullName: 'Ana Rodriguez',
      streetLine1: 'Calle Gran Via 42, 3o B',
      city: 'Madrid',
      state: 'Madrid',
      postalCode: '28013',
      country: 'ES',
      phone: '+34 612 345 678',
      isDefault: true,
    },
  });

  // ============================================================
  // STORES (3)
  // ============================================================
  const storeTech = await prisma.store.create({
    data: {
      ownerId: seller1.id,
      name: 'TechStore',
      slug: 'techstore',
      description: 'Tu tienda de confianza para electronica y gadgets. Ofrecemos los mejores productos tecnologicos con garantia oficial y envio rapido a toda Europa.',
      status: 'ACTIVE',
      email: 'info@techstore.com',
      phone: '+34 911 234 567',
      commissionRate: 6.00,
      socialLinks: { instagram: 'https://instagram.com/techstore', twitter: 'https://twitter.com/techstore' },
      approvedAt: new Date(),
      avgRating: 4.50,
      totalReviews: 128,
    },
  });

  const storeModaPlus = await prisma.store.create({
    data: {
      ownerId: seller2.id,
      name: 'ModaPlus',
      slug: 'modaplus',
      description: 'Moda actual para hombre y mujer. Tendencias de temporada, marcas exclusivas y prendas de calidad a precios competitivos.',
      status: 'ACTIVE',
      email: 'hola@modaplus.es',
      phone: '+34 922 345 678',
      commissionRate: 6.00,
      socialLinks: { instagram: 'https://instagram.com/modaplus', facebook: 'https://facebook.com/modaplus', tiktok: 'https://tiktok.com/@modaplus' },
      approvedAt: new Date(),
      avgRating: 4.30,
      totalReviews: 87,
    },
  });

  const storeHogar = await prisma.store.create({
    data: {
      ownerId: seller3.id,
      name: 'HogarStyle',
      slug: 'hogarstyle',
      description: 'Todo para tu hogar: muebles, decoracion, iluminacion y accesorios. Transforma tu casa en un lugar unico con nuestro estilo.',
      status: 'ACTIVE',
      email: 'contacto@hogarstyle.es',
      phone: '+34 933 456 789',
      commissionRate: 6.00,
      socialLinks: { instagram: 'https://instagram.com/hogarstyle', pinterest: 'https://pinterest.com/hogarstyle' },
      approvedAt: new Date(),
      avgRating: 4.60,
      totalReviews: 64,
    },
  });

  console.log('Created 3 stores.');

  // ============================================================
  // PRODUCTS (18) - Distributed across stores
  // ============================================================

  // --- TechStore products (electronics) ---
  const p1 = await prisma.product.create({
    data: {
      storeId: storeTech.id,
      categoryId: catMap['electronics'],
      name: 'Smartphone ProMax 15',
      slug: 'smartphone-promax-15',
      description: 'Ultimo modelo de smartphone con pantalla AMOLED de 6.7 pulgadas, camara de 108MP y bateria de 5000mAh. Procesador de ultima generacion para un rendimiento excepcional.',
      basePrice: 899.99,
      compareAtPrice: 999.99,
      status: 'ACTIVE',
      sku: 'TECH-SP-001',
      isFeatured: true,
      avgRating: 4.70,
      totalReviews: 42,
      totalSold: 156,
      publishedAt: new Date('2025-01-15'),
    },
  });

  const p2 = await prisma.product.create({
    data: {
      storeId: storeTech.id,
      categoryId: catMap['audio'],
      name: 'Auriculares Bluetooth NoisePro',
      slug: 'auriculares-bluetooth-noisepro',
      description: 'Auriculares inalambricos con cancelacion de ruido activa, 30 horas de bateria y sonido Hi-Res. Perfectos para musica, llamadas y gaming.',
      basePrice: 149.99,
      compareAtPrice: 189.99,
      status: 'ACTIVE',
      sku: 'TECH-AU-001',
      isFeatured: false,
      avgRating: 4.50,
      totalReviews: 28,
      totalSold: 312,
      publishedAt: new Date('2025-02-10'),
    },
  });

  const p3 = await prisma.product.create({
    data: {
      storeId: storeTech.id,
      categoryId: catMap['computing'],
      name: 'Portatil UltraBook X14',
      slug: 'portatil-ultrabook-x14',
      description: 'Portatil ultraligero con procesador Intel i7 de 13a generacion, 16GB RAM, 512GB SSD y pantalla IPS de 14 pulgadas. Ideal para profesionales y estudiantes.',
      basePrice: 1199.00,
      compareAtPrice: 1399.00,
      status: 'ACTIVE',
      sku: 'TECH-PC-001',
      isFeatured: true,
      avgRating: 4.80,
      totalReviews: 19,
      totalSold: 67,
      publishedAt: new Date('2025-03-01'),
    },
  });

  const p4 = await prisma.product.create({
    data: {
      storeId: storeTech.id,
      categoryId: catMap['watches'],
      name: 'Smartwatch FitTrack Pro',
      slug: 'smartwatch-fittrack-pro',
      description: 'Reloj inteligente con GPS integrado, monitor de frecuencia cardiaca, SpO2 y mas de 100 modos deportivos. Resistencia al agua 5ATM.',
      basePrice: 249.99,
      status: 'ACTIVE',
      sku: 'TECH-SW-001',
      avgRating: 4.40,
      totalReviews: 35,
      totalSold: 89,
      publishedAt: new Date('2025-01-20'),
    },
  });

  const p5 = await prisma.product.create({
    data: {
      storeId: storeTech.id,
      categoryId: catMap['tv-video'],
      name: 'Television OLED 55" CinemaView',
      slug: 'television-oled-55-cinemaview',
      description: 'Televisor OLED 4K de 55 pulgadas con Dolby Vision, Dolby Atmos y sistema operativo inteligente. Colores perfectos y negro absoluto.',
      basePrice: 1299.00,
      compareAtPrice: 1599.00,
      status: 'ACTIVE',
      sku: 'TECH-TV-001',
      isFeatured: true,
      avgRating: 4.90,
      totalReviews: 12,
      totalSold: 34,
      publishedAt: new Date('2025-02-15'),
    },
  });

  const p6 = await prisma.product.create({
    data: {
      storeId: storeTech.id,
      categoryId: catMap['photography'],
      name: 'Camara Mirrorless PhotoPro Z7',
      slug: 'camara-mirrorless-photopro-z7',
      description: 'Camara sin espejo con sensor full-frame de 45MP, grabacion 4K 120fps y estabilizacion en cuerpo de 5 ejes. El sueno de todo fotografo.',
      basePrice: 2199.00,
      status: 'DRAFT',
      sku: 'TECH-CAM-001',
      avgRating: 0,
      totalReviews: 0,
      totalSold: 0,
    },
  });

  // --- ModaPlus products (fashion) ---
  const p7 = await prisma.product.create({
    data: {
      storeId: storeModaPlus.id,
      categoryId: catMap['fashion'],
      name: 'Chaqueta Oversize Premium',
      slug: 'chaqueta-oversize-premium',
      description: 'Chaqueta oversize de corte moderno confeccionada en algodon organico. Disponible en varios colores, perfecta para entretiempo.',
      basePrice: 89.99,
      compareAtPrice: 119.99,
      status: 'ACTIVE',
      sku: 'MODA-CH-001',
      isFeatured: true,
      avgRating: 4.30,
      totalReviews: 18,
      totalSold: 145,
      publishedAt: new Date('2025-03-10'),
    },
  });

  const p8 = await prisma.product.create({
    data: {
      storeId: storeModaPlus.id,
      categoryId: catMap['fashion'],
      name: 'Zapatillas Urban Runner',
      slug: 'zapatillas-urban-runner',
      description: 'Zapatillas deportivas con diseno urbano, suela de gel para maxima comodidad y materiales reciclados. Estilo sostenible para tu dia a dia.',
      basePrice: 69.99,
      status: 'ACTIVE',
      sku: 'MODA-ZP-001',
      avgRating: 4.60,
      totalReviews: 56,
      totalSold: 423,
      publishedAt: new Date('2025-01-05'),
    },
  });

  const p9 = await prisma.product.create({
    data: {
      storeId: storeModaPlus.id,
      categoryId: catMap['fashion'],
      name: 'Vestido Midi Elegance',
      slug: 'vestido-midi-elegance',
      description: 'Vestido midi de corte fluido en tejido ligero. Perfecto para eventos especiales o un look elegante de oficina. Cierre con cremallera invisible.',
      basePrice: 59.99,
      compareAtPrice: 79.99,
      status: 'ACTIVE',
      sku: 'MODA-VE-001',
      isFeatured: false,
      avgRating: 4.20,
      totalReviews: 22,
      totalSold: 87,
      publishedAt: new Date('2025-02-20'),
    },
  });

  const p10 = await prisma.product.create({
    data: {
      storeId: storeModaPlus.id,
      categoryId: catMap['fashion'],
      name: 'Pantalon Chino Slim Fit',
      slug: 'pantalon-chino-slim-fit',
      description: 'Pantalon chino de corte slim en algodon elastico de alta calidad. Versatil y comodo, ideal para combinar con cualquier look.',
      basePrice: 44.99,
      status: 'ACTIVE',
      sku: 'MODA-PA-001',
      avgRating: 4.10,
      totalReviews: 31,
      totalSold: 198,
      publishedAt: new Date('2025-01-25'),
    },
  });

  const p11 = await prisma.product.create({
    data: {
      storeId: storeModaPlus.id,
      categoryId: catMap['fashion'],
      name: 'Bolso Bandolera Minimal',
      slug: 'bolso-bandolera-minimal',
      description: 'Bolso bandolera en piel sintetica con diseno minimalista. Compartimentos organizados y correa ajustable. Disponible en negro, camel y burdeos.',
      basePrice: 39.99,
      status: 'ACTIVE',
      sku: 'MODA-BO-001',
      avgRating: 4.40,
      totalReviews: 14,
      totalSold: 76,
      publishedAt: new Date('2025-03-05'),
    },
  });

  const p12 = await prisma.product.create({
    data: {
      storeId: storeModaPlus.id,
      categoryId: catMap['beauty'],
      name: 'Set de Cuidado Facial Naturale',
      slug: 'set-cuidado-facial-naturale',
      description: 'Set completo de cuidado facial con ingredientes naturales: serum vitamina C, crema hidratante y contorno de ojos. Sin parabenos ni sulfatos.',
      basePrice: 54.99,
      compareAtPrice: 74.99,
      status: 'DRAFT',
      sku: 'MODA-BZ-001',
      avgRating: 0,
      totalReviews: 0,
      totalSold: 0,
    },
  });

  // --- HogarStyle products (home) ---
  const p13 = await prisma.product.create({
    data: {
      storeId: storeHogar.id,
      categoryId: catMap['home-garden'],
      name: 'Lampara de Pie Nordic',
      slug: 'lampara-de-pie-nordic',
      description: 'Lampara de pie con diseno nordico en madera de haya y pantalla de lino. Luz calida y regulable para crear el ambiente perfecto en tu salon.',
      basePrice: 129.99,
      compareAtPrice: 159.99,
      status: 'ACTIVE',
      sku: 'HOGAR-LA-001',
      isFeatured: true,
      avgRating: 4.70,
      totalReviews: 16,
      totalSold: 52,
      publishedAt: new Date('2025-02-01'),
    },
  });

  const p14 = await prisma.product.create({
    data: {
      storeId: storeHogar.id,
      categoryId: catMap['home-garden'],
      name: 'Juego de Sabanas Premium 300 Hilos',
      slug: 'juego-sabanas-premium-300-hilos',
      description: 'Juego de sabanas de algodon egipcio de 300 hilos. Incluye sabana bajera, encimera y dos fundas de almohada. Suavidad y frescura garantizadas.',
      basePrice: 79.99,
      status: 'ACTIVE',
      sku: 'HOGAR-SA-001',
      avgRating: 4.80,
      totalReviews: 24,
      totalSold: 134,
      publishedAt: new Date('2025-01-10'),
    },
  });

  const p15 = await prisma.product.create({
    data: {
      storeId: storeHogar.id,
      categoryId: catMap['home-garden'],
      name: 'Set de Cuchillos Profesional Chef',
      slug: 'set-cuchillos-profesional-chef',
      description: 'Set de 6 cuchillos profesionales de acero inoxidable japones con bloque de madera de bambu. Incluye cuchillo chef, pan, santoku, deshuesador, multiusos y pelador.',
      basePrice: 149.99,
      compareAtPrice: 199.99,
      status: 'ACTIVE',
      sku: 'HOGAR-CU-001',
      isFeatured: false,
      avgRating: 4.50,
      totalReviews: 9,
      totalSold: 43,
      publishedAt: new Date('2025-03-15'),
    },
  });

  const p16 = await prisma.product.create({
    data: {
      storeId: storeHogar.id,
      categoryId: catMap['home-garden'],
      name: 'Organizador Modular Closet Pro',
      slug: 'organizador-modular-closet-pro',
      description: 'Sistema de organizacion modular para armarios. 6 piezas apilables con cajones, estantes y barras. Maximiza el espacio de tu armario.',
      basePrice: 99.99,
      status: 'ACTIVE',
      sku: 'HOGAR-OR-001',
      avgRating: 4.30,
      totalReviews: 11,
      totalSold: 67,
      publishedAt: new Date('2025-02-25'),
    },
  });

  const p17 = await prisma.product.create({
    data: {
      storeId: storeHogar.id,
      categoryId: catMap['home-garden'],
      name: 'Macetero Autoregante Vertical',
      slug: 'macetero-autoregante-vertical',
      description: 'Macetero vertical autoregante con sistema de riego por goteo integrado. Perfecto para balcones y terrazas. Capacidad para 8 plantas.',
      basePrice: 64.99,
      status: 'ACTIVE',
      sku: 'HOGAR-MA-001',
      avgRating: 4.60,
      totalReviews: 7,
      totalSold: 29,
      publishedAt: new Date('2025-03-20'),
    },
  });

  const p18 = await prisma.product.create({
    data: {
      storeId: storeHogar.id,
      categoryId: catMap['home-garden'],
      name: 'Espejo Decorativo Industrial',
      slug: 'espejo-decorativo-industrial',
      description: 'Espejo redondo de estilo industrial con marco de metal negro envejecido. Diametro 80cm. Aporta amplitud y caracter a cualquier estancia.',
      basePrice: 89.99,
      status: 'ACTIVE',
      sku: 'HOGAR-ES-001',
      avgRating: 4.40,
      totalReviews: 5,
      totalSold: 21,
      publishedAt: new Date('2025-01-30'),
    },
  });

  const allProducts = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18];
  console.log(`Created ${allProducts.length} products.`);

  // ============================================================
  // PRODUCT VARIANTS (1 per product)
  // ============================================================
  const variantData = [
    { productId: p1.id, name: 'Negro 128GB', sku: 'TECH-SP-001-BK128', price: 899.99, stockQuantity: 50, options: { color: 'Negro', almacenamiento: '128GB' } },
    { productId: p2.id, name: 'Negro', sku: 'TECH-AU-001-BK', price: 149.99, stockQuantity: 120, options: { color: 'Negro' } },
    { productId: p3.id, name: 'Plata 16GB/512GB', sku: 'TECH-PC-001-SLV', price: 1199.00, stockQuantity: 25, options: { color: 'Plata', ram: '16GB', ssd: '512GB' } },
    { productId: p4.id, name: 'Negro 44mm', sku: 'TECH-SW-001-BK44', price: 249.99, stockQuantity: 75, options: { color: 'Negro', tamano: '44mm' } },
    { productId: p5.id, name: '55 pulgadas', sku: 'TECH-TV-001-55', price: 1299.00, stockQuantity: 15, options: { tamano: '55"' } },
    { productId: p6.id, name: 'Solo cuerpo', sku: 'TECH-CAM-001-BODY', price: 2199.00, stockQuantity: 10, options: { tipo: 'Solo cuerpo' } },
    { productId: p7.id, name: 'Negro M', sku: 'MODA-CH-001-BKM', price: 89.99, stockQuantity: 40, options: { color: 'Negro', talla: 'M' } },
    { productId: p8.id, name: 'Blanco 42', sku: 'MODA-ZP-001-WH42', price: 69.99, stockQuantity: 60, options: { color: 'Blanco', talla: '42' } },
    { productId: p9.id, name: 'Azul S', sku: 'MODA-VE-001-AZS', price: 59.99, stockQuantity: 30, options: { color: 'Azul', talla: 'S' } },
    { productId: p10.id, name: 'Beige 40', sku: 'MODA-PA-001-BG40', price: 44.99, stockQuantity: 55, options: { color: 'Beige', talla: '40' } },
    { productId: p11.id, name: 'Negro', sku: 'MODA-BO-001-BK', price: 39.99, stockQuantity: 45, options: { color: 'Negro' } },
    { productId: p12.id, name: 'Set completo', sku: 'MODA-BZ-001-SET', price: 54.99, stockQuantity: 20, options: { tipo: 'Set completo' } },
    { productId: p13.id, name: 'Natural', sku: 'HOGAR-LA-001-NAT', price: 129.99, stockQuantity: 18, options: { color: 'Natural' } },
    { productId: p14.id, name: 'Blanco 150x200', sku: 'HOGAR-SA-001-WH150', price: 79.99, stockQuantity: 35, options: { color: 'Blanco', tamano: '150x200cm' } },
    { productId: p15.id, name: 'Set 6 piezas', sku: 'HOGAR-CU-001-6PZ', price: 149.99, stockQuantity: 22, options: { tipo: 'Set 6 piezas' } },
    { productId: p16.id, name: 'Blanco', sku: 'HOGAR-OR-001-WH', price: 99.99, stockQuantity: 28, options: { color: 'Blanco' } },
    { productId: p17.id, name: 'Verde 8 plantas', sku: 'HOGAR-MA-001-GR8', price: 64.99, stockQuantity: 40, options: { color: 'Verde', capacidad: '8 plantas' } },
    { productId: p18.id, name: '80cm Negro', sku: 'HOGAR-ES-001-BK80', price: 89.99, stockQuantity: 14, options: { color: 'Negro', diametro: '80cm' } },
  ];

  const variants: Record<string, any> = {};
  for (const v of variantData) {
    const created = await prisma.productVariant.create({ data: v });
    variants[v.productId] = created;
  }

  console.log(`Created ${variantData.length} product variants.`);

  // ============================================================
  // PRODUCT IMAGES (1 per product)
  // ============================================================
  const imageData = [
    { productId: p1.id, url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', altText: 'Smartphone ProMax 15', isPrimary: true },
    { productId: p2.id, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', altText: 'Auriculares Bluetooth NoisePro', isPrimary: true },
    { productId: p3.id, url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', altText: 'Portatil UltraBook X14', isPrimary: true },
    { productId: p4.id, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', altText: 'Smartwatch FitTrack Pro', isPrimary: true },
    { productId: p5.id, url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', altText: 'Television OLED 55" CinemaView', isPrimary: true },
    { productId: p6.id, url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', altText: 'Camara Mirrorless PhotoPro Z7', isPrimary: true },
    { productId: p7.id, url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', altText: 'Chaqueta Oversize Premium', isPrimary: true },
    { productId: p8.id, url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', altText: 'Zapatillas Urban Runner', isPrimary: true },
    { productId: p9.id, url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', altText: 'Vestido Midi Elegance', isPrimary: true },
    { productId: p10.id, url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', altText: 'Pantalon Chino Slim Fit', isPrimary: true },
    { productId: p11.id, url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', altText: 'Bolso Bandolera Minimal', isPrimary: true },
    { productId: p12.id, url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', altText: 'Set de Cuidado Facial Naturale', isPrimary: true },
    { productId: p13.id, url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600', altText: 'Lampara de Pie Nordic', isPrimary: true },
    { productId: p14.id, url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', altText: 'Juego de Sabanas Premium', isPrimary: true },
    { productId: p15.id, url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600', altText: 'Set de Cuchillos Profesional', isPrimary: true },
    { productId: p16.id, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', altText: 'Organizador Modular Closet Pro', isPrimary: true },
    { productId: p17.id, url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', altText: 'Macetero Autoregante Vertical', isPrimary: true },
    { productId: p18.id, url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600', altText: 'Espejo Decorativo Industrial', isPrimary: true },
  ];

  for (const img of imageData) {
    await prisma.productImage.create({ data: img });
  }

  console.log(`Created ${imageData.length} product images.`);

  // ============================================================
  // ORDERS (5) - All from customer
  // ============================================================
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'NXM-2025-0001',
      customerId: customer.id,
      shippingAddressId: customerAddress.id,
      status: 'DELIVERED',
      subtotal: 899.99,
      shippingTotal: 0,
      taxTotal: 188.99,
      discountTotal: 0,
      grandTotal: 1088.98,
      currency: 'EUR',
      placedAt: new Date('2025-01-20'),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'NXM-2025-0002',
      customerId: customer.id,
      shippingAddressId: customerAddress.id,
      status: 'SHIPPED',
      subtotal: 159.98,
      shippingTotal: 4.99,
      taxTotal: 33.59,
      discountTotal: 0,
      grandTotal: 198.56,
      currency: 'EUR',
      placedAt: new Date('2025-02-15'),
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'NXM-2025-0003',
      customerId: customer.id,
      shippingAddressId: customerAddress.id,
      status: 'CONFIRMED',
      subtotal: 249.99,
      shippingTotal: 0,
      taxTotal: 52.49,
      discountTotal: 0,
      grandTotal: 302.48,
      currency: 'EUR',
      placedAt: new Date('2025-03-10'),
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'NXM-2025-0004',
      customerId: customer.id,
      shippingAddressId: customerAddress.id,
      status: 'PENDING',
      subtotal: 219.98,
      shippingTotal: 3.99,
      taxTotal: 46.19,
      discountTotal: 0,
      grandTotal: 270.16,
      currency: 'EUR',
      placedAt: new Date('2025-03-25'),
    },
  });

  const order5 = await prisma.order.create({
    data: {
      orderNumber: 'NXM-2025-0005',
      customerId: customer.id,
      shippingAddressId: customerAddress.id,
      status: 'DELIVERED',
      subtotal: 149.99,
      shippingTotal: 0,
      taxTotal: 31.49,
      discountTotal: 0,
      grandTotal: 181.48,
      currency: 'EUR',
      placedAt: new Date('2025-01-30'),
    },
  });

  console.log('Created 5 orders.');

  // ============================================================
  // SUBORDERS
  // ============================================================
  const sub1 = await prisma.subOrder.create({
    data: {
      orderId: order1.id,
      storeId: storeTech.id,
      subOrderNumber: 'NXM-2025-0001-TECH',
      status: 'DELIVERED',
      subtotal: 899.99,
      shippingCost: 0,
      platformCommission: 54.00,
      sellerPayout: 845.99,
      deliveredAt: new Date('2025-01-25'),
    },
  });

  const sub2a = await prisma.subOrder.create({
    data: {
      orderId: order2.id,
      storeId: storeModaPlus.id,
      subOrderNumber: 'NXM-2025-0002-MODA',
      status: 'SHIPPED',
      subtotal: 159.98,
      shippingCost: 4.99,
      platformCommission: 9.60,
      sellerPayout: 155.37,
      shippedAt: new Date('2025-02-17'),
    },
  });

  const sub3 = await prisma.subOrder.create({
    data: {
      orderId: order3.id,
      storeId: storeTech.id,
      subOrderNumber: 'NXM-2025-0003-TECH',
      status: 'ACCEPTED',
      subtotal: 249.99,
      shippingCost: 0,
      platformCommission: 15.00,
      sellerPayout: 234.99,
      acceptedAt: new Date('2025-03-11'),
    },
  });

  const sub4a = await prisma.subOrder.create({
    data: {
      orderId: order4.id,
      storeId: storeModaPlus.id,
      subOrderNumber: 'NXM-2025-0004-MODA',
      status: 'PENDING',
      subtotal: 89.99,
      shippingCost: 3.99,
      platformCommission: 5.40,
      sellerPayout: 88.58,
    },
  });

  const sub4b = await prisma.subOrder.create({
    data: {
      orderId: order4.id,
      storeId: storeHogar.id,
      subOrderNumber: 'NXM-2025-0004-HOGAR',
      status: 'PENDING',
      subtotal: 129.99,
      shippingCost: 0,
      platformCommission: 7.80,
      sellerPayout: 122.19,
    },
  });

  const sub5 = await prisma.subOrder.create({
    data: {
      orderId: order5.id,
      storeId: storeTech.id,
      subOrderNumber: 'NXM-2025-0005-TECH',
      status: 'DELIVERED',
      subtotal: 149.99,
      shippingCost: 0,
      platformCommission: 9.00,
      sellerPayout: 140.99,
      deliveredAt: new Date('2025-02-03'),
    },
  });

  console.log('Created 6 sub-orders.');

  // ============================================================
  // ORDER ITEMS
  // ============================================================
  const oi1 = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      subOrderId: sub1.id,
      variantId: variants[p1.id].id,
      productId: p1.id,
      productName: p1.name,
      variantName: 'Negro 128GB',
      sku: 'TECH-SP-001-BK128',
      quantity: 1,
      unitPrice: 899.99,
      totalPrice: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    },
  });

  const oi2a = await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      subOrderId: sub2a.id,
      variantId: variants[p7.id].id,
      productId: p7.id,
      productName: p7.name,
      variantName: 'Negro M',
      sku: 'MODA-CH-001-BKM',
      quantity: 1,
      unitPrice: 89.99,
      totalPrice: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    },
  });

  const oi2b = await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      subOrderId: sub2a.id,
      variantId: variants[p8.id].id,
      productId: p8.id,
      productName: p8.name,
      variantName: 'Blanco 42',
      sku: 'MODA-ZP-001-WH42',
      quantity: 1,
      unitPrice: 69.99,
      totalPrice: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    },
  });

  const oi3 = await prisma.orderItem.create({
    data: {
      orderId: order3.id,
      subOrderId: sub3.id,
      variantId: variants[p4.id].id,
      productId: p4.id,
      productName: p4.name,
      variantName: 'Negro 44mm',
      sku: 'TECH-SW-001-BK44',
      quantity: 1,
      unitPrice: 249.99,
      totalPrice: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    },
  });

  const oi4a = await prisma.orderItem.create({
    data: {
      orderId: order4.id,
      subOrderId: sub4a.id,
      variantId: variants[p7.id].id,
      productId: p7.id,
      productName: p7.name,
      variantName: 'Negro M',
      sku: 'MODA-CH-001-BKM',
      quantity: 1,
      unitPrice: 89.99,
      totalPrice: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    },
  });

  const oi4b = await prisma.orderItem.create({
    data: {
      orderId: order4.id,
      subOrderId: sub4b.id,
      variantId: variants[p13.id].id,
      productId: p13.id,
      productName: p13.name,
      variantName: 'Natural',
      sku: 'HOGAR-LA-001-NAT',
      quantity: 1,
      unitPrice: 129.99,
      totalPrice: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600',
    },
  });

  const oi5 = await prisma.orderItem.create({
    data: {
      orderId: order5.id,
      subOrderId: sub5.id,
      variantId: variants[p2.id].id,
      productId: p2.id,
      productName: p2.name,
      variantName: 'Negro',
      sku: 'TECH-AU-001-BK',
      quantity: 1,
      unitPrice: 149.99,
      totalPrice: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    },
  });

  console.log('Created 7 order items.');

  // ============================================================
  // REVIEWS (8)
  // ============================================================
  await prisma.review.create({
    data: {
      productId: p1.id,
      customerId: customer.id,
      orderItemId: oi1.id,
      rating: 5,
      title: 'Increible smartphone',
      body: 'La pantalla es espectacular y la camara toma fotos impresionantes. La bateria dura todo el dia sin problemas. Totalmente recomendado.',
      isVerifiedPurchase: true,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      productId: p2.id,
      customerId: customer.id,
      orderItemId: oi5.id,
      rating: 4,
      title: 'Muy buenos auriculares',
      body: 'La cancelacion de ruido funciona muy bien y el sonido es excelente. Solo le falta un poco mas de comodidad para sesiones muy largas.',
      isVerifiedPurchase: true,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      productId: p7.id,
      customerId: customer.id,
      orderItemId: oi2a.id,
      rating: 4,
      title: 'Buena calidad',
      body: 'La chaqueta tiene un corte muy bonito y el material se siente premium. El color es fiel a las fotos. Talla un poco grande.',
      isVerifiedPurchase: true,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      productId: p8.id,
      customerId: customer.id,
      orderItemId: oi2b.id,
      rating: 5,
      title: 'Las mejores zapatillas',
      body: 'Comodisimas desde el primer dia. El diseno es muy bonito y el material reciclado es un gran plus. Ya quiero comprar otro par.',
      isVerifiedPurchase: true,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      productId: p13.id,
      customerId: customer.id,
      rating: 5,
      title: 'Preciosa lampara',
      body: 'Queda fantastica en el salon. La luz calida crea un ambiente muy acogedor. La calidad de la madera y el lino es excelente.',
      isVerifiedPurchase: false,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      productId: p14.id,
      customerId: customer.id,
      rating: 4,
      title: 'Muy suaves',
      body: 'Las sabanas son increiblemente suaves y frescas. Despues de varios lavados siguen como nuevas. Relacion calidad-precio excelente.',
      isVerifiedPurchase: false,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      productId: p3.id,
      customerId: customer.id,
      rating: 3,
      title: 'Buen portatil pero...',
      body: 'El rendimiento es bueno y la pantalla es bonita, pero el ventilador hace algo de ruido bajo carga pesada. El teclado es comodo.',
      isVerifiedPurchase: false,
      status: 'PENDING',
    },
  });

  await prisma.review.create({
    data: {
      productId: p9.id,
      customerId: customer.id,
      rating: 4,
      title: 'Elegante y comodo',
      body: 'El vestido tiene una caida preciosa y el tejido es muy agradable. Perfecto para eventos de trabajo. La cremallera es de buena calidad.',
      isVerifiedPurchase: false,
      status: 'PENDING',
    },
  });

  console.log('Created 8 reviews.');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
