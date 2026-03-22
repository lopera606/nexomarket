'use client';

export default function CondicionesVendedorPage() {
  const lastUpdated = 'Marzo 2026';

  return (
    <article className="prose prose-sm max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mt-0 mb-3 sm:mb-4">
          Términos y Condiciones para Vendedores
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
          Estos Términos y Condiciones para Vendedores rigen la relación entre los vendedores registrados en la Plataforma de NexoMarket y la empresa.
        </p>

        <p>
          Al registrarse como vendedor, acepta íntegramente estos términos, los Términos y Condiciones Generales, la Política de Privacidad, Política de Cookies y demás documentos legales de NexoMarket.
        </p>

        <p>
          Estos términos son complementarios y no excluyentes respecto a la legislación española y europea aplicable a vendedores y comerciantes electrónicos.
        </p>
      </section>

      {/* Article 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          2. Requisitos de Registro y Verificación
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.1 Elegibilidad</h3>
        <p>
          Para registrarse como vendedor, debe cumplir:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Ser persona física o jurídica con capacidad legal para comerciar</li>
          <li>Ser mayor de 18 años (si persona física)</li>
          <li>Tener registro mercantil o autorización comercial válida</li>
          <li>Poseer NIF/CIF válido y vigente</li>
          <li>Cumplir todas las leyes locales y europeas aplicables</li>
          <li>No estar sujeto a prohibición de comerciar</li>
          <li>No tener antecedentes penales relacionados con fraude</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.2 Proceso de Verificación</h3>
        <p>
          NexoMarket verifica la identidad de vendedores mediante:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Comprobación de datos fiscales (NIF/CIF)</li>
          <li>Validación de dirección y contactos</li>
          <li>Revisión de información bancaria</li>
          <li>Análisis de antecedentes (KYC/AML)</li>
          <li>Verificación de propietario/representante</li>
          <li>Inspección de negocio (si es necesario)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.3 Documentación Requerida</h3>
        <p>
          El vendedor debe proporcionar y mantener actualizada:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>DNI/NIE o Pasaporte (personas físicas)</li>
          <li>Escrituras de constitución (personas jurídicas)</li>
          <li>Certificado del Registro Mercantil</li>
          <li>Acta de poder (si es representante)</li>
          <li>Datos bancarios para recibir pagos</li>
          <li>Certificado de inscripción en impuestos</li>
          <li>Certificado de vida laboral (si es autónomo)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.4 Rechazar o Suspender Registro</h3>
        <p>
          NexoMarket se reserva el derecho a rechazar el registro sin explicación. Una vez rechazado, el vendedor puede apelar en un plazo de 30 días.
        </p>
      </section>

      {/* Article 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          3. Estructura de Planes y Comisiones
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.1 Planes Disponibles</h3>
        <p>
          NexoMarket ofrece tres planes de vendedor:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm">
          <h4 className="font-semibold text-black mb-3">Plan FREE (Gratuito)</h4>
          <ul className="space-y-1 m-0 text-gray-700">
            <li>✓ Hasta 50 productos anunciados</li>
            <li>✓ Comisión: 12% por venta</li>
            <li>✓ Soporte básico por email</li>
            <li>✓ Sin cuota mensual</li>
            <li>✗ Sin herramientas de marketing</li>
            <li>✗ Sin análisis avanzado</li>
            <li>✗ Sin prioridad en soporte</li>
          </ul>

          <h4 className="font-semibold text-black mt-6 mb-3">Plan PRO (Mensual)</h4>
          <ul className="space-y-1 m-0 text-gray-700">
            <li>✓ Hasta 500 productos anunciados</li>
            <li>✓ Comisión: 7% por venta</li>
            <li>✓ Cuota mensual: €29.99</li>
            <li>✓ Herramientas de marketing integradas</li>
            <li>✓ Panel de análisis avanzado</li>
            <li>✓ Soporte prioritario</li>
            <li>✓ Cupones y promociones</li>
          </ul>

          <h4 className="font-semibold text-black mt-6 mb-3">Plan ENTERPRISE (Anual)</h4>
          <ul className="space-y-1 m-0 text-gray-700">
            <li>✓ Productos ilimitados</li>
            <li>✓ Comisión: 3% por venta</li>
            <li>✓ Cuota anual: €299.99 (equivalente €24.99/mes)</li>
            <li>✓ Todas las funciones PRO</li>
            <li>✓ Integración API avanzada</li>
            <li>✓ Gestor de cuenta dedicado</li>
            <li>✓ Publicaciones automáticas y programadas</li>
            <li>✓ Análisis de competencia</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.2 Estructura de Comisiones</h3>
        <p>
          Las comisiones se calculan sobre el precio de venta (sin IVA) del producto:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Plan FREE: 12% de comisión + 0.30€ por transacción</li>
          <li>Plan PRO: 7% de comisión + 0.20€ por transacción</li>
          <li>Plan ENTERPRISE: 3% de comisión (sin cuota por transacción)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.3 Cambio de Plan</h3>
        <p>
          Puede cambiar de plan en cualquier momento. Los cambios serán efectivos:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Upgrade: Inmediatamente, prorrateo de cuota</li>
          <li>Downgrade: Al final del período de facturación</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">3.4 Impuestos</h3>
        <p>
          Las comisiones y cuotas se facturan sin IVA. El vendedor es responsable de declarar estos gastos según legislación fiscal.
        </p>
      </section>

      {/* Article 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          4. Requisitos de Listado de Productos
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.1 Descripción Honesta</h3>
        <p>
          El vendedor debe:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Describir productos de forma clara y exacta</li>
          <li>Incluir dimensiones, peso, color y características reales</li>
          <li>Fotografiar productos desde múltiples ángulos</li>
          <li>Advertir sobre defectos, daños o limitaciones</li>
          <li>Indicar si es nuevo, remanente o usado</li>
          <li>No usar términos engañosos o "clickbait"</li>
          <li>Indicar plazo de entrega realista</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.2 Información Obligatoria</h3>
        <p>
          Cada producto debe incluir como mínimo:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Título claro y descriptivo</li>
          <li>Descripción detallada</li>
          <li>Precio final (incluye impuestos)</li>
          <li>Coste de envío (si aplica)</li>
          <li>Stock disponible (real)</li>
          <li>Condición del producto (nuevo/usado)</li>
          <li>Categoría correcta</li>
          <li>Imágenes de alta calidad</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.3 Productos Prohibidos</h3>
        <p>
          Los siguientes productos están prohibidos:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Drogas, sustancias controladas o ilegales</li>
          <li>Armas, municiones, explosivos</li>
          <li>Productos falsificados o pirateados</li>
          <li>Materiales pornográficos infantiles</li>
          <li>Especies animales/vegetales protegidas</li>
          <li>Medicamentos no autorizados</li>
          <li>Órganos y tejidos humanos</li>
          <li>Documentos de identidad falsificados</li>
          <li>Servicios de contenido sexual</li>
          <li>Bienes robados</li>
          <li>Cualquier producto contrario a la ley</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.4 Incumplimiento</h3>
        <p>
          NexoMarket puede eliminar listados sin previo aviso si incumplen estos requisitos. Incumplimientos repetidos resultarán en suspensión de cuenta.
        </p>
      </section>

      {/* Article 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          5. Obligaciones de Cumplimiento de Órdenes
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.1 Aceptación de Órdenes</h3>
        <p>
          El vendedor debe aceptar las órdenes dentro de 48 horas. Si no acepta en este plazo, la orden será cancelada automáticamente.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.2 Confirmación de Disponibilidad</h3>
        <p>
          El vendedor debe confirmar que el producto está disponible. Si no está disponible, debe informar inmediatamente al comprador para proceder con cancelación y reembolso.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.3 Plazo de Envío</h3>
        <p>
          El vendedor debe enviar el producto dentro del plazo especificado en la descripción:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Si dice "1-2 días", máximo 2 días hábiles</li>
          <li>Si dice "3-5 días", máximo 5 días hábiles</li>
          <li>Incluye día de aceptación de orden</li>
          <li>Festivos no se cuentan como días hábiles</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.4 Número de Seguimiento</h3>
        <p>
          Debe proporcionar número de seguimiento dentro de 24 horas de envío. El comprador puede rastrear la orden.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">5.5 Embalaje</h3>
        <p>
          Debe empacar el producto de forma segura para protegerlo durante el transporte:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Materiales de protección adecuados</li>
          <li>Etiquetado correcto de paquete</li>
          <li>Documentación interna clara</li>
          <li>Protección contra humedad y daño</li>
        </ul>
      </section>

      {/* Article 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          6. Envío y Responsabilidad Logística
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.1 Responsabilidad del Vendedor</h3>
        <p>
          El vendedor es responsable de:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Contratar transportista fiable</li>
          <li>Asegurar que el paquete es entregado</li>
          <li>Responder por pérdidas después de que sale del depósito</li>
          <li>Contratar seguro si producto es de alto valor</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.2 Responsabilidad de NexoMarket</h3>
        <p>
          NexoMarket NO es responsable por:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Retrasos en el transporte</li>
          <li>Pérdida o daño durante envío</li>
          <li>Incumplimientos del transportista</li>
          <li>Condiciones climáticas o fuerza mayor</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.3 Opciones de Envío</h3>
        <p>
          El vendedor puede ofrecer varias opciones:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Envío estándar (3-5 días hábiles)</li>
          <li>Envío urgente (1-2 días hábiles)</li>
          <li>Recogida en tienda (si aplica)</li>
          <li>Envío sin coste (a precio final más alto)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.4 Direcciones Internacionales</h3>
        <p>
          El vendedor puede elegir si envía a nivel internacional. Debe indicarlo claramente en la descripción.
        </p>
      </section>

      {/* Article 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          7. Procesamiento de Pagos y Pagos de Comisiones
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.1 Flujo de Pagos</h3>
        <p>
          El flujo de pagos es el siguiente:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Comprador realiza pago a través de Stripe o método seleccionado</li>
          <li>Pago se procesa y confirma (1-2 días hábiles)</li>
          <li>NexoMarket retiene comisión automáticamente</li>
          <li>El saldo neto se transfiere a la cuenta bancaria del vendedor</li>
        </ol>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.2 Calendario de Pagos</h3>
        <p>
          Los pagos se realizan según el plan:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Plan FREE y PRO: Pago semanal (cada martes)</li>
          <li>Plan ENTERPRISE: Pago quincenal (1º y 15º de cada mes)</li>
          <li>Saldo mínimo: €10 para procesar pago</li>
          <li>Si saldo &lt; €10, se acumula para siguiente período</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.3 Comisiones y Gastos</h3>
        <p>
          Las comisiones incluyen:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Porcentaje de venta (según plan: 12%, 7%, 3%)</li>
          <li>Comisión por transacción (según plan)</li>
          <li>Comisión de pago (si pago es rechazado): €2</li>
          <li>Reembolso de cliente (retiene comisión original)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.4 Datos Bancarios</h3>
        <p>
          El vendedor debe mantener datos bancarios actualizados. Cambios se aplican al próximo pago.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">7.5 Retención de Fondos</h3>
        <p>
          NexoMarket se reserva el derecho a retener fondos en caso de:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Investigación de fraude en curso</li>
          <li>Múltiples disputas o devoluciones</li>
          <li>Incumplimiento de términos</li>
          <li>Litigio pendiente con comprador</li>
        </ul>

        <p>
          La retención no excederá el saldo máximo del último 90 días o €5000, lo que sea mayor.
        </p>
      </section>

      {/* Article 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          8. Devoluciones y Reembolsos
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.1 Política de Devoluciones</h3>
        <p>
          Cada vendedor debe establecer una política clara de devoluciones. Puede ser:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Sin devoluciones</li>
          <li>7 días desde recepción</li>
          <li>14 días desde recepción</li>
          <li>30 días desde recepción</li>
        </ul>

        <p>
          Independientemente de la política, debe cumplir con derechos legales de consumo (14 días mínimo).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.2 Reembolsos</h3>
        <p>
          Al aceptar una devolución, debe:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Reembolsar el precio de compra en 14 días</li>
          <li>Reembolsar al método de pago original (Stripe)</li>
          <li>Puede restar gastos de envío si producto está dañado por comprador</li>
          <li>NexoMarket retiene comisión (no devuelve)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.3 Producto Defectuoso</h3>
        <p>
          Si el comprador reporta defecto:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Debe reembolsar o sustituir en 30 días</li>
          <li>Sufragar coste de devolución (defecto de vendedor)</li>
          <li>Asumir responsabilidad del garantía legal</li>
        </ul>
      </section>

      {/* Article 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          9. Garantías y Responsabilidad
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">9.1 Garantía Legal</h3>
        <p>
          El vendedor garantiza que los productos cumplen con garantía legal según Derecho de Consumo español (artículos 114-137 del Real Decreto Legislativo 1/2007).
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">9.2 Responsabilidad Civil</h3>
        <p>
          El vendedor es responsable civil por:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Daños causados por productos defectuosos</li>
          <li>Incumplimiento de obligaciones contractuales</li>
          <li>Violación de derechos de terceros</li>
          <li>Actividades fraudulentas o ilegales</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">9.3 Responsabilidad de NexoMarket</h3>
        <p>
          NexoMarket NO es responsable por:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Calidad de productos vendidos por vendedor</li>
          <li>Incumplimientos de vendedor respecto a comprador</li>
          <li>Daños causados por productos defectuosos</li>
          <li>Pérdidas o robo durante envío</li>
        </ul>
      </section>

      {/* Article 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          10. Reseñas, Valoraciones y Reputación
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">10.1 Reseñas de Compradores</h3>
        <p>
          Los compradores pueden dejar reseñas (1-5 estrellas) y comentarios. El vendedor debe:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Aceptar críticas constructivas</li>
          <li>Responder profesionalmente a reseñas</li>
          <li>No solicitar reseñas falsas</li>
          <li>No amenazar ni acosar al comprador por reseña negativa</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">10.2 Manipulación de Reseñas</h3>
        <p>
          Está prohibido:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Crear reseñas falsas o bajo identidades falsas</li>
          <li>Pagar a terceros por reseñas positivas</li>
          <li>Presionar a compradores para cambiar reseñas negativas</li>
          <li>Denunciar reseñas legítimas como falsas</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">10.3 Métrica de Vendedor</h3>
        <p>
          La puntuación del vendedor se calcula por:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Promedio de reseñas de compradores (50%)</li>
          <li>Tasa de respuesta a mensajes (15%)</li>
          <li>Tasa de cumplimiento de plazos (20%)</li>
          <li>Tasa de disputa/devolución (15%)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">10.4 Advertencias</h3>
        <p>
          Vendedores con puntuación &lt; 3.0 estrellas recibirán advertencia. Si no mejoran en 60 días, pueden ser suspendidos.
        </p>
      </section>

      {/* Article 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          11. Propiedad Intelectual
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">11.1 Garantía de Derechos</h3>
        <p>
          El vendedor garantiza que:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Todos los productos vendidos son originales</li>
          <li>Tiene derecho a venderlos sin violación de derechos</li>
          <li>Las descripciones no violan derechos de terceros</li>
          <li>Las imágenes utilizadas son propias o licenciadas</li>
          <li>No hay contenido falsificado o pirateado</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">11.2 Indemnización</h3>
        <p>
          El vendedor indemniza a NexoMarket y compradores contra:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Reclamaciones por infracción de propiedad intelectual</li>
          <li>Demandas por marca registrada</li>
          <li>Demandas por patentes</li>
          <li>Reclamaciones de derechos de autor</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">11.3 Contenido del Vendedor</h3>
        <p>
          Al publicar contenido (descripciones, imágenes, comentarios), el vendedor otorga a NexoMarket licencia no exclusiva para usar, copiar, modificar y distribuir dicho contenido en la Plataforma.
        </p>
      </section>

      {/* Article 12 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          12. Suspensión y Cancelación de Cuenta
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.1 Motivos de Suspensión</h3>
        <p>
          NexoMarket puede suspender la cuenta del vendedor si:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Incumple estos Términos y Condiciones</li>
          <li>Realiza actividades fraudulentas o ilegales</li>
          <li>Viola derechos de consumidor</li>
          <li>Múltiples disputas sin resolver</li>
          <li>Proporciona información falsa</li>
          <li>Tasa de devolución &gt; 10%</li>
          <li>Puntuación de vendedor &lt; 2.0 estrellas</li>
          <li>Incumplimiento de normas anti-dinero negro (AML)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.2 Notificación</h3>
        <p>
          Notificaremos al vendedor sobre la suspensión con motivos específicos. Tendrá 7 días para responder o apelar.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.3 Apelación</h3>
        <p>
          El vendedor puede apelar la suspensión dentro de 30 días. NexoMarket revisará la apelación y notificará su decisión en 15 días.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">12.4 Cancelación Permanente</h3>
        <p>
          La cancelación permanente (sin opción de reapertura) ocurre por:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Fraude confirmado o actividad criminal</li>
          <li>Violación grave y repetida de términos</li>
          <li>Suspensión anterior no revertida en 90 días</li>
          <li>Múltiples incidentes de documentación falsificada</li>
        </ul>
      </section>

      {/* Article 13 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          13. Datos Personales y Procesamiento
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">13.1 Acuerdo de Procesamiento de Datos</h3>
        <p>
          El vendedor acepta que NexoMarket trata datos personales de compradores como controladora. Hemos firmado Acuerdo de Procesamiento de Datos (DPA) conforme a RGPD.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">13.2 Responsabilidades del Vendedor</h3>
        <p>
          El vendedor, si accede a datos de compradores (nombre, email, dirección), es responsable de:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Usar datos solo para cumplir orden</li>
          <li>Proteger datos con medidas de seguridad</li>
          <li>Cumplir RGPD/LOPD-GDD</li>
          <li>No compartir con terceros sin consentimiento</li>
          <li>No usar para marketing sin permiso</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">13.3 Política de Privacidad del Vendedor</h3>
        <p>
          Si el vendedor tiene tienda propia o sitio web, debe publicar Política de Privacidad conforme a RGPD.
        </p>
      </section>

      {/* Article 14 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          14. Restricciones Competencia y No-Circunvención
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">14.1 No Solicitar Fuera de Plataforma</h3>
        <p>
          El vendedor se compromete a no:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Solicitar a compradores realizar transacciones fuera de NexoMarket</li>
          <li>Proporcionar información de contacto para eludir comisiones</li>
          <li>Dirigir tráfico a competidores</li>
          <li>Difamar la Plataforma</li>
        </ul>

        <p>
          Incumplimiento resultará en suspensión inmediata y retención de fondos.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">14.2 Restricción de Competencia (No Compete)</h3>
        <p>
          Durante la vigencia de la cuenta y 12 meses después de cancelación, el vendedor no puede:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Crear plataforma competidora similar</li>
          <li>Contratar empleados de NexoMarket para proyecto rival</li>
          <li>Usar información de Plataforma para competidor</li>
        </ul>

        <p>
          Esta restricción es razonable y necesaria para proteger interés legítimo de NexoMarket.
        </p>
      </section>

      {/* Article 15 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          15. Terminación
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">15.1 Cancelación Voluntaria</h3>
        <p>
          El vendedor puede cancelar su cuenta en cualquier momento contactando a [CORREO ELECTRÓNICO DE CONTACTO]. Se requiere notificación con 30 días de anticipación si tiene suscripción paga.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">15.2 Liquidación Final</h3>
        <p>
          Después de cancelación:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Los listados se retiran de la Plataforma</li>
          <li>Órdenes pendientes se procesan normalmente</li>
          <li>Saldo final se paga en 60 días</li>
          <li>Se puede procesar reembolsos pendientes</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">15.3 Suspensión Automática por Inactividad</h3>
        <p>
          Las cuentas inactivas durante 12 meses consecutivos pueden ser suspendidas. El vendedor será notificado con 30 días de anticipación.
        </p>
      </section>

      {/* Article 16 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          16. Conformidad Legal y Fiscal
        </h2>

        <h3 className="text-xl font-semibold texto-gray-800 mt-4 mb-2">16.1 Obligaciones Fiscales</h3>
        <p>
          El vendedor es responsable de:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Declarar ingresos en impuestos</li>
          <li>Pagar IVA según legislación</li>
          <li>Mantener registros de ventas</li>
          <li>Cumplir obligaciones contables</li>
          <li>Responder auditorías fiscales</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">16.2 Cumplimiento Legal</h3>
        <p>
          El vendedor debe cumplir:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Leyes de protección al consumidor</li>
          <li>Regulación de comercio electrónico</li>
          <li>Leyes de competencia y monopolio</li>
          <li>Regulación de estándares de producto</li>
          <li>Leyes de protección de datos</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">16.3 Información Regulatoria</h3>
        <p>
          El vendedor debe completar y mantener actualizado:
        </p>
        <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
          <li>Certificación de origen de fondos (AML)</li>
          <li>Validación de identidad (KYC)</li>
          <li>Información fiscal actualizada</li>
          <li>Dirección verificada</li>
        </ul>
      </section>

      {/* Article 17 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          17. Cambios a Estos Términos
        </h2>

        <p>
          NexoMarket puede modificar estos Términos en cualquier momento. Las modificaciones serán efectivas 30 días después de la publicación. Se notificará por email a vendedores de cambios significativos.
        </p>

        <p>
          El uso continuado de la Plataforma después de cambios implica aceptación de los nuevos términos.
        </p>
      </section>

      {/* Article 18 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          18. Contacto y Soporte
        </h2>

        <p>
          Para consultas, problemas técnicos o reportar incumplimientos:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm">
          <ul className="space-y-2 m-0">
            <li><strong>Email Soporte Vendedor:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</li>
            <li><strong>Teléfono:</strong> [TELÉFONO]</li>
            <li><strong>Dirección Postal:</strong> [DOMICILIO SOCIAL]</li>
            <li><strong>Horario:</strong> Lunes a Viernes 9:00-18:00 CET</li>
            <li><strong>Centro de Ayuda:</strong> help.nexomarket.com</li>
          </ul>
        </div>
      </section>

      {/* Final Note */}
      <section className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic">
          Estos Términos para Vendedores se aplican exclusivamente a vendedores registrados en la Plataforma de NexoMarket. Son complementarios a los Términos y Condiciones Generales. En caso de conflicto, prevalecerá lo más favorable al vendedor conforme a la ley.
        </p>
      </section>
    </article>
  );
}
