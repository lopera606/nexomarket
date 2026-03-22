'use client';

export default function CookiesPage() {
  const lastUpdated = 'Marzo 2026';

  return (
    <article className="prose prose-sm max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mt-0 mb-3 sm:mb-4">Política de Cookies</h1>
        <p className="text-xs sm:text-sm text-[#4A4A4A] m-0">
          <strong>Última actualización:</strong> {lastUpdated}
        </p>
      </div>

      {/* Article 1 */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-black mt-4 sm:mt-6 mb-3 sm:mb-4">1. ¿Qué son las Cookies?</h2>

        <p>
          Las cookies son pequeños ficheros de texto que se descargan en su navegador cuando accede a un sitio web. Se almacenan en su dispositivo (ordenador, tablet, smartphone) y permiten a los sitios web reconocerle en futuras visitas.
        </p>

        <p>
          Las cookies no contienen virus ni software malicioso. Son totalmente inofensivas y son una tecnología estándar de Internet utilizada por prácticamente todos los sitios web.
        </p>
      </section>

      {/* Article 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">2. Tipos de Cookies que Utilizamos</h2>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.1 Cookies Técnicas o Esenciales</h3>
        <p>
          Son necesarias para el funcionamiento de la Plataforma. Sin estas cookies, el sitio no funcionaría correctamente. <strong>No requieren consentimiento.</strong>
        </p>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A] ml-4">
          <li>Identificación de sesión (SESSIONID)</li>
          <li>Autenticación de usuario (AUTH_TOKEN)</li>
          <li>Carrito de compra</li>
          <li>Preferencias de idioma</li>
          <li>Protección contra CSRF</li>
          <li>Equilibrio de carga del servidor</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.2 Cookies de Análisis o Estadísticas</h3>
        <p>
          Recopilan información sobre cómo usa la Plataforma para mejorar su funcionamiento. <strong>Requieren consentimiento previo.</strong>
        </p>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A] ml-4">
          <li>Google Analytics (ga, gid)</li>
          <li>Mixpanel (tracking de eventos)</li>
          <li>Hotjar (mapas de calor)</li>
          <li>Páginas visitadas y tiempo de permanencia</li>
          <li>Tasa de rebote y conversión</li>
          <li>Navegación por el sitio</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.3 Cookies de Marketing o Publicidad</h3>
        <p>
          Utilizadas para mostrar publicidad personalizada y medir efectividad de campañas. <strong>Requieren consentimiento previo.</strong>
        </p>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A] ml-4">
          <li>Facebook Pixel (remarketing)</li>
          <li>Google Ads (conversion tracking)</li>
          <li>LinkedIn Ads</li>
          <li>Pinterest Ads</li>
          <li>TikTok Pixel</li>
          <li>Publicidad retargeting</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.4 Cookies de Preferencias</h3>
        <p>
          Almacenan preferencias del usuario para futuras visitas. <strong>Requieren consentimiento previo.</strong>
        </p>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A] ml-4">
          <li>Tema de visualización (modo oscuro/claro)</li>
          <li>Moneda preferida</li>
          <li>Zona horaria</li>
          <li>Preferencias de notificación</li>
        </ul>
      </section>

      {/* Article 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          3. Tabla Detallada de Cookies
        </h2>

        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Nombre</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Proveedor</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Tipo</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Duración</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Propósito</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {/* Technical Cookies */}
              <tr>
                <td className="border border-gray-300 px-3 py-2">SESSIONID</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Técnica</td>
                <td className="border border-gray-300 px-3 py-2">Sesión</td>
                <td className="border border-gray-300 px-3 py-2">Identificación de sesión</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">AUTH_TOKEN</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Técnica</td>
                <td className="border border-gray-300 px-3 py-2">30 días</td>
                <td className="border border-gray-300 px-3 py-2">Autenticación usuario</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">CSRF_TOKEN</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Técnica</td>
                <td className="border border-gray-300 px-3 py-2">Sesión</td>
                <td className="border border-gray-300 px-3 py-2">Protección CSRF</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">CART_ID</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Técnica</td>
                <td className="border border-gray-300 px-3 py-2">30 días</td>
                <td className="border border-gray-300 px-3 py-2">Carrito de compra</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">locale</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Técnica</td>
                <td className="border border-gray-300 px-3 py-2">1 año</td>
                <td className="border border-gray-300 px-3 py-2">Idioma/localización</td>
              </tr>

              {/* Analytics Cookies */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">_ga</td>
                <td className="border border-gray-300 px-3 py-2">Google Analytics</td>
                <td className="border border-gray-300 px-3 py-2">Análisis</td>
                <td className="border border-gray-300 px-3 py-2">2 años</td>
                <td className="border border-gray-300 px-3 py-2">ID de usuario único</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">_gid</td>
                <td className="border border-gray-300 px-3 py-2">Google Analytics</td>
                <td className="border border-gray-300 px-3 py-2">Análisis</td>
                <td className="border border-gray-300 px-3 py-2">24 horas</td>
                <td className="border border-gray-300 px-3 py-2">ID de sesión</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">_gat</td>
                <td className="border border-gray-300 px-3 py-2">Google Analytics</td>
                <td className="border border-gray-300 px-3 py-2">Análisis</td>
                <td className="border border-gray-300 px-3 py-2">1 minuto</td>
                <td className="border border-gray-300 px-3 py-2">Limitación de tasa</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">heatmap_token</td>
                <td className="border border-gray-300 px-3 py-2">Hotjar</td>
                <td className="border border-gray-300 px-3 py-2">Análisis</td>
                <td className="border border-gray-300 px-3 py-2">Sesión</td>
                <td className="border border-gray-300 px-3 py-2">Mapas de calor</td>
              </tr>

              {/* Marketing Cookies */}
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">fbp</td>
                <td className="border border-gray-300 px-3 py-2">Facebook Pixel</td>
                <td className="border border-gray-300 px-3 py-2">Marketing</td>
                <td className="border border-gray-300 px-3 py-2">3 meses</td>
                <td className="border border-gray-300 px-3 py-2">Remarketing Facebook</td>
              </tr>
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">_gac_</td>
                <td className="border border-gray-300 px-3 py-2">Google Ads</td>
                <td className="border border-gray-300 px-3 py-2">Marketing</td>
                <td className="border border-gray-300 px-3 py-2">90 días</td>
                <td className="border border-gray-300 px-3 py-2">Conversion tracking</td>
              </tr>
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">li_sugar</td>
                <td className="border border-gray-300 px-3 py-2">LinkedIn Ads</td>
                <td className="border border-gray-300 px-3 py-2">Marketing</td>
                <td className="border border-gray-300 px-3 py-2">1 año</td>
                <td className="border border-gray-300 px-3 py-2">Remarketing LinkedIn</td>
              </tr>

              {/* Preference Cookies */}
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">theme</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Preferencia</td>
                <td className="border border-gray-300 px-3 py-2">1 año</td>
                <td className="border border-gray-300 px-3 py-2">Modo oscuro/claro</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold">currency</td>
                <td className="border border-gray-300 px-3 py-2">NexoMarket</td>
                <td className="border border-gray-300 px-3 py-2">Preferencia</td>
                <td className="border border-gray-300 px-3 py-2">1 año</td>
                <td className="border border-gray-300 px-3 py-2">Moneda preferida</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Article 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          4. Cookies de Terceros
        </h2>

        <p>
          La Plataforma contiene cookies de terceros para mejorar servicios:
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">Google Analytics</h3>
        <p>
          Google Analytics recopila datos sobre su navegación (páginas visitadas, tiempo en sitio, etc.) para análisis estadísticos. Estos datos se procesan de forma anonimizada.
        </p>
        <ul className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
          <li><strong>Privacidad:</strong> google.com/intl/es/policies/privacy</li>
          <li><strong>Opt-out:</strong> Extensión de navegador de Google</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">Stripe (Pagos)</h3>
        <p>
          Stripe coloca cookies para procesar pagos de forma segura y prevenir fraude.
        </p>
        <ul className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
          <li><strong>Privacidad:</strong> stripe.com/privacy</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">Facebook Pixel</h3>
        <p>
          Facebook Pixel rastrea conversiones y comportamiento para campañas publicitarias.
        </p>
        <ul className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
          <li><strong>Privacidad:</strong> facebook.com/policies</li>
          <li><strong>Opt-out:</strong> facebook.com/ad_choices</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">Otros Terceros</h3>
        <p>
          Integraciones con Mailchimp, Zendesk, y otras herramientas comerciales estándar también pueden establecer cookies.
        </p>
      </section>

      {/* Article 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          5. Gestión y Control de Cookies
        </h2>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">5.1 Banner de Consentimiento</h3>
        <p>
          Cuando accede por primera vez a la Plataforma, mostramos un banner solicitando su consentimiento. Puede aceptar todas las cookies o gestionar sus preferencias.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">5.2 Centro de Preferencias</h3>
        <p>
          Puede cambiar sus preferencias de cookies en cualquier momento a través del "Centro de Preferencias" en el pie de página del sitio.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">5.3 Gestión en su Navegador</h3>
        <p>
          Puede desactivar cookies directamente desde la configuración de su navegador:
        </p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 my-6 text-sm space-y-3">
          <p>
            <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
          </p>
          <p>
            <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos de sitios
          </p>
          <p>
            <strong>Safari:</strong> Preferencias → Privacidad → Administrar datos del sitio web
          </p>
          <p>
            <strong>Edge:</strong> Configuración → Privacidad → Cookies y otros datos de sitios
          </p>
        </div>

        <p>
          <strong>Advertencia:</strong> Desactivar cookies técnicas puede afectar el funcionamiento de la Plataforma (carrito, sesión, etc.).
        </p>
      </section>

      {/* Article 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          6. Consentimiento y Retracto
        </h2>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">6.1 Consentimiento Previo</h3>
        <p>
          No instalamos cookies no técnicas sin su consentimiento previo. El consentimiento es:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A] ml-4">
          <li>Libre (sin obligación)</li>
          <li>Específico (para cada tipo de cookie)</li>
          <li>Informado (entiende qué son)</li>
          <li>No vinculante (puede retractarse)</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">6.2 Retracto del Consentimiento</h3>
        <p>
          Puede revocar su consentimiento en cualquier momento a través del Centro de Preferencias o contactando a [CORREO ELECTRÓNICO DE CONTACTO].
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">6.3 Renovación Periódica</h3>
        <p>
          Le solicitaremos renovar consentimiento anualmente o cuando actualicemos esta política.
        </p>
      </section>

      {/* Article 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          7. Publicidad Personalizada
        </h2>

        <p>
          Utilizamos cookies para mostrar anuncios relevantes según sus intereses. Puede optar por no recibir publicidad personalizada:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>
            <strong>EU Digital Rights:</strong> youronlinechoices.com (para optar no participar en red de publicidad)
          </li>
          <li>
            <strong>Google Ads Settings:</strong> myaccount.google.com/data-and-privacy
          </li>
          <li>
            <strong>Facebook Ad Preferences:</strong> facebook.com/ads/preferences
          </li>
          <li>
            <strong>Network Advertising Initiative:</strong> optout.networkadvertising.org
          </li>
        </ul>

        <p>
          Si opta por no recibir publicidad personalizada, seguirá viendo anuncios, pero serán genéricos.
        </p>
      </section>

      {/* Article 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          8. Seguridad de Cookies
        </h2>

        <p>
          Implementamos medidas de seguridad para proteger sus cookies:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Cookies técnicas tienen bandera "Secure" (solo HTTPS)</li>
          <li>Cookies se transmiten mediante conexión encriptada</li>
          <li>Cookies no contienen datos sensibles sin cifrar</li>
          <li>Tokens de autenticación se regeneran regularmente</li>
          <li>Validación de integridad de cookies</li>
        </ul>
      </section>

      {/* Article 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          9. Derechos Sobre Cookies
        </h2>

        <p>
          Conforme a RGPD y LOPD-GDD, usted tiene derecho a:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Saber qué cookies se instalan y por qué</li>
          <li>Otorgar consentimiento antes de instalar cookies no técnicas</li>
          <li>Retirar consentimiento en cualquier momento</li>
          <li>Acceder a información sobre cookies de terceros</li>
          <li>Solicitar eliminación de datos de cookies</li>
          <li>Presentar reclamación ante AEPD si violamos estos derechos</li>
        </ul>
      </section>

      {/* Article 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          10. Cambios a esta Política
        </h2>

        <p>
          Actualizaremos esta Política de Cookies cuando instalemos nuevas herramientas o cambios tecnológicos lo justifiquen. Le notificaremos cambios significativos.
        </p>
      </section>

      {/* Article 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          11. Contacto
        </h2>

        <p>
          Para consultas sobre cookies o para ejercer sus derechos:
        </p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 my-6 text-sm">
          <ul className="space-y-2 m-0">
            <li><strong>Email:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</li>
            <li><strong>Teléfono:</strong> [TELÉFONO]</li>
            <li><strong>Dirección:</strong> [DOMICILIO SOCIAL]</li>
          </ul>
        </div>
      </section>

      {/* Final Note */}
      <section className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-[#4A4A4A] italic">
          Esta Política de Cookies cumple con la Ley 34/2002 (LSSI-CE) sobre Servicios de la Sociedad de la Información y Comercio Electrónico, el RGPD y la LOPD-GDD. Se aplica a nexomarket.com y todos sus subdominios.
        </p>
      </section>
    </article>
  );
}
