# NexoMarket Setup Instructions

Complete guide to setting up and running the NexoMarket marketplace platform locally and deploying to production.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** 20.x or later ([Download](https://nodejs.org))
- **npm** 10.x or later (comes with Node.js)
- **PostgreSQL** 16.x or later ([Download](https://www.postgresql.org/download))
- **Redis** 7.x or later ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com))

### System Requirements

- **OS**: Linux, macOS, or Windows (with WSL2 recommended)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 5GB
- **Port Availability**:
  - 3000 (Next.js development server)
  - 3001 (API server)
  - 5432 (PostgreSQL)
  - 6379 (Redis)

### Accounts Required

- GitHub account (for cloning the repository)
- Stripe account (for payment processing)
- AWS S3 account (for image storage)
- Vercel account (for deployment)
- Railway account (for database hosting)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/nexomarket/nexomarket.git
cd nexomarket
```

### 2. Install Dependencies

Install Node.js dependencies for the main application:

```bash
npm install
```

If you have workspace packages, install all dependencies:

```bash
npm install --workspaces
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NexoMarket

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nexomarket
SHADOW_DATABASE_URL=postgresql://user:password@localhost:5432/nexomarket_shadow

# Redis
REDIS_URL=redis://localhost:6379
REDIS_AUTH_TOKEN=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this
REFRESH_TOKEN_EXPIRATION=30d

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=nexomarket-dev
AWS_S3_URL=https://nexomarket-dev.s3.amazonaws.com

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@nexomarket.com

# Admin
ADMIN_EMAIL=admin@nexomarket.com
ADMIN_PASSWORD=change-me-in-production

# API Keys
API_RATE_LIMIT_PRO=100
API_RATE_LIMIT_ENTERPRISE=500

# Features
ENABLE_SELLER_API=true
ENABLE_WEBHOOKS=true
ENABLE_ANALYTICS=true

# External Services
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx

# Logging
LOG_LEVEL=info
```

**Important**:
- Replace placeholder values with your actual credentials
- Never commit `.env.local` to version control
- Use strong, unique secrets for JWT keys in production
- Keep all sensitive data secure

### 4. Set Up PostgreSQL Database

#### On Linux/macOS

```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Create database user
sudo -u postgres createuser -P nexomarket_user
# When prompted, enter a secure password

# Create databases
sudo -u postgres createdb -O nexomarket_user nexomarket
sudo -u postgres createdb -O nexomarket_user nexomarket_shadow
```

#### On Windows (with PostgreSQL installed)

```bash
# Open PostgreSQL command prompt
psql -U postgres

# In PostgreSQL terminal:
CREATE USER nexomarket_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE nexomarket OWNER nexomarket_user;
CREATE DATABASE nexomarket_shadow OWNER nexomarket_user;
\q
```

#### Verify Connection

```bash
psql -h localhost -U nexomarket_user -d nexomarket
# If connection succeeds, exit with \q
```

### 5. Set Up Redis

#### On Linux

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Verify installation
redis-cli ping
# Should return: PONG
```

#### On macOS (with Homebrew)

```bash
# Install Redis
brew install redis

# Start Redis
brew services start redis

# Verify installation
redis-cli ping
# Should return: PONG
```

#### On Windows

Download Redis from [Windows Release](https://github.com/microsoftarchive/redis/releases) and follow installation instructions, or use Docker:

```bash
docker run -d -p 6379:6379 redis:7-alpine
redis-cli ping
# Should return: PONG
```

### 6. Run Database Migrations

Apply all pending database migrations:

```bash
npx prisma migrate deploy
```

If you're setting up for the first time or have new migrations:

```bash
npx prisma migrate dev
```

Verify the schema was applied:

```bash
npx prisma db push
```

### 7. Seed the Database

Populate the database with sample data:

```bash
npx prisma db seed
```

This will create:
- Sample product categories
- Sample products (electronics, clothing, home goods)
- Sample users and sellers
- Sample orders
- Sample reviews

To seed with custom data, edit `prisma/seed.ts` before running the seed command.

### 8. Generate Prisma Client

Generate the Prisma client for TypeScript support:

```bash
npx prisma generate
```

### 9. Start Development Environment

You can run the full stack with a single command:

```bash
npm run dev
```

This starts:
- Next.js development server on http://localhost:3000
- API server on http://localhost:3001 (if separate backend)
- Database migrations (if needed)

Or start individual services:

```bash
# Terminal 1: Frontend
npm run dev:web

# Terminal 2: API Server (if separate)
npm run dev:api

# Terminal 3: Database
npm run db:studio
```

### 10. Verify Setup

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3001/health
- **Database Studio**: http://localhost:5555

Test the setup:

```bash
# Test API
curl http://localhost:3001/api/v1/health

# Test database connection
npx prisma studio

# View database contents
psql -h localhost -U nexomarket_user -d nexomarket
```

---

## Development Workflow

### File Structure

```
nexomarket/
├── app/                      # Next.js 13+ app directory
│   ├── api/                  # API routes
│   ├── (auth)/               # Authentication pages
│   ├── (dashboard)/          # Dashboard pages
│   ├── (marketplace)/        # Marketplace pages
│   └── layout.tsx
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   ├── forms/                # Form components
│   └── layout/               # Layout components
├── lib/                       # Utilities and helpers
│   ├── api.ts               # API client
│   ├── auth.ts              # Authentication
│   └── validators.ts        # Data validation
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma        # Data models
│   ├── migrations/          # Migration files
│   └── seed.ts              # Seed script
├── public/                   # Static assets
├── styles/                   # Global styles
├── .env.local               # Environment variables (local)
├── .env.example             # Environment template
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

### Common Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:web         # Start frontend only
npm run dev:api         # Start API server

# Database
npm run db:push         # Push schema to database
npm run db:pull         # Pull schema from database
npm run db:studio       # Open Prisma Studio
npm run db:migrate      # Create new migration
npm run db:seed         # Seed database

# Building
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript
npm run format          # Format code with Prettier
npm run test            # Run tests

# Docker
npm run docker:build    # Build Docker image
npm run docker:up       # Start with Docker Compose
npm run docker:down     # Stop Docker Compose
```

### Debugging

Enable debug logging:

```bash
DEBUG=* npm run dev
```

Use Node inspector:

```bash
node --inspect=9229 node_modules/.bin/next dev
```

Then open `chrome://inspect` in Chrome.

---

## Production Deployment

### Deploy to Vercel

Vercel is recommended for Next.js applications.

#### 1. Connect Repository

```bash
npm i -g vercel
vercel
```

Follow the prompts to connect your GitHub repository to Vercel.

#### 2. Set Environment Variables

In Vercel dashboard:
1. Go to **Settings** > **Environment Variables**
2. Add all variables from your `.env.local` file
3. Make sure sensitive keys are production versions

```env
# Production values
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.nexomarket.com/api/v1
DATABASE_URL=postgresql://user:pass@prod-db.railway.app:5432/nexomarket
REDIS_URL=redis://user:pass@prod-redis.railway.app:6379
JWT_SECRET=your-production-secret-key
STRIPE_SECRET_KEY=sk_live_xxx (live key)
```

#### 3. Configure Build Settings

In Vercel dashboard:
1. Go to **Settings** > **Build & Development Settings**
2. Build Command: `npm run build`
3. Output Directory: `.next`
4. Install Command: `npm install`

#### 4. Deploy

```bash
vercel --prod
```

Or push to main branch (if auto-deploy enabled):

```bash
git push origin main
```

### Deploy Database & Redis to Railway

#### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Select **PostgreSQL**

#### 2. Configure PostgreSQL

After provisioning:
1. Copy connection URL to `.env` as `DATABASE_URL`
2. Create shadow database for migrations
3. Run migrations: `npx prisma migrate deploy`

#### 3. Add Redis

1. In Railway project, click **New**
2. Select **Redis**
3. Copy connection URL to `.env` as `REDIS_URL`

#### 4. Connect from Vercel

1. Install Railway plugin in Vercel
2. Link to your Railway project
3. Environment variables sync automatically

### Alternative: Deploy with Docker

#### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app
COPY . .

# Build app
RUN npm run build

# Start app
CMD ["npm", "start"]

EXPOSE 3000
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: nexomarket
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: nexomarket
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://nexomarket:secure_password@db:5432/nexomarket
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

#### 3. Deploy with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npx prisma db seed

# View logs
docker-compose logs -f app
```

### SSL/HTTPS Configuration

1. Set up domain with DNS
2. Enable auto-renewal certificates (Vercel does this automatically)
3. Update all URLs in `.env` to use `https://`
4. Enable HSTS in next.config.js:

```javascript
headers: async () => {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        }
      ]
    }
  ];
}
```

### Performance Optimization

```bash
# Analyze bundle size
npm run analyze

# Enable compression in next.config.js
compress: true

# Enable image optimization
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
}
```

---

## Monitoring & Maintenance

### Application Monitoring

Set up monitoring tools:

```bash
# Install New Relic (optional)
npm install newrelic

# Enable in server.ts
import 'newrelic';
```

### Database Backups

#### PostgreSQL Backup

```bash
# Weekly backup
0 0 * * 0 pg_dump -h localhost -U nexomarket_user nexomarket > /backups/nexomarket_$(date +\%Y\%m\%d).sql

# Restore from backup
psql -h localhost -U nexomarket_user nexomarket < /backups/nexomarket_20260314.sql
```

#### Automated Backups on Railway

1. Go to Railway dashboard
2. Select PostgreSQL service
3. Go to **Backups** tab
4. Enable automated backups (daily recommended)

### Health Checks

```bash
# API health
curl https://api.nexomarket.com/health

# Database health
psql -h prod-db.railway.app -U user -d nexomarket -c "SELECT 1"

# Redis health
redis-cli -h prod-redis.railway.app ping
```

### Log Monitoring

View logs on Vercel:

```bash
vercel logs [deployment-url]
```

View logs on Railway:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Performance Metrics

Monitor key metrics:
- API response time (target: < 200ms)
- Database query time (target: < 100ms)
- Error rate (target: < 0.1%)
- Cache hit rate (target: > 80%)

---

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Database Connection Failed**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
psql -h localhost -U nexomarket_user -d nexomarket
```

**Redis Connection Failed**
```bash
# Check Redis is running
redis-cli ping

# If not running
redis-server
```

**Prisma Migration Issues**
```bash
# Reset database (⚠️ clears all data)
npx prisma migrate reset

# Manually resolve migration conflicts
npx prisma migrate resolve --rolled-back [migration-name]
```

**Build Failures**
```bash
# Clear cache
rm -rf .next node_modules

# Rebuild
npm install
npm run build
```

### Getting Help

- **Documentation**: https://docs.nexomarket.com
- **GitHub Issues**: https://github.com/nexomarket/nexomarket/issues
- **Community Forum**: https://forum.nexomarket.com
- **Email Support**: support@nexomarket.com
- **Discord Server**: https://discord.gg/nexomarket

---

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Set up API authentication
- [ ] Configure webhook signing
- [ ] Enable audit logging
- [ ] Set up monitoring alerts
- [ ] Document disaster recovery plan
- [ ] Test rollback procedures
- [ ] Review and lock dependencies

---

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Redis Documentation](https://redis.io/documentation)

### Tools & Services
- [Vercel Platform](https://vercel.com)
- [Railway Platform](https://railway.app)
- [Stripe Integration](https://stripe.com/docs)
- [AWS S3](https://aws.amazon.com/s3)

### Development Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Best Practices](https://react.dev/learn)

---

**Last Updated**: March 14, 2026

For the latest setup information, visit our [documentation site](https://docs.nexomarket.com/setup).
