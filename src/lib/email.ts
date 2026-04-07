import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'NexoMarket <noreply@gestordehogar.com>';

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="background:#0066FF;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">NexoMarket</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="margin:0 0 16px;color:#000000;font-size:22px;font-weight:700;">${title}</h2>
        ${body}
      </div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;">NexoMarket - Tu marketplace de confianza</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Bienvenido a NexoMarket',
      html: baseTemplate(
        `Hola ${name}, bienvenido!`,
        `<p style="color:#4a4a4a;line-height:1.6;">Gracias por registrarte en NexoMarket. Tu cuenta ha sido creada exitosamente.</p>
         <p style="color:#4a4a4a;line-height:1.6;">Ya puedes explorar miles de productos de vendedores verificados.</p>
         <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexomarket.com'}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0066FF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Explorar NexoMarket</a>`
      ),
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

export async function sendOrderConfirmation(
  to: string,
  name: string,
  orderId: string,
  items: { name: string; quantity: number; price: number }[],
  total: number
) {
  try {
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;">${item.name}</td>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#374151;text-align:right;">$${item.price.toFixed(2)}</td>
          </tr>`
      )
      .join('');

    await resend.emails.send({
      from: FROM,
      to,
      subject: `Pedido confirmado #${orderId}`,
      html: baseTemplate(
        `Pedido confirmado`,
        `<p style="color:#4a4a4a;line-height:1.6;">Hola ${name}, tu pedido <strong>#${orderId}</strong> ha sido recibido.</p>
         <table style="width:100%;border-collapse:collapse;margin:16px 0;">
           <thead>
             <tr style="border-bottom:2px solid #e5e7eb;">
               <th style="padding:8px 0;text-align:left;color:#000;font-size:14px;">Producto</th>
               <th style="padding:8px 0;text-align:center;color:#000;font-size:14px;">Cant.</th>
               <th style="padding:8px 0;text-align:right;color:#000;font-size:14px;">Precio</th>
             </tr>
           </thead>
           <tbody>${itemsHtml}</tbody>
           <tfoot>
             <tr>
               <td colspan="2" style="padding:12px 0;font-weight:700;color:#000;">Total</td>
               <td style="padding:12px 0;font-weight:700;color:#000;text-align:right;">$${total.toFixed(2)}</td>
             </tr>
           </tfoot>
         </table>
         <p style="color:#4a4a4a;line-height:1.6;">Te notificaremos cuando tu pedido sea enviado.</p>`
      ),
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}

export async function sendOrderStatusUpdate(
  to: string,
  name: string,
  orderId: string,
  status: string
) {
  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Confirmado',
    PROCESSING: 'En proceso',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  const label = statusLabels[status] || status;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Pedido #${orderId} - ${label}`,
      html: baseTemplate(
        `Actualizacion de pedido`,
        `<p style="color:#4a4a4a;line-height:1.6;">Hola ${name}, tu pedido <strong>#${orderId}</strong> ha cambiado de estado.</p>
         <div style="margin:16px 0;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #0066FF;">
           <p style="margin:0;font-size:18px;font-weight:700;color:#000;">${label}</p>
         </div>
         <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexomarket.com'}/es/mi-cuenta/pedidos" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0066FF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Ver mi pedido</a>`
      ),
    });
  } catch (error) {
    console.error('Error sending order status email:', error);
  }
}

export async function sendNewOrderToSeller(
  to: string,
  storeName: string,
  orderId: string,
  total: number
) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Nuevo pedido #${orderId} en ${storeName}`,
      html: baseTemplate(
        `Nuevo pedido recibido`,
        `<p style="color:#4a4a4a;line-height:1.6;">Tu tienda <strong>${storeName}</strong> ha recibido un nuevo pedido.</p>
         <div style="margin:16px 0;padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e;">
           <p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Pedido #${orderId}</p>
           <p style="margin:0;font-size:24px;font-weight:700;color:#000;">$${total.toFixed(2)}</p>
         </div>
         <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nexomarket.com'}/es/vendedor/pedidos" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0066FF;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">Ver pedidos</a>`
      ),
    });
  } catch (error) {
    console.error('Error sending new order to seller email:', error);
  }
}
