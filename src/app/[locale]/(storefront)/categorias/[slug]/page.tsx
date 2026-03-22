'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import {
  Star, Heart, ShoppingCart, SlidersHorizontal, Grid3X3, List,
  ChevronDown, ArrowLeft, Search, Filter, X, ArrowUpDown, Check,
  Smartphone, Shirt, Sofa, Dumbbell, Book, Gamepad2, Sparkles,
  ShoppingBag, Cpu, Headphones, Watch, Camera, Tv, Baby, Leaf,
  PawPrint, Hammer, Briefcase, Car, ChevronRight,
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'

// Crystal Minimal 2026 Design System Colors
const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  title: '#000000',
  subtitle: '#4A4A4A',
  accentBlue: '#0066FF',
  secondary: '#FAFAFA',
  cardBg: '#FFFFFF',
  shadow: '0 2px 40px rgba(0,0,0,0.04)',
  amber: 'fill-amber-400 text-amber-400',
}

interface SubcategoryData {
  id: string
  name: string
}

interface CategoryData {
  name: string
  description: string
  icon: React.ReactNode
  subcategories: SubcategoryData[]
}

const CATEGORIES: Record<string, CategoryData> = {
  electronics: {
    name: 'Electrónica', description: 'Smartphones, tablets, accesorios y más',
    icon: <Smartphone className="w-8 h-8" />,
    subcategories: [
      { id: 'phones', name: 'Móviles y Smartphones' },
      { id: 'tablets', name: 'Tablets' },
      { id: 'e-accessories', name: 'Accesorios electrónicos' },
      { id: 'chargers', name: 'Cargadores y cables' },
      { id: 'headphones-cat', name: 'Auriculares' },
      { id: 'smartwatches', name: 'Smartwatches' },
      { id: 'e-readers', name: 'E-readers' },
      { id: 'powerbanks', name: 'Baterías externas' },
      { id: 'screen-protectors', name: 'Protectores de pantalla' },
      { id: 'phone-cases', name: 'Fundas y carcasas' },
      { id: 'usb-hubs', name: 'Hubs y adaptadores' },
      { id: 'wearables', name: 'Wearables' },
      { id: 'docks', name: 'Docking stations' },
      { id: 'gps', name: 'GPS y navegación' },
      { id: 'calculators', name: 'Calculadoras' },
    ],
  },
  fashion: {
    name: 'Moda', description: 'Ropa, calzado y accesorios para toda la familia',
    icon: <Shirt className="w-8 h-8" />,
    subcategories: [
      { id: 'men-shirts', name: 'Camisas hombre' },
      { id: 'men-pants', name: 'Pantalones hombre' },
      { id: 'men-jackets', name: 'Chaquetas hombre' },
      { id: 'women-dresses', name: 'Vestidos mujer' },
      { id: 'women-tops', name: 'Tops y blusas mujer' },
      { id: 'women-pants', name: 'Pantalones mujer' },
      { id: 'women-jackets', name: 'Chaquetas mujer' },
      { id: 'kids-clothes', name: 'Ropa infantil' },
      { id: 'shoes-men', name: 'Calzado hombre' },
      { id: 'shoes-women', name: 'Calzado mujer' },
      { id: 'sneakers', name: 'Zapatillas deportivas' },
      { id: 'bags-handbags', name: 'Bolsos y carteras' },
      { id: 'backpacks', name: 'Mochilas' },
      { id: 'sunglasses', name: 'Gafas de sol' },
      { id: 'belts', name: 'Cinturones' },
      { id: 'scarves', name: 'Bufandas y pañuelos' },
      { id: 'jewelry', name: 'Joyería y bisutería' },
      { id: 'underwear', name: 'Ropa interior' },
      { id: 'sportswear', name: 'Ropa deportiva' },
      { id: 'swimwear', name: 'Bañadores' },
    ],
  },
  home: {
    name: 'Hogar y Cocina', description: 'Todo para tu hogar, decoración y cocina',
    icon: <Sofa className="w-8 h-8" />,
    subcategories: [
      { id: 'sofas', name: 'Sofás y sillones' },
      { id: 'tables', name: 'Mesas' },
      { id: 'chairs', name: 'Sillas' },
      { id: 'shelving', name: 'Estanterías' },
      { id: 'beds', name: 'Camas y colchones' },
      { id: 'decor', name: 'Decoración' },
      { id: 'curtains', name: 'Cortinas y estores' },
      { id: 'rugs', name: 'Alfombras' },
      { id: 'mirrors', name: 'Espejos' },
      { id: 'cookware', name: 'Ollas y sartenes' },
      { id: 'cutlery', name: 'Cubertería' },
      { id: 'appliances', name: 'Pequeños electrodomésticos' },
      { id: 'tableware', name: 'Vajilla' },
      { id: 'bathroom-acc', name: 'Accesorios de baño' },
      { id: 'towels', name: 'Toallas y textiles' },
      { id: 'lighting', name: 'Iluminación' },
      { id: 'candles', name: 'Velas y aromaterapia' },
      { id: 'storage', name: 'Almacenaje y organización' },
    ],
  },
  sports: {
    name: 'Deportes', description: 'Equipamiento deportivo y fitness',
    icon: <Dumbbell className="w-8 h-8" />,
    subcategories: [
      { id: 'fitness-equipment', name: 'Equipamiento fitness' },
      { id: 'weights', name: 'Pesas y mancuernas' },
      { id: 'running-shoes', name: 'Zapatillas running' },
      { id: 'running-acc', name: 'Accesorios running' },
      { id: 'cycling-bikes', name: 'Bicicletas' },
      { id: 'cycling-acc', name: 'Accesorios ciclismo' },
      { id: 'swimming', name: 'Natación' },
      { id: 'yoga-pilates', name: 'Yoga y pilates' },
      { id: 'team-sports', name: 'Deportes de equipo' },
      { id: 'racket-sports', name: 'Raquetas y pádel' },
      { id: 'outdoor-camping', name: 'Camping y senderismo' },
      { id: 'climbing', name: 'Escalada' },
      { id: 'martial-arts', name: 'Artes marciales' },
      { id: 'sports-nutrition', name: 'Nutrición deportiva' },
      { id: 'sports-tech', name: 'Tecnología deportiva' },
      { id: 'skiing', name: 'Esquí y snowboard' },
    ],
  },
  books: {
    name: 'Libros', description: 'Ficción, no ficción, infantil y más',
    icon: <Book className="w-8 h-8" />,
    subcategories: [
      { id: 'literary-fiction', name: 'Novela literaria' },
      { id: 'thriller', name: 'Thriller y suspense' },
      { id: 'romance', name: 'Romántica' },
      { id: 'scifi-fantasy', name: 'Ciencia ficción y fantasía' },
      { id: 'history', name: 'Historia' },
      { id: 'biography', name: 'Biografías' },
      { id: 'selfhelp', name: 'Autoayuda y desarrollo' },
      { id: 'business', name: 'Empresa y negocios' },
      { id: 'science', name: 'Ciencia y tecnología' },
      { id: 'cookbooks', name: 'Cocina y gastronomía' },
      { id: 'children-books', name: 'Infantil (0-8 años)' },
      { id: 'young-adult', name: 'Juvenil' },
      { id: 'comics-manga', name: 'Cómics y manga' },
      { id: 'academic-textbooks', name: 'Libros de texto' },
      { id: 'art-photography', name: 'Arte y fotografía' },
      { id: 'poetry', name: 'Poesía' },
    ],
  },
  games: {
    name: 'Videojuegos', description: 'Consolas, juegos y accesorios gaming',
    icon: <Gamepad2 className="w-8 h-8" />,
    subcategories: [
      { id: 'ps5-console', name: 'PS5 Consola' },
      { id: 'ps5-games', name: 'Juegos PS5' },
      { id: 'ps5-acc', name: 'Accesorios PS5' },
      { id: 'xbox-console', name: 'Xbox Series X|S' },
      { id: 'xbox-games', name: 'Juegos Xbox' },
      { id: 'xbox-acc', name: 'Accesorios Xbox' },
      { id: 'nintendo-console', name: 'Nintendo Switch' },
      { id: 'nintendo-games', name: 'Juegos Nintendo' },
      { id: 'pc-gaming-hw', name: 'Hardware PC Gaming' },
      { id: 'pc-games', name: 'Juegos PC' },
      { id: 'gaming-chairs', name: 'Sillas gaming' },
      { id: 'gaming-monitors', name: 'Monitores gaming' },
      { id: 'gaming-mice', name: 'Ratones gaming' },
      { id: 'gaming-keyboards', name: 'Teclados gaming' },
      { id: 'gaming-headsets', name: 'Auriculares gaming' },
      { id: 'vr', name: 'Realidad Virtual' },
      { id: 'retro-gaming', name: 'Retro gaming' },
      { id: 'game-cards', name: 'Tarjetas y suscripciones' },
    ],
  },
  beauty: {
    name: 'Belleza', description: 'Cuidado de la piel, maquillaje y fragancias',
    icon: <Sparkles className="w-8 h-8" />,
    subcategories: [
      { id: 'face-care', name: 'Cuidado facial' },
      { id: 'body-care', name: 'Cuidado corporal' },
      { id: 'sunscreen', name: 'Protección solar' },
      { id: 'face-makeup', name: 'Maquillaje rostro' },
      { id: 'eye-makeup', name: 'Maquillaje ojos' },
      { id: 'lip-makeup', name: 'Maquillaje labios' },
      { id: 'nail-care', name: 'Uñas y manicura' },
      { id: 'perfume-women', name: 'Perfumes mujer' },
      { id: 'perfume-men', name: 'Perfumes hombre' },
      { id: 'shampoo', name: 'Champú y acondicionador' },
      { id: 'hair-styling', name: 'Styling capilar' },
      { id: 'hair-tools', name: 'Secadores y planchas' },
      { id: 'men-grooming', name: 'Cuidado masculino' },
      { id: 'beauty-tools', name: 'Accesorios de belleza' },
      { id: 'organic-beauty', name: 'Cosmética natural' },
    ],
  },
  groceries: {
    name: 'Supermercado', description: 'Alimentación, bebidas y productos del hogar',
    icon: <ShoppingBag className="w-8 h-8" />,
    subcategories: [
      { id: 'fruits-vegs', name: 'Frutas y verduras' },
      { id: 'meat-fish', name: 'Carne y pescado' },
      { id: 'dairy', name: 'Lácteos y huevos' },
      { id: 'bakery', name: 'Panadería y bollería' },
      { id: 'pasta-rice', name: 'Pasta y arroz' },
      { id: 'canned', name: 'Conservas' },
      { id: 'sauces', name: 'Salsas y condimentos' },
      { id: 'water-juices', name: 'Agua y zumos' },
      { id: 'soft-drinks', name: 'Refrescos' },
      { id: 'coffee-tea', name: 'Café e infusiones' },
      { id: 'wine-beer', name: 'Vinos y cervezas' },
      { id: 'snacks-chips', name: 'Snacks y frutos secos' },
      { id: 'chocolates', name: 'Chocolates y dulces' },
      { id: 'frozen', name: 'Congelados' },
      { id: 'bio-organic', name: 'Ecológico y bio' },
      { id: 'cleaning-products', name: 'Limpieza del hogar' },
      { id: 'laundry', name: 'Lavandería' },
      { id: 'paper-products', name: 'Papel y celulosa' },
    ],
  },
  computing: {
    name: 'Informática', description: 'Portátiles, componentes y periféricos',
    icon: <Cpu className="w-8 h-8" />,
    subcategories: [
      { id: 'laptops', name: 'Portátiles' },
      { id: 'desktops', name: 'Sobremesa' },
      { id: 'monitors', name: 'Monitores' },
      { id: 'cpus', name: 'Procesadores' },
      { id: 'gpus', name: 'Tarjetas gráficas' },
      { id: 'ram', name: 'Memoria RAM' },
      { id: 'ssd-hdd', name: 'SSD y discos duros' },
      { id: 'motherboards', name: 'Placas base' },
      { id: 'pc-cases', name: 'Torres y cajas' },
      { id: 'psu', name: 'Fuentes de alimentación' },
      { id: 'cooling', name: 'Refrigeración' },
      { id: 'keyboards', name: 'Teclados' },
      { id: 'mice', name: 'Ratones' },
      { id: 'webcams', name: 'Webcams' },
      { id: 'printers', name: 'Impresoras' },
      { id: 'networking', name: 'Routers y redes' },
      { id: 'nas', name: 'NAS y servidores' },
      { id: 'software', name: 'Software y licencias' },
    ],
  },
  audio: {
    name: 'Audio', description: 'Auriculares, altavoces y equipos de sonido',
    icon: <Headphones className="w-8 h-8" />,
    subcategories: [
      { id: 'over-ear', name: 'Auriculares over-ear' },
      { id: 'in-ear', name: 'Auriculares in-ear' },
      { id: 'wireless-earbuds', name: 'Earbuds inalámbricos' },
      { id: 'noise-cancelling', name: 'Cancelación de ruido' },
      { id: 'bt-speakers', name: 'Altavoces Bluetooth' },
      { id: 'smart-speakers', name: 'Altavoces inteligentes' },
      { id: 'soundbars', name: 'Barras de sonido' },
      { id: 'home-theater', name: 'Cine en casa' },
      { id: 'studio-mics', name: 'Micrófonos de estudio' },
      { id: 'usb-mics', name: 'Micrófonos USB' },
      { id: 'turntables', name: 'Tocadiscos' },
      { id: 'audio-interfaces', name: 'Interfaces de audio' },
      { id: 'dj-equipment', name: 'Equipamiento DJ' },
      { id: 'audio-cables', name: 'Cables y adaptadores' },
    ],
  },
  watches: {
    name: 'Relojes', description: 'Relojes deportivos, clásicos e inteligentes',
    icon: <Watch className="w-8 h-8" />,
    subcategories: [
      { id: 'sport-watches', name: 'Deportivos' },
      { id: 'classic-watches', name: 'Clásicos y elegantes' },
      { id: 'smart-watches', name: 'Inteligentes' },
      { id: 'dive-watches', name: 'Buceo' },
      { id: 'luxury-watches', name: 'Lujo' },
      { id: 'fashion-watches', name: 'Moda' },
      { id: 'watch-bands', name: 'Correas y pulseras' },
      { id: 'watch-accessories', name: 'Accesorios para relojes' },
      { id: 'chronographs', name: 'Cronógrafos' },
      { id: 'pocket-watches', name: 'Relojes de bolsillo' },
    ],
  },
  photography: {
    name: 'Fotografía', description: 'Cámaras, objetivos y accesorios',
    icon: <Camera className="w-8 h-8" />,
    subcategories: [
      { id: 'dslr', name: 'Cámaras réflex' },
      { id: 'mirrorless', name: 'Sin espejo (mirrorless)' },
      { id: 'compact', name: 'Cámaras compactas' },
      { id: 'action-cams', name: 'Cámaras de acción' },
      { id: 'instant-cams', name: 'Instantáneas' },
      { id: 'lenses-wide', name: 'Objetivos gran angular' },
      { id: 'lenses-tele', name: 'Teleobjetivos' },
      { id: 'lenses-macro', name: 'Objetivos macro' },
      { id: 'tripods', name: 'Trípodes' },
      { id: 'gimbals', name: 'Estabilizadores y gimbals' },
      { id: 'lighting-photo', name: 'Iluminación fotográfica' },
      { id: 'memory-cards', name: 'Tarjetas de memoria' },
      { id: 'camera-bags', name: 'Bolsas y mochilas' },
      { id: 'drones', name: 'Drones' },
      { id: 'filters', name: 'Filtros ópticos' },
    ],
  },
  tv: {
    name: 'TV y Cine', description: 'Televisores, proyectores y home cinema',
    icon: <Tv className="w-8 h-8" />,
    subcategories: [
      { id: 'oled-tv', name: 'OLED' },
      { id: 'qled-tv', name: 'QLED' },
      { id: 'led-tv', name: 'LED / LCD' },
      { id: '4k-tv', name: '4K UHD' },
      { id: '8k-tv', name: '8K' },
      { id: 'smart-tv', name: 'Smart TV' },
      { id: 'tv-small', name: 'TV hasta 43"' },
      { id: 'tv-medium', name: 'TV 50"-65"' },
      { id: 'tv-large', name: 'TV 70" o más' },
      { id: 'projectors', name: 'Proyectores' },
      { id: 'screens', name: 'Pantallas de proyección' },
      { id: 'streaming-devices', name: 'Dispositivos streaming' },
      { id: 'tv-mounts', name: 'Soportes de TV' },
      { id: 'hdmi-cables', name: 'Cables HDMI' },
    ],
  },
  baby: {
    name: 'Bebé', description: 'Todo para el cuidado y bienestar del bebé',
    icon: <Baby className="w-8 h-8" />,
    subcategories: [
      { id: 'baby-clothes-0-12', name: 'Ropa 0-12 meses' },
      { id: 'baby-clothes-1-3', name: 'Ropa 1-3 años' },
      { id: 'diapers', name: 'Pañales' },
      { id: 'baby-wipes', name: 'Toallitas' },
      { id: 'baby-bath', name: 'Baño y cuidado' },
      { id: 'baby-food', name: 'Alimentación infantil' },
      { id: 'bottles-pacifiers', name: 'Biberones y chupetes' },
      { id: 'highchairs', name: 'Tronas' },
      { id: 'strollers', name: 'Cochecitos y sillas' },
      { id: 'car-seats', name: 'Sillas de coche' },
      { id: 'cribs', name: 'Cunas y minicunas' },
      { id: 'baby-monitors', name: 'Vigilabebés' },
      { id: 'toys-0-2', name: 'Juguetes 0-2 años' },
      { id: 'toys-3-5', name: 'Juguetes 3-5 años' },
      { id: 'toys-educational', name: 'Juguetes educativos' },
    ],
  },
  garden: {
    name: 'Jardín', description: 'Plantas, herramientas y decoración exterior',
    icon: <Leaf className="w-8 h-8" />,
    subcategories: [
      { id: 'indoor-plants', name: 'Plantas de interior' },
      { id: 'outdoor-plants', name: 'Plantas de exterior' },
      { id: 'seeds', name: 'Semillas y bulbos' },
      { id: 'pots', name: 'Macetas y jardineras' },
      { id: 'soil-fertilizer', name: 'Tierra y abonos' },
      { id: 'garden-tools', name: 'Herramientas de jardín' },
      { id: 'lawnmowers', name: 'Cortacéspedes' },
      { id: 'watering', name: 'Riego' },
      { id: 'garden-furniture', name: 'Muebles de jardín' },
      { id: 'bbq', name: 'Barbacoas' },
      { id: 'garden-lighting', name: 'Iluminación exterior' },
      { id: 'pool', name: 'Piscinas y accesorios' },
      { id: 'pest-control', name: 'Control de plagas' },
    ],
  },
  pets: {
    name: 'Mascotas', description: 'Alimentación, accesorios y cuidado animal',
    icon: <PawPrint className="w-8 h-8" />,
    subcategories: [
      { id: 'dog-food', name: 'Comida para perros' },
      { id: 'dog-treats', name: 'Snacks para perros' },
      { id: 'dog-toys', name: 'Juguetes para perros' },
      { id: 'dog-beds', name: 'Camas para perros' },
      { id: 'dog-leashes', name: 'Correas y collares' },
      { id: 'cat-food', name: 'Comida para gatos' },
      { id: 'cat-litter', name: 'Arena para gatos' },
      { id: 'cat-toys', name: 'Juguetes para gatos' },
      { id: 'cat-trees', name: 'Rascadores y árboles' },
      { id: 'fish-tanks', name: 'Acuarios' },
      { id: 'bird-cages', name: 'Jaulas para aves' },
      { id: 'pet-health', name: 'Salud y bienestar' },
      { id: 'pet-grooming', name: 'Peluquería y aseo' },
      { id: 'pet-carriers', name: 'Transportines' },
    ],
  },
  diy: {
    name: 'Bricolaje', description: 'Herramientas, materiales y seguridad',
    icon: <Hammer className="w-8 h-8" />,
    subcategories: [
      { id: 'hand-tools', name: 'Herramientas manuales' },
      { id: 'power-tools', name: 'Herramientas eléctricas' },
      { id: 'drills', name: 'Taladros y atornilladores' },
      { id: 'saws', name: 'Sierras' },
      { id: 'measuring', name: 'Medición y nivelación' },
      { id: 'paint-supplies', name: 'Pintura y accesorios' },
      { id: 'wood', name: 'Madera y tableros' },
      { id: 'screws-nails', name: 'Tornillería y clavos' },
      { id: 'plumbing', name: 'Fontanería' },
      { id: 'electrical', name: 'Electricidad' },
      { id: 'safety-gear', name: 'Protección y seguridad' },
      { id: 'adhesives', name: 'Adhesivos y selladores' },
      { id: 'tool-storage', name: 'Almacenaje de herramientas' },
      { id: 'ladders', name: 'Escaleras' },
    ],
  },
  health: {
    name: 'Salud', description: 'Suplementos, dispositivos y bienestar',
    icon: <Heart className="w-8 h-8" />,
    subcategories: [
      { id: 'vitamins', name: 'Vitaminas y minerales' },
      { id: 'proteins', name: 'Proteínas y aminoácidos' },
      { id: 'omega', name: 'Omega y ácidos grasos' },
      { id: 'probiotics', name: 'Probióticos' },
      { id: 'blood-pressure', name: 'Tensiómetros' },
      { id: 'thermometers', name: 'Termómetros' },
      { id: 'pulse-oximeters', name: 'Pulsioxímetros' },
      { id: 'scales', name: 'Básculas inteligentes' },
      { id: 'massage', name: 'Masaje y relajación' },
      { id: 'oral-care', name: 'Cuidado bucal' },
      { id: 'contact-lenses', name: 'Lentes de contacto' },
      { id: 'glasses', name: 'Gafas graduadas' },
      { id: 'first-aid', name: 'Primeros auxilios' },
      { id: 'mobility-aids', name: 'Movilidad y ayudas' },
    ],
  },
  office: {
    name: 'Oficina', description: 'Muebles, suministros y tecnología de oficina',
    icon: <Briefcase className="w-8 h-8" />,
    subcategories: [
      { id: 'office-desks', name: 'Escritorios' },
      { id: 'office-chairs', name: 'Sillas de oficina' },
      { id: 'standing-desks', name: 'Escritorios elevables' },
      { id: 'filing', name: 'Archivadores' },
      { id: 'paper', name: 'Papel y sobres' },
      { id: 'pens', name: 'Bolígrafos y rotuladores' },
      { id: 'notebooks', name: 'Cuadernos y agendas' },
      { id: 'printers-office', name: 'Impresoras' },
      { id: 'ink-toner', name: 'Tinta y tóner' },
      { id: 'shredders', name: 'Destructoras' },
      { id: 'laminators', name: 'Plastificadoras' },
      { id: 'whiteboards', name: 'Pizarras' },
      { id: 'desk-organizers', name: 'Organizadores' },
      { id: 'office-lighting', name: 'Iluminación de oficina' },
    ],
  },
  automotive: {
    name: 'Automóvil', description: 'Accesorios, mantenimiento y equipamiento',
    icon: <Car className="w-8 h-8" />,
    subcategories: [
      { id: 'car-mats', name: 'Alfombrillas' },
      { id: 'seat-covers', name: 'Fundas de asientos' },
      { id: 'car-chargers', name: 'Cargadores de coche' },
      { id: 'phone-holders', name: 'Soportes para móvil' },
      { id: 'dash-cams', name: 'Cámaras de salpicadero' },
      { id: 'car-audio', name: 'Audio para coche' },
      { id: 'gps-nav', name: 'GPS y navegación' },
      { id: 'car-care', name: 'Cuidado y limpieza' },
      { id: 'motor-oil', name: 'Aceites y lubricantes' },
      { id: 'tires', name: 'Neumáticos' },
      { id: 'car-tools', name: 'Herramientas' },
      { id: 'bulbs', name: 'Bombillas y luces' },
      { id: 'wipers', name: 'Limpiaparabrisas' },
      { id: 'roof-racks', name: 'Barras de techo' },
      { id: 'child-seats', name: 'Sillas infantiles' },
    ],
  },
}

const EMOJIS = ['🎧', '📱', '💻', '👟', '📺', '🎮', '⌚', '🤖', '📷', '🧹', '👗', '🏠']
const BRANDS = ['TechPro', 'StyleMax', 'HomeElite', 'SportGear', 'AudioMax', 'GamingZone', 'FitPro', 'BeautyLux', 'NexoPro', 'PrimeBrand']

const PRODUCT_IMAGES: Record<string, string[]> = {
  'electronics': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', // laptop
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', // phone
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // headphones
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', // watch
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', // camera
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', // tv
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', // tablet
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', // speaker
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', // gaming
    'https://images.unsplash.com/photo-1495707902405-2d39a00bfae4?w=400&h=400&fit=crop', // generic tech
  ],
  'fashion': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // shoes
    'https://images.unsplash.com/photo-1556821552-5f9f41bcf5d7?w=400&h=400&fit=crop', // clothing
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // backpack
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // watch fashion
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', // shoes 2
    'https://images.unsplash.com/photo-1578926078328-123fc82e90b3?w=400&h=400&fit=crop', // fashion 2
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop', // belt
    'https://images.unsplash.com/photo-1564622506157-d633d89fa28f?w=400&h=400&fit=crop', // sunglasses
    'https://images.unsplash.com/photo-1515562141207-6811bcb33eaf?w=400&h=400&fit=crop', // jacket
    'https://images.unsplash.com/photo-1595777707802-221b369052cb?w=400&h=400&fit=crop', // socks
  ],
  'home': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', // sofa
    'https://images.unsplash.com/photo-1567538096051-b6643b1ea31e?w=400&h=400&fit=crop', // pillow
    'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop', // lamp
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop', // chair
    'https://images.unsplash.com/photo-1596394516093-501ba68352ba?w=400&h=400&fit=crop', // plant
    'https://images.unsplash.com/photo-1595521624817-d4b7f547a93e?w=400&h=400&fit=crop', // kitchen
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop', // decor
    'https://images.unsplash.com/photo-1565193566173-7cda82f45f69?w=400&h=400&fit=crop', // bedding
    'https://images.unsplash.com/photo-1578910781033-f5953856c3e3?w=400&h=400&fit=crop', // rug
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop', // mirror
  ],
  'sports': [
    'https://images.unsplash.com/photo-1517836357463-d25ddfcf2d8b?w=400&h=400&fit=crop', // dumbbells
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop', // yoga mat
    'https://images.unsplash.com/photo-1606145063579-32038bbd4b38?w=400&h=400&fit=crop', // running shoes
    'https://images.unsplash.com/photo-1578374084408-aac0e64efce0?w=400&h=400&fit=crop', // bicycle
    'https://images.unsplash.com/photo-1605296867004-11a209e7d128?w=400&h=400&fit=crop', // sports watch
    'https://images.unsplash.com/photo-1576502200916-3db79fcc6fe5?w=400&h=400&fit=crop', // sport bottle
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // athletic shoes
    'https://images.unsplash.com/photo-1605298213937-65e86dd40754?w=400&h=400&fit=crop', // resistance band
    'https://images.unsplash.com/photo-1608228267407-6c55f7ceea89?w=400&h=400&fit=crop', // ball
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', // gloves
  ],
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
]

function generateProducts(category: CategoryData, count: number, categorySlug?: string) {
  const adjectives = ['Premium', 'Pro', 'Ultra', 'Deluxe', 'Sport', 'Classic', 'Lite', 'Max', 'Plus', 'Elite', 'Smart', 'Mini']
  const products = []
  const imageList = (categorySlug && PRODUCT_IMAGES[categorySlug]) || DEFAULT_IMAGES

  // Seeded random for consistent results — use slug hash
  const seed = (categorySlug || 'default').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  let rng = seed
  const nextRng = () => { rng = (rng * 16807 + 0) % 2147483647; return rng / 2147483647 }

  // Weighted distribution: pick ~60% of subcategories to have products (simulates real marketplace)
  const allSubs = category.subcategories
  const numActiveSubs = Math.max(3, Math.floor(allSubs.length * 0.6))
  const shuffled = [...allSubs].sort(() => nextRng() - 0.5)
  const activeSubs = shuffled.slice(0, numActiveSubs)

  // Assign weights: some subcategories are more popular than others
  const weights = activeSubs.map(() => Math.max(0.3, nextRng()))
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  for (let i = 0; i < count; i++) {
    // Pick subcategory by weight
    let r = nextRng() * totalWeight
    let subIdx = 0
    for (let j = 0; j < weights.length; j++) {
      r -= weights[j]
      if (r <= 0) { subIdx = j; break }
    }
    const sub = activeSubs[subIdx]

    const price = Math.round((nextRng() * 500 + 15) * 100) / 100
    const discount = nextRng() > 0.4 ? Math.floor(nextRng() * 40) + 5 : 0
    const oldPrice = discount > 0 ? Math.round(price / (1 - discount / 100) * 100) / 100 : null
    products.push({
      id: i + 1,
      name: `${adjectives[i % adjectives.length]} ${sub.name} ${i + 1}`,
      brand: BRANDS[i % BRANDS.length],
      price,
      oldPrice,
      discount,
      rating: Math.round((nextRng() * 1.5 + 3.5) * 10) / 10,
      reviews: Math.floor(nextRng() * 2000) + 50,
      emoji: EMOJIS[i % EMOJIS.length],
      image: imageList[i % imageList.length],
      badge: i < 2 ? 'Más vendido' : i === 3 ? 'Oferta' : null,
      subcategoryId: sub.id,
      subcategoryName: sub.name,
    })
  }
  return products
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  const [sortBy, setSortBy] = useState('relevancia')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState(0)

  const handleAddToCart = (e: React.MouseEvent, product: { id: any; name: string; price: number }) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id: String(product.id), name: product.name, price: product.price })
    setAddedToCart(String(product.id))
    setTimeout(() => setAddedToCart(null), 1500)
  }

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [searchInCategory, setSearchInCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 24

  const category = CATEGORIES[slug]

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-3xl font-extrabold text-black mb-2">Categoría no encontrada</h1>
          <p className="text-gray-600 mb-6">La categoría que buscas no existe</p>
          <Link href="/categorias" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-3xl hover:bg-blue-700 transition-all duration-200" style={{ backgroundColor: '#0066FF' }}>
            <ArrowLeft className="w-4 h-4" /> Ver todas las categorías
          </Link>
        </div>
      </div>
    )
  }

  const allProducts = useMemo(() => generateProducts(category, 48, slug), [slug])

  // Compute subcategory counts from actual products — only show subcategories that have products
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allProducts.forEach(p => {
      counts[p.subcategoryId] = (counts[p.subcategoryId] || 0) + 1
    })
    return counts
  }, [allProducts])

  const activeSubcategories = useMemo(() => {
    return category.subcategories.filter(sub => (subcategoryCounts[sub.id] || 0) > 0)
  }, [category.subcategories, subcategoryCounts])

  // Apply filters
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Subcategory
    if (selectedSub) {
      result = result.filter(p => p.subcategoryId === selectedSub)
    }

    // Search within category
    if (searchInCategory) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchInCategory.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchInCategory.toLowerCase())
      )
    }

    // Price
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice)

    // Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating)
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand))
    }

    // Sort
    switch (sortBy) {
      case 'precio-asc': result.sort((a, b) => a.price - b.price); break
      case 'precio-desc': result.sort((a, b) => b.price - a.price); break
      case 'valoracion': result.sort((a, b) => b.rating - a.rating); break
      case 'novedades': result.sort((a, b) => b.id - a.id); break
    }

    return result
  }, [allProducts, selectedSub, searchInCategory, minPrice, maxPrice, minRating, selectedBrands, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedSub(null)
    setMinPrice(0)
    setMaxPrice(1000)
    setMinRating(0)
    setSelectedBrands([])
    setSearchInCategory('')
    setSortBy('relevancia')
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedSub || minPrice > 0 || maxPrice < 1000 || minRating > 0 || selectedBrands.length > 0 || searchInCategory

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-black transition-colors duration-200">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/categorias" className="hover:text-black transition-colors duration-200">Categorías</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-black font-medium">{category.name}</span>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-black flex-shrink-0" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              {category.icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black">{category.name}</h1>
              <p className="text-gray-600 mt-1">{category.description}</p>
              <p className="text-gray-500 text-sm mt-1">{allProducts.length} productos · {activeSubcategories.length} subcategorías</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Subcategories — wrap grid on desktop and mobile */}
        <div className="flex flex-wrap gap-2 pb-4 mb-4">
          <button
            onClick={() => { setSelectedSub(null); setCurrentPage(1); }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              !selectedSub ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={!selectedSub ? { backgroundColor: '#0066FF' } : {}}
          >
            Todos ({allProducts.length})
          </button>
          {activeSubcategories.map(sub => (
            <button
              key={sub.id}
              onClick={() => { setSelectedSub(selectedSub === sub.id ? null : sub.id); setCurrentPage(1); }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                selectedSub === sub.id ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedSub === sub.id ? { backgroundColor: '#0066FF' } : {}}
            >
              {sub.name} ({subcategoryCounts[sub.id] || 0})
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-gray-50 rounded-3xl p-5 sticky top-20 space-y-5" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-black flex items-center gap-2" style={{ color: '#0066FF' }}>
                  <SlidersHorizontal className="w-4 h-4" /> Filtros
                </h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-[10px] font-bold underline transition-colors duration-200 hover:opacity-60" style={{ color: '#0066FF' }}>
                    Limpiar
                  </button>
                )}
              </div>

              {/* Search within category */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder={`Buscar en ${category.name}...`}
                  value={searchInCategory}
                  onChange={(e) => { setSearchInCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-black placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-black">Precio</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">€</span>
                    <input
                      type="number" value={minPrice}
                      onChange={(e) => { setMinPrice(Math.max(0, parseInt(e.target.value) || 0)); setCurrentPage(1); }}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-5 pr-1 py-1.5 text-xs text-black focus:border-blue-600 focus:outline-none transition-all duration-200"
                    />
                  </div>
                  <span className="text-gray-500 text-xs">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">€</span>
                    <input
                      type="number" value={maxPrice}
                      onChange={(e) => { setMaxPrice(Math.max(0, parseInt(e.target.value) || 1000)); setCurrentPage(1); }}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-5 pr-1 py-1.5 text-xs text-black focus:border-blue-600 focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>
                <input
                  type="range" min="0" max="1000" step="10" value={maxPrice}
                  onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setCurrentPage(1); }}
                  className="w-full mt-2"
                  style={{ accentColor: '#0066FF' }}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-black">Valoración</label>
                <div className="space-y-1">
                  {[4, 3, 2].map(stars => (
                    <button
                      key={stars}
                      onClick={() => { setMinRating(minRating === stars ? 0 : stars); setCurrentPage(1); }}
                      className={`flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                        minRating === stars ? 'bg-blue-100 text-black' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      style={minRating === stars ? { backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' } : {}}
                    >
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span>y más</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-black">Marca</label>
                <div className="space-y-1">
                  {BRANDS.slice(0, 6).map(brand => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                        selectedBrands.includes(brand)
                          ? 'bg-blue-100 text-black'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      style={selectedBrands.includes(brand) ? { backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' } : {}}
                    >
                      <input type="checkbox" checked={selectedBrands.includes(brand)} readOnly className="w-3 h-3 rounded" style={{ accentColor: '#0066FF' }} />
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 mb-5 bg-gray-50 rounded-3xl px-4 py-3 transition-all duration-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-70"
                  style={{ color: '#0066FF' }}
                >
                  <Filter className="w-4 h-4" /> Filtros
                </button>
                <p className="text-sm text-gray-600 flex-shrink-0">
                  <span className="font-bold text-black">{filteredProducts.length}</span> productos
                  {selectedSub && (
                    <span className="ml-2 hidden sm:inline" style={{ color: '#0066FF' }}>
                      en {activeSubcategories.find(s => s.id === selectedSub)?.name}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="text-xs sm:text-sm bg-white border border-gray-200 rounded-xl px-2 sm:px-3 py-1.5 text-black focus:outline-none focus:border-[#0066FF] transition-all duration-200"
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="valoracion">Mejor valorados</option>
                    <option value="novedades">Novedades</option>
                  </select>
                </div>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-2 transition-all duration-200 ${viewMode === 'grid' ? 'text-white' : 'bg-white text-gray-600 hover:text-black'}`} style={viewMode === 'grid' ? { backgroundColor: '#0066FF' } : {}}>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 transition-all duration-200 ${viewMode === 'list' ? 'text-white' : 'bg-white text-gray-600 hover:text-black'}`} style={viewMode === 'list' ? { backgroundColor: '#0066FF' } : {}}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                {selectedSub && (
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-black rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200" style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' }}>
                    <span className="truncate">{activeSubcategories.find(s => s.id === selectedSub)?.name}</span>
                    <button onClick={() => setSelectedSub(null)} className="hover:opacity-60 transition-opacity duration-200 flex-shrink-0"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrands.map(b => (
                  <span key={b} className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-black rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200" style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' }}>
                    <span className="truncate">{b}</span>
                    <button onClick={() => toggleBrand(b)} className="hover:opacity-60 transition-opacity duration-200 flex-shrink-0"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-black rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200" style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' }}>
                    {minRating}+ ⭐
                    <button onClick={() => setMinRating(0)} className="hover:opacity-60 transition-opacity duration-200 flex-shrink-0"><X className="w-3 h-3" /></button>
                  </span>
                )}
                {(minPrice > 0 || maxPrice < 1000) && (
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-black rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200" style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' }}>
                    €{minPrice}-{maxPrice}
                    <button onClick={() => { setMinPrice(0); setMaxPrice(1000); }} className="hover:opacity-60 transition-opacity duration-200 flex-shrink-0"><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-[11px] sm:text-xs font-bold underline px-1 sm:px-2 py-0.5 sm:py-1 transition-all duration-200 hover:opacity-60 flex-shrink-0" style={{ color: '#0066FF' }}>
                  Limpiar
                </button>
              </div>
            )}

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>
                {paginatedProducts.map(product => (
                  <Link
                    key={product.id}
                    href={`/productos/${slug}-${product.id}`}
                    className={viewMode === 'grid'
                      ? 'group bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]'
                      : 'group flex gap-4 bg-white rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]'
                    }
                    style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                          ) : (
                            <div className="text-5xl group-hover:scale-110 transition-transform duration-200">{product.emoji}</div>
                          )}
                          {product.badge && (
                            <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-400 text-white" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                              {product.badge}
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                              -{product.discount}%
                            </span>
                          )}
                          <button onClick={(e) => handleToggleFavorite(e, String(product.id))} className="absolute bottom-2.5 right-2.5 p-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                            <Heart className={`w-4 h-4 ${isFavorite(String(product.id)) ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                          </button>
                        </div>
                        <div className="p-2 sm:p-3.5">
                          <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide transition-colors duration-200" style={{ color: '#0066FF' }}>{product.brand}</p>
                          <h3 className="font-extrabold text-xs sm:text-sm text-black mt-1 line-clamp-2 leading-snug">{product.name}</h3>
                          <p className="text-[9px] sm:text-[10px] text-gray-600 mt-1">{product.subcategoryName}</p>
                          <div className="flex items-center gap-1 mt-1 sm:mt-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2 sm:w-3 h-2 sm:h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-[8px] sm:text-[10px] text-gray-500">({product.reviews})</span>
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-2">
                            <span className="font-extrabold text-base sm:text-lg text-black">{'\u20AC'}{product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                              <span className="text-[9px] sm:text-xs text-gray-500 line-through">{'\u20AC'}{product.oldPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <button onClick={(e) => handleAddToCart(e, product)} className="mt-2 sm:mt-3 w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all duration-200" style={{ backgroundColor: addedToCart === String(product.id) ? '#22c55e' : '#0066FF', boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                            {addedToCart === String(product.id) ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Agregado
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" /> Añadir
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">{product.emoji}</span>
                          )}
                          {product.discount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-extrabold uppercase transition-colors duration-200" style={{ color: '#0066FF' }}>{product.brand}</p>
                          <h3 className="font-extrabold text-black mt-0.5">{product.name}</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{product.subcategoryName}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-extrabold text-xl text-black">{'\u20AC'}{product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                              <span className="text-sm text-gray-500 line-through">{'\u20AC'}{product.oldPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col gap-2 self-center">
                          <button onClick={(e) => handleAddToCart(e, product)} className={`px-4 py-2.5 text-white font-extrabold rounded-2xl text-sm transition-all duration-200`} style={{ backgroundColor: addedToCart === String(product.id) ? '#22c55e' : '#0066FF', boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                            {addedToCart === String(product.id) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                          </button>
                          <button onClick={(e) => handleToggleFavorite(e, String(product.id))} className={`px-4 py-2.5 border text-black rounded-2xl text-sm transition-all duration-200 ${isFavorite(String(product.id)) ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`} style={isFavorite(String(product.id)) ? { boxShadow: '0 2px 40px rgba(0,0,0,0.04)' } : { boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                            <Heart className={`w-4 h-4 ${isFavorite(String(product.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                      </>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-extrabold text-black mb-2">No se encontraron productos</h2>
                <p className="text-gray-600 mb-6">Prueba con otros filtros o busca en otra subcategoría</p>
                <button onClick={clearFilters} className="px-6 py-2.5 text-white font-extrabold rounded-3xl transition-all duration-200 hover:opacity-80" style={{ backgroundColor: '#0066FF', boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-30 text-xs sm:text-sm font-bold text-black bg-white"
                  style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
                >
                  <span className="hidden sm:inline">← Anterior</span>
                  <span className="sm:hidden">←</span>
                </button>
                {Array.from({ length: Math.min(totalPages <= 5 ? totalPages : 3, totalPages) }).map((_, i) => {
                  let page: number
                  if (totalPages <= 5) page = i + 1
                  else if (currentPage <= 2) page = i + 1
                  else if (currentPage >= totalPages - 1) page = totalPages - 2 + i
                  else page = currentPage - 1 + i
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                        currentPage === page ? 'text-white' : 'bg-white text-black hover:bg-gray-100 border border-gray-200'
                      }`}
                      style={currentPage === page ? { backgroundColor: '#0066FF', boxShadow: '0 2px 40px rgba(0,0,0,0.04)' } : { boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-30 text-xs sm:text-sm font-bold text-black bg-white"
                  style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
                >
                  <span className="hidden sm:inline">Siguiente →</span>
                  <span className="sm:hidden">→</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 lg:hidden z-50 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 transition-opacity duration-200"
              onClick={() => setShowFilters(false)}
            />
            {/* Slide panel */}
            <div className="relative ml-auto w-full max-w-sm bg-white rounded-l-3xl overflow-y-auto flex flex-col max-h-screen" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-sm font-bold text-black flex items-center gap-2" style={{ color: '#0066FF' }}>
                  <SlidersHorizontal className="w-4 h-4" /> Filtros
                </h3>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:opacity-60 transition-opacity duration-200">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Search within category */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={`Buscar en ${category.name}...`}
                    value={searchInCategory}
                    onChange={(e) => { setSearchInCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-black placeholder-gray-500 focus:border-[#0066FF] focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold mb-2 text-black">Precio</label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">€</span>
                      <input
                        type="number" value={minPrice}
                        onChange={(e) => { setMinPrice(Math.max(0, parseInt(e.target.value) || 0)); setCurrentPage(1); }}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-5 pr-1 py-1.5 text-xs text-black focus:border-blue-600 focus:outline-none transition-all duration-200"
                      />
                    </div>
                    <span className="text-gray-500 text-xs">—</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">€</span>
                      <input
                        type="number" value={maxPrice}
                        onChange={(e) => { setMaxPrice(Math.max(0, parseInt(e.target.value) || 1000)); setCurrentPage(1); }}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-5 pr-1 py-1.5 text-xs text-black focus:border-blue-600 focus:outline-none transition-all duration-200"
                      />
                    </div>
                  </div>
                  <input
                    type="range" min="0" max="1000" step="10" value={maxPrice}
                    onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setCurrentPage(1); }}
                    className="w-full mt-2"
                    style={{ accentColor: '#0066FF' }}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-semibold mb-2 text-black">Valoración</label>
                  <div className="space-y-1">
                    {[4, 3, 2].map(stars => (
                      <button
                        key={stars}
                        onClick={() => { setMinRating(minRating === stars ? 0 : stars); setCurrentPage(1); }}
                        className={`flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                          minRating === stars ? 'bg-blue-100 text-black' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        style={minRating === stars ? { backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' } : {}}
                      >
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span>y más</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-xs font-semibold mb-2 text-black">Marca</label>
                  <div className="space-y-1">
                    {BRANDS.slice(0, 6).map(brand => (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                          selectedBrands.includes(brand)
                            ? 'bg-blue-100 text-black'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                        style={selectedBrands.includes(brand) ? { backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066FF' } : {}}
                      >
                        <input type="checkbox" checked={selectedBrands.includes(brand)} readOnly className="w-3 h-3 rounded" style={{ accentColor: '#0066FF' }} />
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with action buttons */}
              <div className="border-t border-gray-200 p-4 space-y-2 flex-shrink-0">
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="w-full text-xs font-bold px-4 py-2 text-center underline transition-colors duration-200 hover:opacity-60" style={{ color: '#0066FF' }}>
                    Limpiar filtros
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="w-full py-2.5 text-white font-extrabold rounded-2xl transition-all duration-200" style={{ backgroundColor: '#0066FF', boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
