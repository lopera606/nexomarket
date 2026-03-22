import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  vendorId?: string;
}

interface CheckoutRequest {
  items: CartItem[];
  locale?: string;
  currency?: string;
}

interface CheckoutResponse {
  url: string | null;
  sessionId?: string;
  error?: string;
}

// Supported Stripe locales
const STRIPE_LOCALES: Record<string, string> = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  pt: 'pt-BR',
  de: 'de',
  it: 'it',
  ja: 'ja',
  zh: 'zh',
  ko: 'ko',
  ar: 'ar',
};

// Supported currencies with their smallest unit multiplier
const SUPPORTED_CURRENCIES: Record<string, number> = {
  eur: 100,
  usd: 100,
  gbp: 100,
  mxn: 100,
  brl: 100,
  cop: 100,
  ars: 100,
  clp: 1, // CLP has no decimal places
  jpy: 1, // JPY has no decimal places
  krw: 1, // KRW has no decimal places
  cny: 100,
  cad: 100,
  aud: 100,
  inr: 100,
  aed: 100,
  zar: 100,
  pen: 100,
};

// All countries Stripe supports for shipping
const SHIPPING_COUNTRIES = [
  'AC','AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AT','AU','AW','AX','AZ',
  'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS',
  'BT','BV','BW','BY','BZ','CA','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO',
  'CR','CV','CW','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER',
  'ES','ET','FI','FJ','FK','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL',
  'GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HN','HR','HT','HU','ID',
  'IE','IL','IM','IN','IO','IQ','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI',
  'KM','KN','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV',
  'LY','MA','MC','MD','ME','MF','MG','MK','ML','MM','MN','MO','MQ','MR','MS','MT',
  'MU','MV','MW','MX','MY','MZ','NA','NC','NE','NG','NI','NL','NO','NP','NR','NU',
  'NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PY','QA',
  'RE','RO','RS','RU','RW','SA','SB','SC','SE','SG','SH','SI','SJ','SK','SL','SM',
  'SN','SO','SR','SS','ST','SV','SX','SZ','TA','TC','TD','TF','TG','TH','TJ','TK',
  'TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','US','UY','UZ','VA','VC',
  'VE','VG','VN','VU','WF','WS','XK','YE','YT','ZA','ZM','ZW',
] as const;

/**
 * POST /api/checkout
 * Create a Stripe Checkout Session with international support,
 * automatic invoicing and tax calculation
 */
export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate request body
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { url: null, error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Determine currency (default EUR)
    const currency = (body.currency || 'eur').toLowerCase();
    const currencyMultiplier = SUPPORTED_CURRENCIES[currency] || 100;

    // Determine Stripe locale
    const locale = STRIPE_LOCALES[body.locale || 'es'] || 'auto';

    // Validate and transform items
    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          images?: string[];
          tax_code?: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }> = [];

    for (const item of body.items) {
      if (!item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return NextResponse.json(
          { url: null, error: 'Invalid item format. Each item must have name, price, and quantity' },
          { status: 400 }
        );
      }

      if (item.price <= 0 || item.quantity <= 0) {
        return NextResponse.json(
          { url: null, error: 'Price and quantity must be positive numbers' },
          { status: 400 }
        );
      }

      // Convert price to smallest currency unit
      const unitAmount = Math.round(item.price * currencyMultiplier);

      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: item.name,
            ...(item.image && { images: [item.image] }),
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const userLocale = body.locale || 'es';

    // Create Stripe Checkout Session with invoicing + tax
    const sessionConfig: any = {
      // Accept multiple payment methods automatically based on customer country
      payment_method_types: undefined, // Let Stripe auto-detect best methods per country
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/${userLocale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${userLocale}/carrito`,

      // International shipping - all countries
      shipping_address_collection: {
        allowed_countries: SHIPPING_COUNTRIES as any,
      },

      // Automatic tax calculation - only enable if STRIPE_TAX_ENABLED is set
      // Without Stripe Tax activated in Dashboard, this causes checkout to fail
      ...(process.env.STRIPE_TAX_ENABLED === 'true' && {
        automatic_tax: { enabled: true },
      }),

      // Automatic invoice generation after payment
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `NexoMarket - Order`,
          metadata: {
            marketplace: 'NexoMarket',
            locale: userLocale,
          },
          // Footer with legal info
          footer: 'NexoMarket Global Marketplace | support@nexomarket.com | www.nexomarket.com',
          rendering_options: {
            amount_tax_display: 'include_inclusive_tax',
          },
        },
      },

      // Collect billing address for proper invoicing
      billing_address_collection: 'required',

      // Collect customer email for invoice delivery
      customer_creation: 'always',

      // Collect tax ID from business customers (VAT, GST, etc.)
      // Only if Stripe Tax is enabled
      ...(process.env.STRIPE_TAX_ENABLED === 'true' && {
        tax_id_collection: { enabled: true },
      }),

      // Phone number for shipping
      phone_number_collection: {
        enabled: true,
      },

      // Locale for the checkout page
      locale: locale as any,

      // Custom text
      custom_text: {
        submit: {
          message: locale === 'es'
            ? 'Al completar tu pedido, recibirás una factura por email automáticamente.'
            : 'You will receive an invoice by email automatically after completing your order.',
        },
      },

      // Metadata
      metadata: {
        marketplace: 'NexoMarket',
        locale: userLocale,
        currency,
      },

      // Shipping options
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount' as const,
            fixed_amount: {
              amount: 0,
              currency,
            },
            display_name: locale === 'es' ? 'Envío estándar gratuito' : 'Free standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day' as const, value: 3 },
              maximum: { unit: 'business_day' as const, value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount' as const,
            fixed_amount: {
              amount: Math.round(4.99 * currencyMultiplier),
              currency,
            },
            display_name: locale === 'es' ? 'Envío express' : 'Express shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day' as const, value: 1 },
              maximum: { unit: 'business_day' as const, value: 3 },
            },
          },
        },
      ],
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('POST /api/checkout error:', error);

    // Handle Stripe-specific errors
    if (error instanceof Error && 'type' in error) {
      const stripeError = error as any;
      if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { url: null, error: `Stripe error: ${stripeError.message}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { url: null, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
