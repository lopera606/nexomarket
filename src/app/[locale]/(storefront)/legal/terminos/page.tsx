'use client';

export default function TerminosPage() {
  const lastUpdated = 'Marzo 2026';

  return (
    <article className="prose prose-sm max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mt-0 mb-3 sm:mb-4">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 m-0">
          <strong>Última actualización:</strong> {lastUpdated}
        </p>
      </div>

      {/* Article 1 */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-black mt-4 sm:mt-6 mb-3 sm:mb-4">
          1. Objeto y Ámbito de Aplicación
        </h2>

        <p>
          Estos Términos y Condiciones regulan el acceso y uso del sitio web y la plataforma de NexoMarket (en adelante, "la Plataforma"), un mercado electrónico donde vendedores registrados ofrecen productos y servicios a compradores.
        </p>

        <p>
          Mediante el acceso y/o uso de la Plataforma, el usuario acepta íntegramente estos Términos y Condiciones, así como la Política de Privacidad, Política de Cookies y demás documentos legales publicados en la Plataforma.
        </p>

        <p>
          Si no acepta estos términos, le rogamos que no utilice la Plataforma.
        </p>
      </section>

      {/* Article 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          2. Definiciones
        </h2>

        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            <strong>Plataforma:</strong> El sitio web y aplicaciones de NexoMarket, incluyendo todos sus servicios, funcionalidades y contenidos
          </li>
          <li>
            <strong>Usuario:</strong> Toda persona física que accede o utiliza la Plataforma
          </li>
          <li>
            <strong>Comprador:</strong> Usuario registrado que adquiere productos o servicios a través de la Plataforma
          </li>
          <li>
            <strong>Vendedor:</strong> Usuario registrado que ofrece y vende productos o servicios a través de la Plataforma
          </li>
          <li>
            <strong>Cuenta:</strong> Perfil personal del usuario en la Plataforma
          </li>
          <li>
            <strong>Transacción:</strong> La compraventa de un producto o servicio entre comprador y vendedor
          </li>
          <li>
            <strong>Comisión:</strong> El porcentaje o cantidad que NexoMarket retiene de cada venta realizada a través de la Plataforma
          </li>
        </ul>
      </section>

      {/* Article 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          3. Requisitos de Registro y Acceso
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.1 Elegibilidad</h3>
        <p>
          Para registrarse en la Plataforma, el usuario debe:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Ser mayor de edad (18 años o más)</li>
          <li>Tener capacidad legal para contratar</li>
          <li>No estar inhabilitado legalmente</li>
          <li>Proporcionar información veraz, exacta, actual y completa</li>
          <li>Aceptar íntegramente estos Términos y Condiciones</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.2 Datos de Registro</h3>
        <p>
          El usuario es responsable de mantener la confidencialidad de su contraseña y datos de acceso. Acepta ser responsable de todas las actividades realizadas bajo su cuenta. El usuario debe notificar inmediatamente a NexoMarket de cualquier uso no autorizado de su cuenta.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.3 Cuenta Única</h3>
        <p>
          Cada usuario puede tener una única cuenta. La creación de múltiples cuentas puede resultar en la suspensión o cancelación de todas ellas.
        </p>
      </section>

      {/* Article 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          4. Estructura de Roles y Responsabilidades
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.1 NexoMarket como Intermediaria</h3>
        <p>
          NexoMarket actúa como plataforma de intermediación entre compradores y vendedores. La empresa:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Facilita transacciones entre usuarios independientes</li>
          <li>No es parte de las transacciones realizadas</li>
          <li>No es vendedora ni compradora de los productos</li>
          <li>Gestiona pagos de forma segura mediante procesadores certificados</li>
          <li>Proporciona un sistema de resolución de conflictos</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.2 Responsabilidades del Comprador</h3>
        <p>
          El comprador se obliga a:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Proporcionar información de pago exacta y actualizada</li>
          <li>Realizar pagos en el plazo establecido</li>
          <li>Recoger o recibir los productos en condiciones normales</li>
          <li>Inspeccionar los productos en el momento de la entrega</li>
          <li>Reportar problemas dentro de los plazos establecidos</li>
          <li>Cumplir con la ley durante sus compras</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.3 Responsabilidades del Vendedor</h3>
        <p>
          El vendedor se obliga a:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Describir los productos de forma precisa y veraz</li>
          <li>Mantener existencias suficientes de productos anunciados</li>
          <li>Entregar productos de la calidad y características descritas</li>
          <li>Procesar reembolsos dentro de los plazos legales</li>
          <li>Respetar los derechos de los compradores como consumidores</li>
          <li>Cumplir con todas las leyes aplicables</li>
        </ul>
      </section>

      {/* Article 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          5. Proceso de Compra
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.1 Carrito y Orden Provisional</h3>
        <p>
          El usuario puede añadir productos al carrito. El carrito no constituye una oferta vinculante ni una reserva de existencias.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.2 Confirmación de Orden</h3>
        <p>
          La orden se confirma cuando:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>El comprador revisa y acepta los términos de la orden</li>
          <li>El comprador realiza el pago</li>
          <li>NexoMarket recibe la confirmación del procesador de pagos</li>
          <li>El vendedor confirma la aceptación de la orden</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.3 Cancelación de Orden</h3>
        <p>
          El comprador puede cancelar una orden antes de que el vendedor la procese. Una vez procesada, la cancelación se rige por las políticas de devolución del vendedor.
        </p>
      </section>

      {/* Article 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          6. Precios, Impuestos y Formas de Pago
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.1 Precios</h3>
        <p>
          Los precios mostrados en la Plataforma incluyen impuestos (IVA) según la legislación española y europea aplicable. Los vendedores son responsables de establecer precios correctos y conformes a la ley.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.2 Cambios de Precios</h3>
        <p>
          NexoMarket y los vendedores se reservan el derecho a modificar precios. Los cambios serán efectivos solo a partir de nuevas órdenes. Las órdenes confirmadas mantienen el precio vigente en el momento de la compra.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.3 Formas de Pago</h3>
        <p>
          La Plataforma acepta las siguientes formas de pago:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Tarjetas de crédito/débito (Visa, Mastercard, American Express, etc.)</li>
          <li>Transferencia bancaria</li>
          <li>Billeteras digitales y plataformas de pago autorizadas</li>
          <li>Otras formas a criterio del vendedor</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.4 Procesamiento de Pagos</h3>
        <p>
          Los pagos se procesan a través de Stripe y otros procesadores certificados. Al realizar un pago, el usuario autoriza al procesador a cargar el monto correspondiente. Los datos de pago se tratan conforme a la Política de Privacidad.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.5 Seguridad de Pagos</h3>
        <p>
          Todos los pagos se realizan mediante conexiones seguras y encriptadas (HTTPS, PCI-DSS). NexoMarket no accede ni almacena datos de tarjetas de crédito completos.
        </p>
      </section>

      {/* Article 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          7. Envío y Entrega
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.1 Responsabilidades de Envío</h3>
        <p>
          El vendedor es responsable de:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Embalar productos de forma segura</li>
          <li>Entregar o enviar productos dentro del plazo indicado</li>
          <li>Asegurar que el envío cumpla con regulaciones de transporte</li>
          <li>Contratar servicio de mensajería o recogida con fiabilidad comprobada</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.2 Riesgos y Pérdida</h3>
        <p>
          El riesgo de pérdida o daño del producto durante el transporte se transmite al comprador en el momento que sale del depósito o instalación del vendedor. El vendedor debe indicar claramente los términos de envío (incluye coste, empresa transportista, plazo estimado).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.3 Seguimiento</h3>
        <p>
          El vendedor debe proporcionar número de seguimiento cuando se utilice servicio de envío. NexoMarket no es responsable de retrasos o pérdidas en el transporte.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.4 Entrega Local</h3>
        <p>
          Para entregas locales o presenciales, el comprador y vendedor pueden acordar condiciones específicas. La entrega se considera completada cuando el producto se entrega al comprador en la ubicación acordada.
        </p>
      </section>

      {/* Article 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          8. Derecho de Desistimiento (Derecho de Retracto)
        </h2>

        <p>
          Conforme a la Directiva 2011/83/UE y su transposición en la legislación española, los compradores que sean consumidores tienen derecho a desistir de la compra en un plazo de 14 días naturales, salvo excepciones legales (productos personalizados, alimentos perecederos, etc.).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.1 Cómo Ejercer el Derecho</h3>
        <p>
          Para ejercer el derecho de desistimiento, el comprador debe:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Notificar por escrito al vendedor dentro del plazo de 14 días</li>
          <li>Devolver el producto en condiciones originales sin usar</li>
          <li>Asumir los costes de devolución según acuerdo con el vendedor</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.2 Excepciones</h3>
        <p>
          No tienen derecho de desistimiento las compras de:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Bienes hechos a medida o personalizados</li>
          <li>Productos perecederos o de fácil deterioro</li>
          <li>Artículos de segunda mano o usados (si así se indicó)</li>
          <li>Servicios que ya han sido prestados en su totalidad</li>
          <li>Contenidos digitales no duplicables tras su apertura</li>
        </ul>
      </section>

      {/* Article 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          9. Devoluciones y Reembolsos
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">9.1 Política de Devoluciones</h3>
        <p>
          Cada vendedor establece su propia política de devoluciones, que debe ser clara y cumplir con la ley. El comprador puede revisar la política antes de comprar.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">9.2 Producto Defectuoso</h3>
        <p>
          Si el producto presenta defectos o no corresponde a la descripción, el comprador tiene derecho a:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Solicitar sustitución del producto</li>
          <li>Solicitar reparación del producto</li>
          <li>Solicitar reembolso total o parcial</li>
          <li>Rescindir la compra conforme a derecho</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">9.3 Plazo de Reembolso</h3>
        <p>
          El vendedor debe procesar el reembolso en un plazo máximo de 14 días naturales desde la aceptación de la devolución. El reembolso se realizará al método de pago original.
        </p>
      </section>

      {/* Article 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          10. Productos y Servicios Prohibidos
        </h2>

        <p>
          Los siguientes productos y servicios están prohibidos en la Plataforma:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Drogas, sustancias controladas o ilegales</li>
          <li>Armas, municiones y explosivos</li>
          <li>Productos falsificados o pirateados</li>
          <li>Materiales pornográficos infantiles</li>
          <li>Artículos de protección de fauna y flora protegidas</li>
          <li>Medicamentos sin licencia o no autorizados</li>
          <li>Órganos y tejidos humanos</li>
          <li>Documentos de identidad falsificados</li>
          <li>Servicios de contenido sexual o explotación</li>
          <li>Cualquier producto o servicio contrario a la ley</li>
        </ul>

        <p>
          NexoMarket se reserva el derecho a eliminar cualquier anuncio que incumpla esta prohibición sin previo aviso.
        </p>
      </section>

      {/* Article 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          11. Conducta Prohibida
        </h2>

        <p>
          El usuario se obliga a no:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Violar derechos de terceros (propiedad intelectual, privacidad, honor)</li>
          <li>Publicar contenido ilícito, discriminatorio, ofensivo u obsceno</li>
          <li>Acosar, difamar o amenazar a otros usuarios</li>
          <li>Utilizar bots o herramientas automatizadas sin autorización</li>
          <li>Manipular precios o crear ofertas fraudulentas</li>
          <li>Solicitar transacciones fuera de la Plataforma para evadir comisiones</li>
          <li>Usar información de otros usuarios con fines fraudulentos</li>
          <li>Cargar malware, virus o código malicioso</li>
          <li>Acceder a áreas no públicas de la Plataforma sin autorización</li>
          <li>Realizar actividades de spam, phishing o fraude</li>
          <li>Participar en estafas o engaños</li>
        </ul>

        <p>
          Cualquier violación puede resultar en suspensión o cancelación permanente de la cuenta.
        </p>
      </section>

      {/* Article 12 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          12. Propiedad Intelectual
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.1 Contenidos de NexoMarket</h3>
        <p>
          Todo el contenido de la Plataforma (textos, gráficos, logos, imágenes, software) es titularidad exclusiva de NexoMarket o sus licenciantes, protegido por derechos de autor y propiedad intelectual. El usuario solo tiene licencia limitada para uso personal no comercial.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.2 Contenidos del Usuario</h3>
        <p>
          El usuario conserva la propiedad de contenidos que crea (descripción de productos, imágenes, reseñas). Al publicarlos, otorga a NexoMarket licencia no exclusiva para usarlos en la Plataforma.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.3 Productos Originales</h3>
        <p>
          El vendedor garantiza que todos los productos que vende son originales o están autorizados por el titular de derechos. NexoMarket no es responsable por violaciones de propiedad intelectual de terceros cometidas por vendedores.
        </p>
      </section>

      {/* Article 13 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          13. Garantía y Responsabilidad
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">13.1 Garantía Legal</h3>
        <p>
          Los compradores son protegidos por la garantía legal de consumo según legislación española (artículos 114-137 Real Decreto Legislativo 1/2007 sobre texto refundido de la Ley General para la Defensa de Consumidores y Usuarios).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">13.2 Limitación de Responsabilidad</h3>
        <p>
          NexoMarket actúa como intermediaria y no es responsable por:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Incumplimientos de los vendedores</li>
          <li>Daños derivados del transporte o envío</li>
          <li>Calidad, seguridad o legalidad de productos</li>
          <li>Comportamiento o responsabilidad de usuarios</li>
          <li>Pérdida de datos o información del usuario</li>
          <li>Interrupciones o fallos técnicos de la Plataforma</li>
        </ul>

        <p>
          En ningún caso la responsabilidad total de NexoMarket superará el monto de comisiones pagadas por el usuario en los últimos 12 meses.
        </p>
      </section>

      {/* Article 14 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          14. Suspensión y Cancelación de Cuenta
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">14.1 Motivos de Suspensión</h3>
        <p>
          NexoMarket puede suspender o cancelar la cuenta de un usuario si:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Incumple estos Términos y Condiciones</li>
          <li>Realiza actividades fraudulentas o ilegales</li>
          <li>Viola derechos de terceros</li>
          <li>Proporciona información falsa o engañosa</li>
          <li>Está involucrado en transacciones sospechosas</li>
          <li>Tiene altas tasas de disputa o reclamación</li>
          <li>Incumple pagos u obligaciones contractuales</li>
          <li>Viaja a jurisdicciones donde NexoMarket no puede operar</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">14.2 Notificación</h3>
        <p>
          NexoMarket notificará al usuario sobre suspensión o cancelación cuando sea posible, salvo en casos de fraude inmediato.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">14.3 Apelación</h3>
        <p>
          El usuario puede apelar la decisión de suspensión contactando a soporte dentro de 30 días. NexoMarket revisará la apelación y notificará su decisión.
        </p>
      </section>

      {/* Article 15 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          15. Modificación de Términos
        </h2>

        <p>
          NexoMarket se reserva el derecho a modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán efectivas inmediatamente después de la publicación. El uso continuado de la Plataforma después de cambios implica aceptación de los nuevos términos.
        </p>

        <p>
          Para cambios materiales, NexoMarket notificará al usuario con 30 días de anticipación.
        </p>
      </section>

      {/* Article 16 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          16. Resolución de Disputas
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">16.1 Negociación Directa</h3>
        <p>
          Ante cualquier disputa entre comprador y vendedor, las partes deben intentar resolverla directamente a través de la Plataforma en un plazo de 10 días.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">16.2 Mediación de NexoMarket</h3>
        <p>
          Si la negociación falla, el usuario puede solicitar mediación de NexoMarket. El equipo de soporte analizará la disputa y emitirá una resolución dentro de 15 días hábiles.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">16.3 Arbitraje</h3>
        <p>
          Si la mediación no resuelve la disputa, cualquiera de las partes puede solicitar arbitraje conforme a las reglas de la Cámara de Comercio e Industria de Madrid.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">16.4 Ley Aplicable</h3>
        <p>
          Estos Términos y Condiciones se rigen por la ley española. Cualquier litigio será regulado por los juzgados competentes de la Comunidad de Madrid.
        </p>
      </section>

      {/* Article 17 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          17. Contacto y Soporte
        </h2>

        <p>
          Para consultas, reclamaciones o solicitud de información sobre estos Términos y Condiciones:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm">
          <ul className="space-y-2 m-0">
            <li><strong>Correo Electrónico:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</li>
            <li><strong>Teléfono:</strong> [TELÉFONO]</li>
            <li><strong>Dirección Postal:</strong> [DOMICILIO SOCIAL]</li>
            <li><strong>Horario de Atención:</strong> Lunes a Viernes, 9:00 - 18:00 CET</li>
          </ul>
        </div>
      </section>

      {/* Final Note */}
      <section className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic">
          Estos Términos y Condiciones constituyen el acuerdo completo entre el usuario y NexoMarket respecto al uso de la Plataforma. Si alguna disposición es inválida, las demás permanecerán vigentes.
        </p>
      </section>
    </article>
  );
}
