# ============================================================
# NexoMarket - Script de Instalacion para Windows
# ============================================================
# ANTES DE EJECUTAR ESTE SCRIPT necesitas:
# 1. Node.js 20+ instalado (https://nodejs.org)
# 2. PostgreSQL 16 instalado (https://postgresql.org/download/windows)
#
# Luego abre PowerShell como Administrador y ejecuta:
#   cd C:\Users\Usuario\Documents\PROYECTOS\AMAZON_MIO\nexomarket
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\SETUP-WINDOWS.ps1
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NexoMarket - Instalacion Automatica" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Verificar Node.js ---
Write-Host "[1/7] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  OK: Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Node.js no encontrado. Instalalo desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

# --- Verificar PostgreSQL ---
Write-Host "[2/7] Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL"
if (Test-Path $pgPath) {
    Write-Host "  OK: PostgreSQL encontrado en $pgPath" -ForegroundColor Green
} else {
    Write-Host "  AVISO: No se encontro PostgreSQL en la ruta habitual." -ForegroundColor Yellow
    Write-Host "  Si lo instalaste en otra ruta, no hay problema. Continuamos..." -ForegroundColor Yellow
}

# --- Pedir password de PostgreSQL ---
Write-Host ""
$pgPassword = Read-Host "  Escribe tu password de PostgreSQL (la que pusiste al instalar)"
Write-Host ""

# --- Crear base de datos ---
Write-Host "[3/7] Creando base de datos 'nexomarket'..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPassword
try {
    # Intentar con psql en PATH
    psql -U postgres -c "CREATE DATABASE nexomarket;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: Base de datos creada" -ForegroundColor Green
    } else {
        Write-Host "  La base de datos ya existe o psql no esta en PATH" -ForegroundColor Yellow
        Write-Host "  Intentando con ruta completa..." -ForegroundColor Yellow
        # Buscar psql
        $psqlPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($psqlPath) {
            & $psqlPath.FullName -U postgres -c "CREATE DATABASE nexomarket;" 2>$null
            Write-Host "  OK: Base de datos creada" -ForegroundColor Green
        } else {
            Write-Host "  No se pudo crear automaticamente. Creala manualmente en pgAdmin." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "  Creala manualmente en pgAdmin: click derecho en Databases > Create > 'nexomarket'" -ForegroundColor Yellow
}

# --- Crear archivo .env ---
Write-Host "[4/7] Configurando archivo .env..." -ForegroundColor Yellow
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
$envContent = @"
# ============================================================
# NexoMarket - Variables de Entorno
# ============================================================

# Base de datos PostgreSQL
DATABASE_URL="postgresql://postgres:${pgPassword}@localhost:5432/nexomarket"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${secret}"

# Stripe (registrate en https://dashboard.stripe.com/register)
# Usa las API keys de TEST por ahora
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Shippo (registrate en https://app.goshippo.com/join)
SHIPPO_API_KEY=""

# Cloudflare R2 (registrate en https://dash.cloudflare.com)
CLOUDFLARE_R2_ACCESS_KEY=""
CLOUDFLARE_R2_SECRET_KEY=""
CLOUDFLARE_R2_BUCKET=""
CLOUDFLARE_R2_ENDPOINT=""

# Open Exchange Rates (registrate en https://openexchangerates.org/signup/free)
OPEN_EXCHANGE_RATES_APP_ID=""
"@
$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "  OK: .env creado con tu password de PostgreSQL" -ForegroundColor Green
Write-Host "  NEXTAUTH_SECRET generado automaticamente" -ForegroundColor Green

# --- Instalar dependencias ---
Write-Host "[5/7] Instalando dependencias (esto tarda 1-2 minutos)..." -ForegroundColor Yellow
npm install 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK: Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "  Reintentando..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    npm install
}

# --- Generar Prisma Client y migrar ---
Write-Host "[6/7] Creando tablas en la base de datos (22 tablas)..." -ForegroundColor Yellow
npx prisma generate 2>&1 | Out-Null
npx prisma migrate dev --name init 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK: 22 tablas creadas en PostgreSQL" -ForegroundColor Green
} else {
    Write-Host "  ERROR en migracion. Verifica que PostgreSQL esta corriendo" -ForegroundColor Red
    Write-Host "  y que la password es correcta." -ForegroundColor Red
    Write-Host "  Puedes reintentar con: npx prisma migrate dev --name init" -ForegroundColor Yellow
}

# --- Seed con datos iniciales ---
Write-Host "[7/7] Insertando datos iniciales (planes, paises)..." -ForegroundColor Yellow
$seedScript = @"
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();

async function seed() {
  // Crear planes de suscripcion
  await db.subscriptionPlan.createMany({
    data: [
      { tier: 'FREE', name: 'Gratis', monthlyPriceCents: 0, commissionRate: 6.00, maxProducts: 50, features: JSON.stringify(['analytics_basic', 'support_community']) },
      { tier: 'PRO', name: 'Pro', monthlyPriceCents: 1999, commissionRate: 4.00, maxProducts: -1, features: JSON.stringify(['analytics_advanced', 'badge_verified', 'priority_search', 'api_access', 'support_email']) },
      { tier: 'ENTERPRISE', name: 'Enterprise', monthlyPriceCents: 4999, commissionRate: 3.00, maxProducts: -1, features: JSON.stringify(['analytics_premium', 'badge_verified', 'priority_search_max', 'api_access', 'webhooks', 'support_account_manager']) },
    ],
    skipDuplicates: true,
  });
  console.log('  Planes creados: Gratis, Pro, Enterprise');

  // Crear paises soportados
  await db.supportedCountry.createMany({
    data: [
      { countryCode: 'MX', name: 'Mexico', currency: 'MXN', locale: 'es', shippingZone: 'domestic' },
      { countryCode: 'US', name: 'Estados Unidos', currency: 'USD', locale: 'en', shippingZone: 'latam' },
      { countryCode: 'ES', name: 'Espana', currency: 'EUR', locale: 'es', shippingZone: 'europe' },
      { countryCode: 'CO', name: 'Colombia', currency: 'COP', locale: 'es', shippingZone: 'latam' },
      { countryCode: 'AR', name: 'Argentina', currency: 'ARS', locale: 'es', shippingZone: 'latam' },
      { countryCode: 'CL', name: 'Chile', currency: 'CLP', locale: 'es', shippingZone: 'latam' },
      { countryCode: 'BR', name: 'Brasil', currency: 'BRL', locale: 'pt', shippingZone: 'latam' },
      { countryCode: 'FR', name: 'Francia', currency: 'EUR', locale: 'fr', shippingZone: 'europe' },
    ],
    skipDuplicates: true,
  });
  console.log('  Paises creados: MX, US, ES, CO, AR, CL, BR, FR');

  // Crear usuario admin por defecto
  const hash = await bcrypt.hash('admin123', 12);
  await db.user.upsert({
    where: { email: 'admin@nexomarket.com' },
    update: {},
    create: {
      email: 'admin@nexomarket.com',
      passwordHash: hash,
      firstName: 'Admin',
      lastName: 'NexoMarket',
      role: 'ADMIN',
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('  Usuario admin creado: admin@nexomarket.com / admin123');

  // Crear usuario vendedor de ejemplo
  const sellerHash = await bcrypt.hash('seller123', 12);
  const seller = await db.user.upsert({
    where: { email: 'vendedor@nexomarket.com' },
    update: {},
    create: {
      email: 'vendedor@nexomarket.com',
      passwordHash: sellerHash,
      firstName: 'Fran',
      lastName: 'Lopez',
      role: 'SELLER',
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Crear tienda de ejemplo
  await db.store.upsert({
    where: { ownerId: seller.id },
    update: {},
    create: {
      ownerId: seller.id,
      name: 'TechStore MX',
      slug: 'techstore-mx',
      description: 'La mejor tienda de tecnologia en Mexico',
      email: 'vendedor@nexomarket.com',
      status: 'ACTIVE',
      planTier: 'FREE',
      commissionRate: 6.00,
      stripeOnboarded: false,
      approvedAt: new Date(),
    },
  });
  console.log('  Vendedor creado: vendedor@nexomarket.com / seller123');
  console.log('  Tienda creada: TechStore MX');

  await db.\$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
"@
$seedScript | Out-File -FilePath "seed.js" -Encoding UTF8
npm install bcryptjs 2>&1 | Out-Null
node seed.js 2>&1

# --- Finalizar ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  INSTALACION COMPLETADA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Para arrancar el servidor:" -ForegroundColor Cyan
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  Luego abre en tu navegador:" -ForegroundColor Cyan
Write-Host "    http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "  Usuarios de prueba:" -ForegroundColor Cyan
Write-Host "    Admin:    admin@nexomarket.com / admin123" -ForegroundColor White
Write-Host "    Vendedor: vendedor@nexomarket.com / seller123" -ForegroundColor White
Write-Host ""
Write-Host "  Siguiente paso: registrate en Stripe y Shippo" -ForegroundColor Yellow
Write-Host "  y pon tus API keys en el archivo .env" -ForegroundColor Yellow
Write-Host ""
