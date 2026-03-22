/**
 * NexoMarket - Script de pruebas Stripe
 * Crea transacciones de prueba completas en Stripe test mode
 * con diferentes productos, importes y métodos de pago
 */

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: false,
});

// Test orders with different products and amounts
const TEST_ORDERS = [
  {
    id: 'ORD-2026-001',
    customer: { name: 'María García López', email: 'maria.garcia@test.com' },
    items: [
      { name: 'iPhone 15 Pro Max 256GB - Negro Titanio', price: 1399.99, qty: 1 },
      { name: 'Funda MagSafe Silicona', price: 49.99, qty: 1 },
    ],
    shipping: 0,
    description: 'Pedido iPhone + Funda',
  },
  {
    id: 'ORD-2026-002',
    customer: { name: 'Carlos Rodríguez Martín', email: 'carlos.rodriguez@test.com' },
    items: [
      { name: 'Nike Air Max 90 - Blanco/Negro Talla 43', price: 119.99, qty: 1 },
      { name: 'Nike Dunk Low Retro - Gris Talla 43', price: 89.99, qty: 1 },
      { name: 'Calcetines Nike Everyday (Pack 3)', price: 14.99, qty: 2 },
    ],
    shipping: 4.99,
    description: 'Pedido calzado deportivo',
  },
  {
    id: 'ORD-2026-003',
    customer: { name: 'Ana Fernández Ruiz', email: 'ana.fernandez@test.com' },
    items: [
      { name: 'Sony WH-1000XM5 - Plata', price: 279.99, qty: 1 },
    ],
    shipping: 0,
    description: 'Pedido auriculares Sony',
  },
  {
    id: 'ORD-2026-004',
    customer: { name: 'Javier Martínez Sánchez', email: 'javier.martinez@test.com' },
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', price: 1159.99, qty: 1 },
      { name: 'Samsung Galaxy Watch 6 Classic 47mm', price: 349.99, qty: 1 },
      { name: 'Cargador inalámbrico Samsung Duo Pad', price: 59.99, qty: 1 },
    ],
    shipping: 0,
    description: 'Pedido Samsung ecosistema',
  },
  {
    id: 'ORD-2026-005',
    customer: { name: 'Laura Pérez Gómez', email: 'laura.perez@test.com' },
    items: [
      { name: 'Dyson V15 Detect Absolute', price: 599.99, qty: 1 },
      { name: 'Dyson Pure Cool TP07 Purificador', price: 449.99, qty: 1 },
    ],
    shipping: 4.99,
    description: 'Pedido Dyson hogar',
  },
  {
    id: 'ORD-2026-006',
    customer: { name: 'Pedro López Torres', email: 'pedro.lopez@test.com' },
    items: [
      { name: 'PlayStation 5 Slim Digital Edition', price: 399.99, qty: 1 },
      { name: 'DualSense Edge Controller', price: 199.99, qty: 1 },
      { name: 'PS5 SSD Expansion 2TB Samsung 990 Pro', price: 179.99, qty: 1 },
      { name: "Marvel's Spider-Man 2 PS5", price: 69.99, qty: 1 },
    ],
    shipping: 0,
    description: 'Pedido PlayStation gaming',
  },
  {
    id: 'ORD-2026-007',
    customer: { name: 'Isabel Díaz Moreno', email: 'isabel.diaz@test.com' },
    items: [
      { name: 'Camiseta Básica Algodón Orgánico - S Blanca', price: 29.99, qty: 3 },
      { name: 'Pantalón Chino Slim Fit - 38 Azul Marino', price: 49.99, qty: 2 },
      { name: 'Zapatillas Casual Piel - 38 Marrón', price: 79.99, qty: 1 },
    ],
    shipping: 4.99,
    description: 'Pedido moda básica',
  },
];

// Stripe test payment methods
const TEST_PAYMENT_METHODS = [
  'pm_card_visa',           // Visa **** 4242
  'pm_card_mastercard',      // Mastercard **** 5556
  'pm_card_amex',           // Amex **** 0005
  'pm_card_visa_debit',     // Visa Debit **** 5556
  'pm_card_mastercard_prepaid', // MC Prepaid
  'pm_card_visa',           // Visa again
  'pm_card_mastercard',      // MC again
];

async function createTestOrder(order, paymentMethod, index) {
  try {
    // Calculate total
    const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = itemsTotal + order.shipping;
    const amountInCents = Math.round(total * 100);

    console.log(`\n📦 Pedido ${index + 1}: ${order.id}`);
    console.log(`   Cliente: ${order.customer.name} (${order.customer.email})`);
    console.log(`   Productos: ${order.items.length} artículos`);
    order.items.forEach(item => {
      console.log(`     - ${item.name} x${item.qty} = €${(item.price * item.qty).toFixed(2)}`);
    });
    console.log(`   Envío: €${order.shipping.toFixed(2)}`);
    console.log(`   Total: €${total.toFixed(2)}`);

    // 1. Create or find customer
    const customers = await stripe.customers.list({ email: order.customer.email, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        name: order.customer.name,
        email: order.customer.email,
        address: {
          line1: `Calle Test ${index + 1}, ${10 + index}`,
          city: 'Madrid',
          state: 'Madrid',
          postal_code: `280${10 + index}`,
          country: 'ES',
        },
        metadata: {
          marketplace: 'NexoMarket',
          testOrder: 'true',
        },
      });
    }

    // 2. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      customer: customer.id,
      payment_method: paymentMethod,
      description: order.description,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        orderId: order.id,
        marketplace: 'NexoMarket',
        itemCount: String(order.items.length),
        customerName: order.customer.name,
        shippingCost: String(order.shipping),
      },
      shipping: {
        name: order.customer.name,
        address: {
          line1: `Calle Test ${index + 1}, ${10 + index}`,
          city: 'Madrid',
          state: 'Madrid',
          postal_code: `280${10 + index}`,
          country: 'ES',
        },
      },
    });

    const statusEmoji = paymentIntent.status === 'succeeded' ? '✅' : '⚠️';
    console.log(`   ${statusEmoji} Pago: ${paymentIntent.status} (${paymentIntent.id})`);
    console.log(`   💳 Método: ${paymentMethod.replace('pm_card_', '')}`);

    // 3. Create invoice for the payment
    try {
      // Create invoice items
      for (const item of order.items) {
        await stripe.invoiceItems.create({
          customer: customer.id,
          amount: Math.round(item.price * item.qty * 100),
          currency: 'eur',
          description: `${item.name} (x${item.qty})`,
        });
      }

      if (order.shipping > 0) {
        await stripe.invoiceItems.create({
          customer: customer.id,
          amount: Math.round(order.shipping * 100),
          currency: 'eur',
          description: 'Envío Express',
        });
      }

      // Create and finalize invoice
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        auto_advance: true,
        collection_method: 'charge_automatically',
        metadata: {
          orderId: order.id,
          marketplace: 'NexoMarket',
        },
      });

      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
      // Pay the invoice
      const paidInvoice = await stripe.invoices.pay(finalizedInvoice.id, {
        paid_out_of_band: true,
      });

      console.log(`   🧾 Factura: ${paidInvoice.number} (${paidInvoice.status})`);
    } catch (invoiceErr) {
      console.log(`   ⚠️ Factura: ${invoiceErr.message}`);
    }

    return { success: true, paymentIntentId: paymentIntent.id, amount: total };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🛒 NexoMarket - Generador de Transacciones de Prueba');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Modo: TEST (${stripe._api.host || 'api.stripe.com'})`);
  console.log(`  Pedidos a crear: ${TEST_ORDERS.length}`);

  const results = [];

  for (let i = 0; i < TEST_ORDERS.length; i++) {
    const result = await createTestOrder(
      TEST_ORDERS[i],
      TEST_PAYMENT_METHODS[i % TEST_PAYMENT_METHODS.length],
      i
    );
    results.push(result);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════════════');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalAmount = successful.reduce((sum, r) => sum + (r.amount || 0), 0);

  console.log(`  ✅ Exitosas: ${successful.length}/${TEST_ORDERS.length}`);
  console.log(`  ❌ Fallidas: ${failed.length}/${TEST_ORDERS.length}`);
  console.log(`  💰 Total cobrado: €${totalAmount.toFixed(2)}`);
  console.log(`  📍 Dashboard: https://dashboard.stripe.com/test/payments`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (failed.length > 0) {
    console.log('Errores:');
    failed.forEach((f, i) => console.log(`  ${i + 1}. ${f.error}`));
  }
}

main().catch(console.error);
