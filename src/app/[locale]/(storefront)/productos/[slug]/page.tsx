'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight, Star, Heart, Truck, Shield, RotateCcw, ShoppingCart, Check, Share2, Minus, Plus, Store, ThumbsUp, Package, Info, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

// ─── Types ───────────────────────────────────────────────────
interface VariantOption {
  color?: string;
  talla?: string;
  almacenamiento?: string;
  [key: string]: string | undefined;
}

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  options: VariantOption;
  images?: string[];
}

interface ProductData {
  id: string;
  store: { name: string; rating: number; sales: string; slug: string };
  name: string;
  basePrice: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: { label: string; value: string }[];
  variants: Variant[];
  variantOptions: { name: string; key: string; values: string[] }[];
  reviews: { id: number; author: string; rating: number; date: string; title: string; comment: string; helpful: number; verified: boolean }[];
  category: { name: string; slug: string };
  subcategory?: { name: string; slug: string };
  sellingUnit?: string;
  minQuantity?: number;
  quantityStep?: number;
  unitLabel?: string;
}

// ─── Demo Data ───────────────────────────────────────────────
// Producto 1: Electrónica (variantes por color + almacenamiento)
const DEMO_PRODUCT_TECH: ProductData = {
  id: 'prod-001',
  store: { name: 'TechPro Store', rating: 4.8, sales: '2.4K', slug: 'techpro-store' },
  name: 'MacBook Pro 14" M3 Max',
  basePrice: 1199.99,
  compareAtPrice: 1399.99,
  rating: 4.8,
  reviewCount: 234,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
  ],
  shortDescription: 'Powerhouse laptop con chip M3 Max, pantalla Liquid Retina XDR impresionante, y batería que dura todo el día.',
  longDescription: `El MacBook Pro 14" con chip M3 Max redefine lo que es posible en un portátil profesional. Diseñado para los flujos de trabajo más exigentes, desde edición de vídeo 8K hasta desarrollo de software a gran escala, este equipo ofrece un rendimiento sin precedentes en un formato sorprendentemente portátil.

La pantalla Liquid Retina XDR de 14,2 pulgadas ofrece un brillo extremo de hasta 1.600 nits en contenido HDR, con tecnología ProMotion adaptativa que ajusta la frecuencia de actualización hasta 120 Hz para una experiencia visual increíblemente fluida. Cada imagen cobra vida con colores precisos de gama amplia P3 y contraste de 1.000.000:1.

El chip M3 Max incorpora una CPU de hasta 16 núcleos y una GPU de hasta 40 núcleos, capaz de manejar múltiples flujos de vídeo ProRes 4K simultáneamente. Con soporte para hasta 128 GB de memoria unificada, puedes trabajar con proyectos masivos sin ralentización.

La batería de larga duración te acompaña durante todo el día con hasta 18 horas de reproducción de vídeo. Además, el cargador MagSafe permite una carga rápida que lleva la batería al 50% en solo 30 minutos.

Conectividad completa con tres puertos Thunderbolt 4, ranura SDXC, HDMI 2.1 y conector para auriculares de alta impedancia. Compatible con hasta tres pantallas externas para configuraciones de trabajo expandidas.`,
  features: [
    'Apple M3 Max chip con CPU de 12 núcleos y GPU de 30 núcleos',
    '16GB de memoria unificada (ampliable a 128GB)',
    'Pantalla Liquid Retina XDR de 14.2" con ProMotion 120Hz',
    'Hasta 18 horas de batería con carga rápida MagSafe',
    'Cámara FaceTime HD 1080p con procesamiento avanzado',
    'Sistema de 6 altavoces con audio espacial Dolby Atmos',
    '3x Thunderbolt 4, HDMI 2.1, SDXC, MagSafe 3',
    'Wi-Fi 6E y Bluetooth 5.3',
  ],
  specifications: [
    { label: 'Procesador', value: 'Apple M3 Max (12 núcleos CPU, 30 núcleos GPU)' },
    { label: 'Memoria RAM', value: '16 GB unificada' },
    { label: 'Pantalla', value: '14.2" Liquid Retina XDR, 3024×1964, 120Hz' },
    { label: 'Brillo', value: '1.000 nits SDR / 1.600 nits HDR' },
    { label: 'Sistema Operativo', value: 'macOS Sonoma' },
    { label: 'Puertos', value: '3x Thunderbolt 4, HDMI 2.1, SDXC, MagSafe 3, jack 3.5mm' },
    { label: 'Conectividad', value: 'Wi-Fi 6E (802.11ax), Bluetooth 5.3' },
    { label: 'Batería', value: '70 Wh, hasta 18h reproducción de vídeo' },
    { label: 'Peso', value: '1,60 kg' },
    { label: 'Dimensiones', value: '31,26 × 22,12 × 1,55 cm' },
    { label: 'Color', value: 'Space Gray / Silver' },
    { label: 'Garantía', value: '2 años del fabricante' },
  ],
  variantOptions: [
    { name: 'Color', key: 'color', values: ['Space Gray', 'Silver'] },
    { name: 'Almacenamiento', key: 'almacenamiento', values: ['512GB', '1TB', '2TB'] },
  ],
  variants: [
    { id: 'v1', name: 'Space Gray / 512GB', sku: 'MBP14-SG-512', price: 1199.99, compareAtPrice: 1399.99, stockQuantity: 15, options: { color: 'Space Gray', almacenamiento: '512GB' } },
    { id: 'v2', name: 'Space Gray / 1TB', sku: 'MBP14-SG-1TB', price: 1399.99, compareAtPrice: 1599.99, stockQuantity: 8, options: { color: 'Space Gray', almacenamiento: '1TB' } },
    { id: 'v3', name: 'Space Gray / 2TB', sku: 'MBP14-SG-2TB', price: 1699.99, compareAtPrice: 1899.99, stockQuantity: 3, options: { color: 'Space Gray', almacenamiento: '2TB' } },
    { id: 'v4', name: 'Silver / 512GB', sku: 'MBP14-SV-512', price: 1199.99, compareAtPrice: 1399.99, stockQuantity: 12, options: { color: 'Silver', almacenamiento: '512GB' } },
    { id: 'v5', name: 'Silver / 1TB', sku: 'MBP14-SV-1TB', price: 1399.99, compareAtPrice: 1599.99, stockQuantity: 5, options: { color: 'Silver', almacenamiento: '1TB' } },
    { id: 'v6', name: 'Silver / 2TB', sku: 'MBP14-SV-2TB', price: 1699.99, compareAtPrice: 1899.99, stockQuantity: 0, options: { color: 'Silver', almacenamiento: '2TB' } },
  ],
  category: { name: 'Electrónica', slug: 'electronica' },
  subcategory: { name: 'Portátiles', slug: 'portatiles' },
  reviews: [
    { id: 1, author: 'Juan G.', rating: 5, date: '2024-03-10', title: 'Excelente rendimiento profesional', comment: 'Lo uso para edición de vídeo 4K y renderizado 3D. La diferencia con mi anterior portátil es abismal. La pantalla XDR es simplemente perfecta para color grading. El único detalle es que 16GB se queda algo justo para After Effects con proyectos grandes, recomiendo 32GB.', helpful: 23, verified: true },
    { id: 2, author: 'María L.', rating: 4, date: '2024-03-08', title: 'Muy buen precio para lo que ofrece', comment: 'Funcionó perfecto desde el primer día. Empaque impecable y llegó antes de lo esperado. La batería realmente dura todo el día con uso normal. Le quito una estrella porque el adaptador de corriente no viene incluido.', helpful: 15, verified: true },
    { id: 3, author: 'Carlos R.', rating: 5, date: '2024-03-05', title: 'Totalmente recomendado para desarrolladores', comment: 'Como desarrollador full-stack, este MacBook es una bestia. Compila proyectos enormes en segundos, Docker corre sin problemas y puedo tener 30+ pestañas de Chrome + VS Code + terminal sin pestañear. El trackpad y el teclado son los mejores del mercado.', helpful: 31, verified: true },
    { id: 4, author: 'Ana P.', rating: 5, date: '2024-03-01', title: 'Upgrade que vale cada euro', comment: 'Venía de un MacBook Air M1 y el salto es brutal. La pantalla ProMotion hace que todo se sienta más fluido. Los altavoces son increíbles para un portátil. La tienda TechPro me resolvió una duda sobre la garantía en menos de una hora.', helpful: 18, verified: true },
    { id: 5, author: 'Roberto M.', rating: 3, date: '2024-02-25', title: 'Buen producto pero precio elevado', comment: 'El portátil es excelente pero creo que por este precio debería incluir al menos 32GB de RAM de serie. El rendimiento es top pero la relación calidad-precio podría ser mejor si lo comparas con alternativas Windows.', helpful: 42, verified: false },
  ],
};

// Producto demo: Ropa (variantes por talla + color)
const DEMO_PRODUCT_FASHION: ProductData = {
  id: 'prod-002',
  store: { name: 'Urban Style', rating: 4.6, sales: '5.1K', slug: 'urban-style' },
  name: 'Camiseta Premium Algodón Orgánico',
  basePrice: 29.99,
  compareAtPrice: 39.99,
  rating: 4.6,
  reviewCount: 892,
  image: '👕',
  gallery: ['👕', '👕', '👕', '👕'],
  shortDescription: 'Camiseta de algodón orgánico 100% certificado GOTS, corte regular, tacto ultra suave.',
  longDescription: `Nuestra Camiseta Premium de Algodón Orgánico está confeccionada con los más altos estándares de calidad y sostenibilidad. Fabricada con algodón 100% orgánico certificado GOTS (Global Organic Textile Standard), esta prenda garantiza que ningún pesticida o químico nocivo ha sido utilizado en su producción.

El tejido de punto de 180 g/m² ofrece el equilibrio perfecto entre confort y durabilidad. Su tacto ultra suave mejora con cada lavado, volviéndose más cómoda con el tiempo sin perder forma ni color. La técnica de teñido reactivo asegura colores vibrantes y resistentes que no se desvanecen.

El corte Regular Fit ha sido diseñado para adaptarse a todo tipo de cuerpos, ofreciendo libertad de movimiento sin quedar demasiado holgada ni ceñida. Las costuras reforzadas en cuello, hombros y puños garantizan una durabilidad excepcional.

Detalles de diseño pensados: cuello redondo con cinta interior de refuerzo para evitar deformaciones, dobladillo inferior con corte ligeramente curvado que queda perfecto tanto por dentro como por fuera del pantalón, y etiqueta impresa en vez de cosida para mayor comodidad.

Producción ética y sostenible: fabricada en talleres certificados Fair Trade en Portugal, con condiciones laborales justas y salarios dignos. Cada camiseta viene con un código QR que te permite rastrear todo su proceso de fabricación desde la cosecha del algodón hasta el empaquetado final.`,
  features: [
    'Algodón 100% orgánico certificado GOTS',
    'Gramaje 180 g/m² – equilibrio entre suavidad y resistencia',
    'Teñido reactivo – colores que no se desvanecen',
    'Corte Regular Fit para todos los cuerpos',
    'Costuras reforzadas en cuello, hombros y puños',
    'Etiqueta impresa (no cosida) para máximo confort',
    'Producción Fair Trade en Portugal',
    'Código QR de trazabilidad incluido',
  ],
  specifications: [
    { label: 'Material', value: '100% algodón orgánico certificado GOTS' },
    { label: 'Gramaje', value: '180 g/m²' },
    { label: 'Corte', value: 'Regular Fit' },
    { label: 'Cuello', value: 'Redondo con cinta de refuerzo' },
    { label: 'Tallas disponibles', value: 'XS, S, M, L, XL, XXL' },
    { label: 'Colores disponibles', value: 'Negro, Blanco, Azul Marino, Gris Melange, Burdeos, Verde Oliva' },
    { label: 'Fabricación', value: 'Portugal (Fair Trade certificado)' },
    { label: 'Certificaciones', value: 'GOTS, OEKO-TEX Standard 100, Fair Trade' },
    { label: 'Cuidado', value: 'Lavar a máquina 30°C, no usar secadora, planchar a temperatura media' },
    { label: 'Peso (unidad)', value: '~200 g (talla M)' },
  ],
  variantOptions: [
    { name: 'Color', key: 'color', values: ['Negro', 'Blanco', 'Azul Marino', 'Gris Melange', 'Burdeos', 'Verde Oliva'] },
    { name: 'Talla', key: 'talla', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  ],
  variants: [
    // Negro
    { id: 'fv1', name: 'Negro / XS', sku: 'CAM-NEG-XS', price: 29.99, compareAtPrice: 39.99, stockQuantity: 20, options: { color: 'Negro', talla: 'XS' } },
    { id: 'fv2', name: 'Negro / S', sku: 'CAM-NEG-S', price: 29.99, compareAtPrice: 39.99, stockQuantity: 35, options: { color: 'Negro', talla: 'S' } },
    { id: 'fv3', name: 'Negro / M', sku: 'CAM-NEG-M', price: 29.99, compareAtPrice: 39.99, stockQuantity: 40, options: { color: 'Negro', talla: 'M' } },
    { id: 'fv4', name: 'Negro / L', sku: 'CAM-NEG-L', price: 29.99, compareAtPrice: 39.99, stockQuantity: 30, options: { color: 'Negro', talla: 'L' } },
    { id: 'fv5', name: 'Negro / XL', sku: 'CAM-NEG-XL', price: 31.99, compareAtPrice: 39.99, stockQuantity: 25, options: { color: 'Negro', talla: 'XL' } },
    { id: 'fv6', name: 'Negro / XXL', sku: 'CAM-NEG-XXL', price: 33.99, compareAtPrice: 42.99, stockQuantity: 15, options: { color: 'Negro', talla: 'XXL' } },
    // Blanco
    { id: 'fv7', name: 'Blanco / XS', sku: 'CAM-BLA-XS', price: 29.99, compareAtPrice: 39.99, stockQuantity: 18, options: { color: 'Blanco', talla: 'XS' } },
    { id: 'fv8', name: 'Blanco / S', sku: 'CAM-BLA-S', price: 29.99, compareAtPrice: 39.99, stockQuantity: 30, options: { color: 'Blanco', talla: 'S' } },
    { id: 'fv9', name: 'Blanco / M', sku: 'CAM-BLA-M', price: 29.99, compareAtPrice: 39.99, stockQuantity: 45, options: { color: 'Blanco', talla: 'M' } },
    { id: 'fv10', name: 'Blanco / L', sku: 'CAM-BLA-L', price: 29.99, compareAtPrice: 39.99, stockQuantity: 35, options: { color: 'Blanco', talla: 'L' } },
    { id: 'fv11', name: 'Blanco / XL', sku: 'CAM-BLA-XL', price: 31.99, compareAtPrice: 39.99, stockQuantity: 20, options: { color: 'Blanco', talla: 'XL' } },
    { id: 'fv12', name: 'Blanco / XXL', sku: 'CAM-BLA-XXL', price: 33.99, compareAtPrice: 42.99, stockQuantity: 0, options: { color: 'Blanco', talla: 'XXL' } },
    // Azul Marino
    { id: 'fv13', name: 'Azul Marino / M', sku: 'CAM-AZM-M', price: 29.99, compareAtPrice: 39.99, stockQuantity: 25, options: { color: 'Azul Marino', talla: 'M' } },
    { id: 'fv14', name: 'Azul Marino / L', sku: 'CAM-AZM-L', price: 29.99, compareAtPrice: 39.99, stockQuantity: 20, options: { color: 'Azul Marino', talla: 'L' } },
    { id: 'fv15', name: 'Azul Marino / XL', sku: 'CAM-AZM-XL', price: 31.99, compareAtPrice: 39.99, stockQuantity: 10, options: { color: 'Azul Marino', talla: 'XL' } },
    // Gris Melange
    { id: 'fv16', name: 'Gris Melange / S', sku: 'CAM-GRI-S', price: 29.99, compareAtPrice: 39.99, stockQuantity: 22, options: { color: 'Gris Melange', talla: 'S' } },
    { id: 'fv17', name: 'Gris Melange / M', sku: 'CAM-GRI-M', price: 29.99, compareAtPrice: 39.99, stockQuantity: 30, options: { color: 'Gris Melange', talla: 'M' } },
    { id: 'fv18', name: 'Gris Melange / L', sku: 'CAM-GRI-L', price: 29.99, compareAtPrice: 39.99, stockQuantity: 28, options: { color: 'Gris Melange', talla: 'L' } },
    // Burdeos
    { id: 'fv19', name: 'Burdeos / M', sku: 'CAM-BUR-M', price: 32.99, compareAtPrice: 42.99, stockQuantity: 15, options: { color: 'Burdeos', talla: 'M' } },
    { id: 'fv20', name: 'Burdeos / L', sku: 'CAM-BUR-L', price: 32.99, compareAtPrice: 42.99, stockQuantity: 12, options: { color: 'Burdeos', talla: 'L' } },
    // Verde Oliva
    { id: 'fv21', name: 'Verde Oliva / M', sku: 'CAM-VOL-M', price: 32.99, compareAtPrice: 42.99, stockQuantity: 10, options: { color: 'Verde Oliva', talla: 'M' } },
    { id: 'fv22', name: 'Verde Oliva / L', sku: 'CAM-VOL-L', price: 32.99, compareAtPrice: 42.99, stockQuantity: 8, options: { color: 'Verde Oliva', talla: 'L' } },
  ],
  category: { name: 'Moda', slug: 'moda' },
  subcategory: { name: 'Camisetas', slug: 'camisetas' },
  reviews: [
    { id: 1, author: 'Laura S.', rating: 5, date: '2024-03-12', title: 'La mejor camiseta que he comprado', comment: 'El algodón es increíblemente suave y después de 10 lavados sigue como nueva. Pedí M y me queda perfecta (mido 1.70, peso 68kg). Los colores son tal cual se ven en la foto.', helpful: 56, verified: true },
    { id: 2, author: 'Diego M.', rating: 4, date: '2024-03-09', title: 'Muy buena calidad, talla un poco grande', comment: 'La calidad del tejido es excelente y se nota que es algodón de verdad. Mi único consejo: si dudas entre dos tallas, pide la más pequeña. El corte regular tira a holgado.', helpful: 34, verified: true },
    { id: 3, author: 'Patricia V.', rating: 5, date: '2024-03-03', title: 'Sostenible y se nota', comment: 'Me encanta poder escanear el QR y ver todo el recorrido de la camiseta. Se nota el compromiso con la sostenibilidad. Repetiré en más colores.', helpful: 28, verified: true },
  ],
};

// Producto 3: Textil vendido por metro (tela)
const DEMO_PRODUCT_FABRIC: ProductData = {
  id: 'prod-003',
  store: { name: 'Telas Martínez', rating: 4.7, sales: '1.8K', slug: 'telas-martinez' },
  name: 'Tela Algodón Orgánico Premium',
  basePrice: 12.99,
  compareAtPrice: 15.99,
  rating: 4.7,
  reviewCount: 156,
  image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
  ],
  shortDescription: 'Tela de algodón orgánico 100% certificada GOTS, tejido suave de 220 g/m², perfecta para proyectos de costura y confección.',
  longDescription: `Nuestra Tela de Algodón Orgánico Premium es el material ideal para proyectos de confección profesional y hogar. Fabricada con algodón 100% orgánico certificado GOTS, esta tela garantiza la máxima pureza sin pesticidas ni químicos nocivos.

Con un gramaje de 220 g/m², ofrece el equilibrio perfecto entre peso, caída y durabilidad. El tejido ha sido teñido con colorantes reactivos, garantizando colores vibrantes y duraderos que se mantienen inalterable tras múltiples lavados.

Disponible en anchos estándar de 1.40m, 1.60m y 2.80m para adaptarse a tus necesidades. Se vende por metro, permitiéndote comprar exactamente lo que necesitas.

Perfecta para:
- Confección de ropa casual y formal
- Proyectos de decoración (cortinas, cojines, mantelería)
- Patchwork y proyectos artesanales
- Ropa de cama de calidad
- Bolsos y accesorios

Certificada Fair Trade, producida en talleres con condiciones laborales justas. Cada compra incluye una guía de cuidados en español.`,
  features: [
    'Algodón 100% orgánico certificado GOTS',
    'Gramaje 220 g/m² – ideal para prendas estructuradas',
    'Teñido reactivo – colores que no se desvanecen',
    'Ancho disponible: 1.40m, 1.60m, 2.80m',
    'Venta por metros – compra el metraje exacto',
    'Fácil de cortar y coser',
    'Producción Fair Trade certificada',
    'Certificaciones GOTS y OEKO-TEX Standard 100',
  ],
  specifications: [
    { label: 'Material', value: '100% algodón orgánico certificado GOTS' },
    { label: 'Gramaje', value: '220 g/m²' },
    { label: 'Anchos disponibles', value: '1.40m, 1.60m, 2.80m' },
    { label: 'Colores disponibles', value: 'Blanco Natural, Azul Índigo, Terracota, Verde Bosque, Gris Perla, Negro' },
    { label: 'Método de venta', value: 'Por metro (mínimo 0.5m)' },
    { label: 'Lavado', value: '40°C máximo, sin cloro, secar al aire' },
    { label: 'Certificaciones', value: 'GOTS, OEKO-TEX Standard 100, Fair Trade' },
    { label: 'Producción', value: 'Portugal (Fair Trade certificado)' },
  ],
  sellingUnit: 'metro',
  minQuantity: 0.5,
  quantityStep: 0.1,
  unitLabel: 'metro',
  variantOptions: [
    { name: 'Color', key: 'color', values: ['Blanco Natural', 'Azul Índigo', 'Terracota', 'Verde Bosque', 'Gris Perla', 'Negro'] },
    { name: 'Ancho', key: 'ancho', values: ['1.40m', '1.60m', '2.80m'] },
  ],
  variants: [
    // Blanco Natural
    { id: 'fb1', name: 'Blanco Natural / 1.40m', sku: 'TEL-BLA-140', price: 12.99, compareAtPrice: 15.99, stockQuantity: 50, options: { color: 'Blanco Natural', ancho: '1.40m' } },
    { id: 'fb2', name: 'Blanco Natural / 1.60m', sku: 'TEL-BLA-160', price: 14.99, compareAtPrice: 17.99, stockQuantity: 45, options: { color: 'Blanco Natural', ancho: '1.60m' } },
    { id: 'fb3', name: 'Blanco Natural / 2.80m', sku: 'TEL-BLA-280', price: 25.99, compareAtPrice: 31.99, stockQuantity: 30, options: { color: 'Blanco Natural', ancho: '2.80m' } },
    // Azul Índigo
    { id: 'fb4', name: 'Azul Índigo / 1.40m', sku: 'TEL-AZI-140', price: 13.99, compareAtPrice: 16.99, stockQuantity: 35, options: { color: 'Azul Índigo', ancho: '1.40m' } },
    { id: 'fb5', name: 'Azul Índigo / 1.60m', sku: 'TEL-AZI-160', price: 15.99, compareAtPrice: 18.99, stockQuantity: 30, options: { color: 'Azul Índigo', ancho: '1.60m' } },
    { id: 'fb6', name: 'Azul Índigo / 2.80m', sku: 'TEL-AZI-280', price: 27.99, compareAtPrice: 33.99, stockQuantity: 25, options: { color: 'Azul Índigo', ancho: '2.80m' } },
    // Terracota
    { id: 'fb7', name: 'Terracota / 1.40m', sku: 'TEL-TER-140', price: 13.99, compareAtPrice: 16.99, stockQuantity: 28, options: { color: 'Terracota', ancho: '1.40m' } },
    { id: 'fb8', name: 'Terracota / 1.60m', sku: 'TEL-TER-160', price: 15.99, compareAtPrice: 18.99, stockQuantity: 22, options: { color: 'Terracota', ancho: '1.60m' } },
    { id: 'fb9', name: 'Terracota / 2.80m', sku: 'TEL-TER-280', price: 27.99, compareAtPrice: 33.99, stockQuantity: 18, options: { color: 'Terracota', ancho: '2.80m' } },
    // Verde Bosque
    { id: 'fb10', name: 'Verde Bosque / 1.40m', sku: 'TEL-VEB-140', price: 12.99, compareAtPrice: 15.99, stockQuantity: 42, options: { color: 'Verde Bosque', ancho: '1.40m' } },
    { id: 'fb11', name: 'Verde Bosque / 1.60m', sku: 'TEL-VEB-160', price: 14.99, compareAtPrice: 17.99, stockQuantity: 38, options: { color: 'Verde Bosque', ancho: '1.60m' } },
    { id: 'fb12', name: 'Verde Bosque / 2.80m', sku: 'TEL-VEB-280', price: 25.99, compareAtPrice: 31.99, stockQuantity: 28, options: { color: 'Verde Bosque', ancho: '2.80m' } },
    // Gris Perla
    { id: 'fb13', name: 'Gris Perla / 1.40m', sku: 'TEL-GRI-140', price: 12.99, compareAtPrice: 15.99, stockQuantity: 38, options: { color: 'Gris Perla', ancho: '1.40m' } },
    { id: 'fb14', name: 'Gris Perla / 1.60m', sku: 'TEL-GRI-160', price: 14.99, compareAtPrice: 17.99, stockQuantity: 32, options: { color: 'Gris Perla', ancho: '1.60m' } },
    { id: 'fb15', name: 'Gris Perla / 2.80m', sku: 'TEL-GRI-280', price: 25.99, compareAtPrice: 31.99, stockQuantity: 24, options: { color: 'Gris Perla', ancho: '2.80m' } },
    // Negro
    { id: 'fb16', name: 'Negro / 1.40m', sku: 'TEL-NEG-140', price: 13.99, compareAtPrice: 16.99, stockQuantity: 32, options: { color: 'Negro', ancho: '1.40m' } },
    { id: 'fb17', name: 'Negro / 1.60m', sku: 'TEL-NEG-160', price: 15.99, compareAtPrice: 18.99, stockQuantity: 28, options: { color: 'Negro', ancho: '1.60m' } },
    { id: 'fb18', name: 'Negro / 2.80m', sku: 'TEL-NEG-280', price: 27.99, compareAtPrice: 33.99, stockQuantity: 20, options: { color: 'Negro', ancho: '2.80m' } },
  ],
  category: { name: 'Textiles', slug: 'textiles' },
  subcategory: { name: 'Telas', slug: 'telas' },
  reviews: [
    { id: 1, author: 'Marta C.', rating: 5, date: '2024-03-14', title: 'Tela excelente para costura profesional', comment: 'He confeccionado 3 blusas y la calidad es inmejorable. El algodón es suave, tiene cuerpo perfecto y los colores son exactamente como se ven en las fotos. Perfecta para costura profesional.', helpful: 42, verified: true },
    { id: 2, author: 'Rosa T.', rating: 5, date: '2024-03-11', title: 'Ideal para proyectos de decoración', comment: 'Pedí 3 metros para hacer cortinas en mi dormitorio. La tela cae preciosamente, es fácil de trabajar y los colores son super resistentes. Muy recomendado.', helpful: 28, verified: true },
    { id: 3, author: 'Elena M.', rating: 4, date: '2024-03-08', title: 'Buena calidad, envío rápido', comment: 'La tela llegó bien empaquetada. La calidad es muy buena aunque se me hizo un poco cara comparada con otras opciones. Aun así, la certificación GOTS vale la pena.', helpful: 15, verified: true },
  ],
};

// ─── Color Map for swatches ─────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  'Space Gray': '#4a4a4a', 'Silver': '#c0c0c0',
  'Negro': '#1a1a1a', 'Blanco': '#f5f5f5', 'Azul Marino': '#1b3a5c',
  'Gris Melange': '#9ca3af', 'Burdeos': '#722f37', 'Verde Oliva': '#556b2f',
  'Rojo': '#dc2626', 'Azul': '#2563eb', 'Rosa': '#ec4899',
};

// ─── Size guide for clothing ────────────────────────────────
const SIZE_GUIDE = [
  { talla: 'XS', pecho: '86-90', cintura: '70-74', cadera: '86-90' },
  { talla: 'S', pecho: '90-96', cintura: '74-80', cadera: '90-96' },
  { talla: 'M', pecho: '96-102', cintura: '80-86', cadera: '96-102' },
  { talla: 'L', pecho: '102-108', cintura: '86-92', cadera: '102-108' },
  { talla: 'XL', pecho: '108-116', cintura: '92-100', cadera: '108-116' },
  { talla: 'XXL', pecho: '116-124', cintura: '100-108', cadera: '116-124' },
];

// ─── Component ───────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Decide which demo product to show based on slug
  let PRODUCT: ProductData;
  if (slug?.includes('tela') || slug?.includes('fabric')) {
    PRODUCT = DEMO_PRODUCT_FABRIC;
  } else if (slug?.includes('camiseta')) {
    PRODUCT = DEMO_PRODUCT_FASHION;
  } else {
    PRODUCT = DEMO_PRODUCT_TECH;
  }

  const hasSizes = PRODUCT.variantOptions.some(opt => opt.key === 'talla');
  const isUnitBased = PRODUCT.sellingUnit && PRODUCT.sellingUnit !== 'unidad';

  // ─── Variant Selection State ─────────────────────────────
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    PRODUCT.variantOptions.forEach(opt => {
      defaults[opt.key] = opt.values[0];
    });
    return defaults;
  });

  // Find matching variant based on selected options
  const selectedVariant = useMemo(() => {
    return PRODUCT.variants.find(v =>
      Object.entries(selectedOptions).every(([key, value]) => v.options[key] === value)
    ) || null;
  }, [selectedOptions, PRODUCT.variants]);

  // Get available values for each option considering other selections
  const availableOptionsForKey = (key: string): Set<string> => {
    const otherSelections = { ...selectedOptions };
    delete otherSelections[key];
    const available = new Set<string>();
    PRODUCT.variants.forEach(v => {
      const matchesOther = Object.entries(otherSelections).every(([k, val]) => v.options[k] === val);
      if (matchesOther && v.options[key]) {
        available.add(v.options[key]!);
      }
    });
    return available;
  };

  const currentPrice = selectedVariant?.price ?? PRODUCT.basePrice;
  const currentComparePrice = selectedVariant?.compareAtPrice ?? PRODUCT.compareAtPrice;
  const currentStock = selectedVariant?.stockQuantity ?? 0;
  const discount = currentComparePrice ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100) : 0;

  // ─── Hooks ───────────────────────────────────────────────
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // ─── UI State ────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'sizeGuide'>('description');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());

  const isInWishlist = isFavorite(PRODUCT.id);

  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const handleOptionSelect = (key: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleQuantityChange = (change: number) => {
    const max = Math.min(currentStock, 10);
    const newQ = quantity + change;
    if (newQ >= 1 && newQ <= max) setQuantity(newQ);
  };

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    PRODUCT.reviews.forEach(r => dist[r.rating - 1]++);
    return dist.reverse().map(count => PRODUCT.reviews.length > 0 ? Math.round((count / PRODUCT.reviews.length) * 100) : 0);
  }, [PRODUCT.reviews]);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400 overflow-x-auto">
        <Link href="/" className="hover:text-[#0066FF] whitespace-nowrap transition-colors">Inicio</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href={`/categorias/${PRODUCT.category.slug}`} className="hover:text-[#0066FF] whitespace-nowrap transition-colors">{PRODUCT.category.name}</Link>
        {PRODUCT.subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href={`/categorias/${PRODUCT.category.slug}?sub=${PRODUCT.subcategory.slug}`} className="hover:text-[#0066FF] whitespace-nowrap transition-colors">{PRODUCT.subcategory.name}</Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[#4A4A4A] font-medium truncate">{PRODUCT.name}</span>
      </nav>

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Gallery */}
        <div className="lg:col-span-5 space-y-2 sm:space-y-3">
          <div className="aspect-square rounded-2xl bg-white border border-gray-300 flex items-center justify-center text-6xl sm:text-8xl lg:text-9xl overflow-hidden">
            {(() => {
              const img = PRODUCT.gallery[selectedImage] || PRODUCT.image;
              return img.startsWith('http')
                ? <img src={img} alt={PRODUCT.name} className="w-full h-full object-cover" />
                : <span className="text-6xl sm:text-8xl lg:text-9xl">{img}</span>;
            })()}
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            {PRODUCT.gallery.slice(0, 5).map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className={`flex-1 aspect-square rounded-xl bg-white border-2 flex items-center justify-center text-xl sm:text-3xl transition-colors min-h-[60px] sm:min-h-[80px] ${selectedImage === i ? 'border-gray-400' : 'border-gray-200 hover:border-gray-300'}`}>
                {img.startsWith('http')
                  ? <img src={img} alt={`${PRODUCT.name} thumbnail ${i}`} className="w-full h-full object-cover rounded-lg" />
                  : <span>{img}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-5">
          {/* Store badge */}
          <Link href={`/buscar?q=${PRODUCT.store.slug}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 text-xs sm:text-sm">
            <Store className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#0066FF]" />
            <span className="font-semibold text-[#0066FF]">{PRODUCT.store.name}</span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 hidden sm:inline">({PRODUCT.store.sales} ventas)</span>
          </Link>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] leading-tight">{PRODUCT.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 sm:w-4 h-3 sm:h-4 ${i < Math.floor(PRODUCT.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="font-semibold text-[#000000]">{PRODUCT.rating}</span>
            <a href="#reviews" className="text-[#0066FF] hover:underline">{PRODUCT.reviewCount} reseñas</a>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-3 sm:p-4 border border-orange-200">
            {discount > 0 && (
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                <span className="text-xs sm:text-sm text-gray-400 line-through">{currentComparePrice?.toFixed(2)}€</span>
              </div>
            )}
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-xs sm:text-sm text-gray-400">€</span>
              <span className="text-3xl sm:text-4xl font-black text-[#000000]">{Math.floor(currentPrice)}</span>
              <span className="text-base sm:text-lg font-bold text-[#000000]">.{(currentPrice % 1).toFixed(2).slice(2)}</span>
              {isUnitBased && <span className="text-xs sm:text-sm text-gray-600 ml-2">/{PRODUCT.unitLabel}</span>}
            </div>
            {discount > 0 && (
              <p className="text-xs text-emerald-600 font-medium mt-1">Ahorras {((currentComparePrice || 0) - currentPrice).toFixed(2)}€</p>
            )}
            {selectedVariant && (
              <p className="text-[10px] text-gray-500 mt-1">SKU: {selectedVariant.sku}</p>
            )}
          </div>

          {/* ═══ VARIANT SELECTORS ═══ */}
          {PRODUCT.variantOptions.map(opt => {
            const available = availableOptionsForKey(opt.key);
            const isColorOption = opt.key === 'color';

            return (
              <div key={opt.key}>
                <p className="text-xs sm:text-sm font-semibold text-[#000000] mb-2">
                  {opt.name}: <span className="font-normal text-gray-400">{selectedOptions[opt.key]}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {opt.values.map(value => {
                    const isAvailable = available.has(value);
                    const isSelected = selectedOptions[opt.key] === value;
                    const variant = PRODUCT.variants.find(v => v.options[opt.key] === value && Object.entries(selectedOptions).filter(([k]) => k !== opt.key).every(([k, val]) => v.options[k] === val));
                    const outOfStock = variant ? variant.stockQuantity === 0 : !isAvailable;

                    return (
                      <button
                        key={value}
                        onClick={() => isAvailable && handleOptionSelect(opt.key, value)}
                        disabled={!isAvailable}
                        className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 min-h-[44px]
                          ${isSelected
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : isAvailable
                              ? 'bg-gray-100 border border-gray-200 text-gray-600 hover:border-gray-300'
                              : 'bg-gray-200 border border-gray-200 text-gray-400 cursor-not-allowed'
                          }
                          ${outOfStock && isAvailable ? 'opacity-60' : ''}
                        `}
                      >
                        {isColorOption && COLOR_MAP[value] && (
                          <span className="w-3 sm:w-4 h-3 sm:h-4 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: COLOR_MAP[value] }} />
                        )}
                        <span className="truncate">{value}</span>
                        {outOfStock && isAvailable && (
                          <span className="text-[8px] sm:text-[9px] text-red-400 ml-0.5">(agotado)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Size guide link for clothing */}
          {hasSizes && (
            <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#0066FF] hover:text-[#0066FF] transition-colors">
              <Ruler className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Guía de tallas
              {showSizeGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {/* Size guide table */}
          {showSizeGuide && (
            <div className="bg-white rounded-xl border border-gray-300 p-3 sm:p-4 overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-medium">Talla</th>
                    <th className="text-left py-2 pr-4 font-medium">Pecho (cm)</th>
                    <th className="text-left py-2 pr-4 font-medium">Cintura (cm)</th>
                    <th className="text-left py-2 font-medium">Cadera (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map(row => (
                    <tr key={row.talla} className={`border-b border-gray-200 ${selectedOptions.talla === row.talla ? "bg-blue-50" : ''}`}>
                      <td className="py-2 pr-4 font-semibold text-[#000000]">{row.talla}</td>
                      <td className="py-2 pr-4 text-[#4A4A4A]">{row.pecho}</td>
                      <td className="py-2 pr-4 text-[#4A4A4A]">{row.cintura}</td>
                      <td className="py-2 text-[#4A4A4A]">{row.cadera}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Short description + features */}
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{PRODUCT.shortDescription}</p>

          <ul className="space-y-1.5 sm:space-y-2">
            {PRODUCT.features.slice(0, 6).map((f, i) => (
              <li key={i} className="flex gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#4A4A4A]">
                <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Buy Box */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-300 p-4 sm:p-5 space-y-3 sm:space-y-4 sticky top-20 sm:top-24">
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-xs sm:text-sm text-gray-400">€</span>
              <span className="text-2xl sm:text-3xl font-black text-[#000000]">{Math.floor(currentPrice)}</span>
              <span className="text-base sm:text-lg font-bold text-[#000000]">.{(currentPrice % 1).toFixed(2).slice(2)}</span>
              {isUnitBased && <span className="text-xs sm:text-sm text-gray-400 ml-1">/{PRODUCT.unitLabel}</span>}
            </div>
            {isUnitBased && (
              <div className="text-sm text-gray-600 font-medium">
                {quantity.toFixed(PRODUCT.quantityStep ? Math.log10(1 / PRODUCT.quantityStep) : 1)}{PRODUCT.unitLabel} × €{currentPrice.toFixed(2)}/{PRODUCT.unitLabel} = €{(quantity * currentPrice).toFixed(2)}
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex gap-2 text-emerald-500">
                <Truck className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#000000]">Envío GRATIS</p>
                  <p className="text-gray-400">Llega el martes, 18 de marzo</p>
                </div>
              </div>
              {currentStock > 0 ? (
                <p className={`font-semibold ${currentStock <= 5 ? 'text-orange-500' : 'text-emerald-500'}`}>
                  {currentStock <= 5 ? `¡Solo quedan ${currentStock}!` : 'En stock'}
                </p>
              ) : (
                <p className="text-red-500 font-semibold">Agotado</p>
              )}
            </div>

            {/* Selected variant summary */}
            {selectedVariant && (
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                {Object.entries(selectedOptions).map(([key, value]) => (
                  <span key={key} className="mr-2">
                    <span className="text-gray-400">{key === 'talla' ? 'Talla' : key === 'color' ? 'Color' : key}:</span>{' '}
                    <span className="text-[#000000] font-medium">{value}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#4A4A4A]">
                {isUnitBased ? `${PRODUCT.unitLabel}:` : 'Cant:'}
              </span>
              {isUnitBased ? (
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= (PRODUCT.minQuantity || 0)) {
                      setQuantity(val);
                    }
                  }}
                  min={PRODUCT.minQuantity || 0}
                  step={PRODUCT.quantityStep || 0.1}
                  className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-gray-50 text-black w-24"
                />
              ) : (
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <button onClick={() => handleQuantityChange(-1)} className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"><Minus className="w-3 h-3 text-gray-500" /></button>
                  <span className="px-4 text-sm font-semibold border-x border-gray-200 text-black">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"><Plus className="w-3 h-3 text-gray-500" /></button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (currentStock > 0) {
                  addToCart({
                    id: selectedVariant?.id || PRODUCT.id,
                    name: PRODUCT.name,
                    price: currentPrice,
                    image: PRODUCT.image,
                    variant: selectedVariant?.name,
                    quantity: isUnitBased ? quantity : undefined,
                    unit: isUnitBased ? PRODUCT.sellingUnit : undefined,
                    step: isUnitBased ? PRODUCT.quantityStep : undefined
                  });
                  setAddedToCart(true);
                }
              }}
              disabled={currentStock === 0}
              className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                currentStock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : addedToCart
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-[#FF6B35] to-[#FF8B5E] hover:opacity-90 text-white shadow-orange-500/30'
              }`}>
              {currentStock === 0 ? 'No disponible' : addedToCart ? (<><Check className="w-4 h-4" /> Añadido al carrito</>) : (<><ShoppingCart className="w-4 h-4" /> Añadir al carrito</>)}
            </button>

            <Link href="/carrito" className={`w-full py-3 font-bold rounded-xl transition-all text-center block ${currentStock === 0 ? 'bg-gray-700 text-gray-500 pointer-events-none' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'}`}>
              Comprar ahora
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(PRODUCT.id)}
                className={`flex-1 py-2 text-sm border rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  isInWishlist
                    ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}>
                <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} /> Lista
              </button>
              <button
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: PRODUCT.name, url });
                    } catch (err) {
                      // User cancelled share
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(url);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    } catch (err) {
                      console.error('Failed to copy link:', err);
                    }
                  }
                }}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1.5 text-gray-600 transition-colors">
                <Share2 className="w-4 h-4" /> {copiedLink ? '¡Copiado!' : 'Compartir'}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              {[
                { icon: Truck, title: 'Envío gratis', desc: 'Pedidos +100€' },
                { icon: Shield, title: 'Garantía 2 años', desc: 'Del fabricante' },
                { icon: RotateCcw, title: 'Devolución 30 días', desc: 'Sin preguntas' },
              ].map(item => (
                <div key={item.title} className="flex gap-2.5">
                  <item.icon className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <div><p className="text-xs font-semibold text-[#000000]">{item.title}</p><p className="text-[10px] text-gray-400">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DETAILED DESCRIPTION + SPECS SECTION ═══ */}
      <section className="border-t border-gray-200 pt-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
          {[
            { id: 'description' as const, label: 'Descripción detallada', icon: Info },
            { id: 'specs' as const, label: 'Especificaciones técnicas', icon: Package },
            ...(hasSizes ? [{ id: 'sizeGuide' as const, label: 'Guía de tallas', icon: Ruler }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-gray-500 text-[#0066FF]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div className="max-w-none">
                {PRODUCT.longDescription.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-[#4A4A4A] leading-relaxed text-sm md:text-base mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* All features */}
              <div className="bg-white rounded-xl border border-gray-300 p-6">
                <h3 className="text-lg font-bold text-[#000000] mb-4">Características principales</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PRODUCT.features.map((f, i) => (
                    <div key={i} className="flex gap-2 text-sm text-[#4A4A4A]">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {PRODUCT.specifications.map((spec, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : ''} border-b border-gray-200 last:border-0`}>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-400 w-1/3 align-top">{spec.label}</td>
                      <td className="px-6 py-3.5 text-sm text-[#4A4A4A]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Size Guide Tab */}
          {activeTab === 'sizeGuide' && hasSizes && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-300 p-6 overflow-x-auto">
                <h3 className="text-lg font-bold text-[#000000] mb-4">Tabla de medidas (cm)</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-200">
                      <th className="text-left py-3 pr-6 font-semibold">Talla</th>
                      <th className="text-left py-3 pr-6 font-semibold">Pecho</th>
                      <th className="text-left py-3 pr-6 font-semibold">Cintura</th>
                      <th className="text-left py-3 font-semibold">Cadera</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.map(row => (
                      <tr key={row.talla} className={`border-b border-gray-200 ${selectedOptions.talla === row.talla ? 'bg-blue-50' : ''}`}>
                        <td className="py-3 pr-6 font-bold text-[#000000]">{row.talla}</td>
                        <td className="py-3 pr-6 text-[#4A4A4A]">{row.pecho}</td>
                        <td className="py-3 pr-6 text-[#4A4A4A]">{row.cintura}</td>
                        <td className="py-3 text-[#4A4A4A]">{row.cadera}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">Consejo de talla</p>
                <p className="text-amber-700">Si tu medida está entre dos tallas, te recomendamos elegir la talla más grande para un ajuste más cómodo. Las medidas son orientativas y pueden variar ligeramente según el modelo.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ VARIANT PRICE TABLE ═══ */}
      {PRODUCT.variants.length > 4 && (
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-[#000000] mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0066FF]" />
            Todas las combinaciones y precios
          </h2>
          <div className="bg-white rounded-xl border border-gray-300 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-200 bg-gray-50">
                  {PRODUCT.variantOptions.map(opt => (
                    <th key={opt.key} className="text-left px-4 py-3 font-semibold">{opt.name}</th>
                  ))}
                  <th className="text-right px-4 py-3 font-semibold">Precio</th>
                  <th className="text-center px-4 py-3 font-semibold">Disponibilidad</th>
                  <th className="text-center px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT.variants.map(v => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <tr key={v.id} className={`border-b border-gray-200 transition-colors ${isSelected ? "bg-blue-50" : 'hover:bg-gray-50'}`}>
                      {PRODUCT.variantOptions.map(opt => (
                        <td key={opt.key} className="px-4 py-3 text-[#4A4A4A] whitespace-nowrap">
                          {opt.key === 'color' && COLOR_MAP[v.options[opt.key] || ''] && (
                            <span className="inline-block w-3 h-3 rounded-full mr-2 align-middle border border-gray-300" style={{ backgroundColor: COLOR_MAP[v.options[opt.key] || ''] }} />
                          )}
                          {v.options[opt.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right text-[#000000] font-semibold whitespace-nowrap">
                        {v.price.toFixed(2)}€
                        {v.compareAtPrice && (
                          <span className="text-xs text-gray-500 line-through ml-2">{v.compareAtPrice.toFixed(2)}€</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {v.stockQuantity > 5 ? (
                          <span className="text-emerald-600 text-xs font-medium">En stock</span>
                        ) : v.stockQuantity > 0 ? (
                          <span className="text-orange-500 text-xs font-medium">Quedan {v.stockQuantity}</span>
                        ) : (
                          <span className="text-red-500 text-xs font-medium">Agotado</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            const opts: Record<string, string> = {};
                            PRODUCT.variantOptions.forEach(opt => { if (v.options[opt.key]) opts[opt.key] = v.options[opt.key]!; });
                            setSelectedOptions(opts);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`text-xs px-3 py-1 rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {isSelected ? 'Seleccionado' : 'Seleccionar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ═══ REVIEWS ═══ */}
      <section id="reviews" className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold text-[#000000] mb-6">Opiniones de clientes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Rating Summary */}
          <div className="bg-white rounded-2xl border border-gray-300 p-6 text-center">
            <span className="text-5xl font-black text-[#000000]">{PRODUCT.rating}</span>
            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(PRODUCT.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">{PRODUCT.reviewCount} valoraciones</p>
            <div className="mt-4 space-y-1.5">
              {ratingDistribution.map((pct, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-right text-gray-400">{5 - i}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-7 text-right text-gray-500">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="md:col-span-2 space-y-4">
            {(showAllReviews ? PRODUCT.reviews : PRODUCT.reviews.slice(0, 3)).map(review => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-300 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold">{review.author[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#000000]">{review.author}</p>
                      {review.verified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Compra verificada</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />))}</div>
                      <span className="text-[10px] text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-sm mt-3 text-[#000000]">{review.title}</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{review.comment}</p>
                <button
                  onClick={() => {
                    const newSet = new Set(helpfulReviews);
                    if (newSet.has(review.id)) {
                      newSet.delete(review.id);
                    } else {
                      newSet.add(review.id);
                    }
                    setHelpfulReviews(newSet);
                  }}
                  className={`mt-3 flex items-center gap-1.5 text-xs transition-colors ${
                    helpfulReviews.has(review.id)
                      ? 'text-[#0066FF] font-medium'
                      : 'text-gray-400 hover:text-[#0066FF]'
                  }`}>
                  <ThumbsUp className="w-3.5 h-3.5" fill={helpfulReviews.has(review.id) ? 'currentColor' : 'none'} /> Útil ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
                </button>
              </div>
            ))}

            {PRODUCT.reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-[#0066FF] hover:bg-gray-100 transition-colors"
              >
                {showAllReviews ? 'Ver menos reseñas' : `Ver todas las reseñas (${PRODUCT.reviews.length})`}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
