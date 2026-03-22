'use client';

export default function PrivacidadPage() {
  const lastUpdated = 'Marzo 2026';

  return (
    <article className="prose prose-sm max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mt-0 mb-3 sm:mb-4">
          Política de Privacidad y Protección de Datos
        </h1>
        <p className="text-xs sm:text-sm text-[#4A4A4A] m-0">
          <strong>Última actualización:</strong> {lastUpdated}
        </p>
      </div>

      {/* Article 1 */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-black mt-4 sm:mt-6 mb-3 sm:mb-4">
          1. Responsable del Tratamiento
        </h2>

        <p>
          De conformidad con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPD-GDD), le informamos que el responsable del tratamiento de sus datos personales es:
        </p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4 sm:p-6 my-4 sm:my-6 text-xs sm:text-sm">
          <ul className="space-y-1.5 sm:space-y-2 m-0">
            <li><strong>Responsable:</strong> [RAZÓN SOCIAL]</li>
            <li><strong>CIF/NIF:</strong> [CIF/NIF]</li>
            <li><strong>Domicilio:</strong> [DOMICILIO SOCIAL]</li>
            <li><strong>Email (DPO/Privacidad):</strong> [CORREO ELECTRÓNICO DE CONTACTO]</li>
            <li><strong>Teléfono:</strong> [TELÉFONO]</li>
          </ul>
        </div>
      </section>

      {/* Article 2 */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-black mt-4 sm:mt-6 mb-3 sm:mb-4">
          2. Tipos de Datos que Recopilamos
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-black mt-3 sm:mt-4 mb-2">2.1 Datos de Registro</h3>
        <ul className="list-decimal list-inside space-y-1.5 sm:space-y-2 text-[#4A4A4A] text-xs sm:text-sm">
          <li>Nombre completo</li>
          <li>Dirección de correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Contraseña (encriptada)</li>
          <li>Fecha de nacimiento</li>
          <li>Dirección postal</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.2 Datos de Compra y Pago</h3>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Historial de compras y órdenes</li>
          <li>Dirección de entrega</li>
          <li>Método de pago (información parcial, no almacenamos números completos)</li>
          <li>Facturas y recibos</li>
          <li>Disputas y devoluciones</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.3 Datos de Vendedor (si aplica)</h3>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Información bancaria (para pagos de comisiones)</li>
          <li>Datos fiscales y de negocio</li>
          <li>Identificación fiscal (NIF/CIF)</li>
          <li>Productos listados y descripción</li>
          <li>Reseñas y valoraciones de vendedor</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.4 Datos de Uso y Navegación</h3>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Dirección IP</li>
          <li>Tipo de navegador y dispositivo</li>
          <li>Páginas visitadas y tiempo de permanencia</li>
          <li>Búsquedas realizadas</li>
          <li>Clics en anuncios y enlaces</li>
          <li>Datos de cookies y tecnologías similares</li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">2.5 Datos de Comunicación</h3>
        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Mensajes entre compradores y vendedores</li>
          <li>Comunicaciones de soporte técnico</li>
          <li>Reseñas y comentarios de usuarios</li>
          <li>Preferencias de comunicación</li>
        </ul>
      </section>

      {/* Article 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          3. Base Legal para el Tratamiento
        </h2>

        <p>
          El tratamiento de sus datos se realiza sobre las siguientes bases legales (conforme al artículo 6 RGPD):
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>
            <strong>Consentimiento (artículo 6.1.a):</strong> Para marketing, análisis, y cookies no esenciales. El usuario debe otorgar consentimiento activo.
          </li>
          <li>
            <strong>Ejecución de Contrato (artículo 6.1.b):</strong> Para procesar órdenes, pagos, envíos, servicio al cliente y cumplir obligaciones contractuales.
          </li>
          <li>
            <strong>Cumplimiento de Obligación Legal (artículo 6.1.c):</strong> Para cumplir leyes de protección del consumidor, prevención de fraude, impuestos, etc.
          </li>
          <li>
            <strong>Interés Legítimo (artículo 6.1.f):</strong> Para seguridad de la Plataforma, prevención de fraude, mejora de servicios y análisis de datos.
          </li>
        </ul>
      </section>

      {/* Article 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          4. Finalidad del Tratamiento
        </h2>

        <p>
          Sus datos personales serán tratados para los siguientes fines:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Crear y gestionar su cuenta de usuario</li>
          <li>Procesar transacciones de compra y venta</li>
          <li>Procesar pagos y cobros de comisiones</li>
          <li>Generar facturas y documentos fiscales</li>
          <li>Gestionar envíos, entregas y devoluciones</li>
          <li>Proporcionar servicio de atención al cliente</li>
          <li>Resolver disputas y reclamaciones</li>
          <li>Cumplir obligaciones legales y fiscales</li>
          <li>Prevenir fraude y actividades ilícitas</li>
          <li>Mejorar y personalizar los servicios</li>
          <li>Análisis estadísticos y comportamentales</li>
          <li>Enviar comunicaciones promocionales (con consentimiento)</li>
          <li>Cumplir requisitos de lucha contra el blanqueo de capitales (AML)</li>
          <li>Verificación de identidad y know-your-customer (KYC)</li>
        </ul>
      </section>

      {/* Article 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          5. Período de Retención de Datos
        </h2>

        <p>
          Sus datos personales serán conservados durante el tiempo necesario para cumplir las finalidades para las que fueron recopilados:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm space-y-3">
          <p><strong>Datos de Registro:</strong> Mientras tenga cuenta activa + 3 años después de cancelación (obligación legal)</p>
          <p><strong>Datos de Compra/Venta:</strong> Durante 6 años (obligación legal contable y fiscal)</p>
          <p><strong>Datos de Pago:</strong> Según retención Stripe/procesador (generalmente 10 años por AML)</p>
          <p><strong>Datos Bancarios (Vendedores):</strong> 6 años (obligación fiscal) + 3 años histórico</p>
          <p><strong>Cookies Analytics:</strong> Máximo 24 meses desde creación</p>
          <p><strong>Cookies Marketing:</strong> Máximo 13 meses desde consentimiento</p>
          <p><strong>Logs de Seguridad/IP:</strong> Máximo 6 meses</p>
          <p><strong>Mensajes de Usuarios Borrados:</strong> Anonimizados después de 30 días</p>
        </div>

        <p>
          Después del período de retención, los datos serán suprimidos o anonimizados de forma irreversible, salvo obligación legal específica.
        </p>
      </section>

      {/* Article 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          6. Destinatarios y Transferencias
        </h2>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">6.1 Terceros que Reciben Datos</h3>
        <p>
          Sus datos pueden ser compartidos con:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>
            <strong>Procesador de Pagos (Stripe):</strong> Para procesar transacciones seguras. Stripe es procesador certificado GDPR.
          </li>
          <li>
            <strong>Empresas de Logística:</strong> Para entrega de productos (correo, transportistas, etc.)
          </li>
          <li>
            <strong>Proveedores de Hosting:</strong> Para almacenamiento seguro de datos
          </li>
          <li>
            <strong>Plataformas de Análisis:</strong> Google Analytics, Mixpanel (anonimizadas)
          </li>
          <li>
            <strong>Soporte Técnico:</strong> Herramientas de ticketing (Zendesk, similar)
          </li>
          <li>
            <strong>Autoridades Públicas:</strong> Cuando lo requiera la ley (impuestos, policía, etc.)
          </li>
          <li>
            <strong>Servicios de Email Marketing:</strong> Para comunicaciones (con consentimiento)
          </li>
          <li>
            <strong>Sistemas Anti-fraude:</strong> Para protección de la Plataforma
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">6.2 Transferencias Internacionales</h3>
        <p>
          Algunos datos se transfieren fuera de la UE/EEE (especialmente a servidores de Stripe, Google, proveedores de hosting). Estas transferencias se basan en:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Decisión de Adecuación (ej: Suiza, Reino Unido)</li>
          <li>Cláusulas Contractuales Tipo (SCCs) de la Comisión Europea</li>
          <li>Certificaciones (ej: Privacy Shield si aplica)</li>
        </ul>

        <p>
          Puede solicitar información específica sobre garantías contactando a [CORREO ELECTRÓNICO DE CONTACTO].
        </p>
      </section>

      {/* Article 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          7. Derechos del Usuario
        </h2>

        <p>
          De conformidad con la normativa de protección de datos, usted tiene los siguientes derechos:
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.1 Derecho de Acceso</h3>
        <p>
          Puede solicitar acceso a los datos personales que mantenemos sobre usted. Le proporcionaremos una copia en formato legible.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.2 Derecho de Rectificación</h3>
        <p>
          Puede solicitar la corrección de datos inexactos o incompletos. Puede actualizar gran parte de sus datos directamente en su perfil.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.3 Derecho de Supresión ("Derecho al Olvido")</h3>
        <p>
          Puede solicitar la eliminación de sus datos personales, excepto cuando exista obligación legal de retención (datos contables, anti-fraude, etc.).
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.4 Derecho de Restricción del Tratamiento</h3>
        <p>
          Puede solicitar que limitemos el tratamiento de sus datos mientras verifica su exactitud o mientras se resuelve una disputa.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.5 Derecho de Portabilidad</h3>
        <p>
          Puede solicitar que le entreguemos sus datos en formato estructurado, común y legible por máquina para transferir a otro servicio.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.6 Derecho de Oposición</h3>
        <p>
          Puede oponerse al tratamiento de sus datos para fines de marketing directo o análisis. Simplemente puede desuscribirse de comunicaciones.
        </p>

        <h3 className="text-xl font-semibold text-black mt-4 mb-2">7.7 Derechos Relacionados con Decisiones Automatizadas</h3>
        <p>
          Si utilizamos perfilado o decisiones automatizadas, tiene derecho a no estar sujeto a tales decisiones, a menos que sean necesarias para ejecutar un contrato o que tenga consentimiento.
        </p>
      </section>

      {/* Article 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          8. Cómo Ejercer sus Derechos
        </h2>

        <p>
          Para ejercer cualquiera de los derechos anteriores, puede:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm space-y-3">
          <p><strong>Enviar solicitud escrita a:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</p>
          <p><strong>O por correo postal a:</strong> [DOMICILIO SOCIAL]</p>
          <p><strong>O a través de tu Cuenta:</strong> Sección de Privacidad/Datos Personales</p>
        </div>

        <p>
          Responderemos a su solicitud dentro de 30 días. Si es compleja, podemos extender el plazo 2 meses adicionales. No aplicamos cargo por ejercer derechos, salvo en solicitudes claramente infundadas.
        </p>
      </section>

      {/* Article 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          9. Seguridad de los Datos
        </h2>

        <p>
          Implementamos medidas técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida, alteración y destrucción:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Encriptación SSL/TLS de toda comunicación (HTTPS)</li>
          <li>Encriptación end-to-end de datos sensibles en reposo</li>
          <li>Autenticación multifactorial (opcional para usuarios)</li>
          <li>Firewalls y sistemas de detección de intrusiones</li>
          <li>Control de acceso basado en roles (RBAC)</li>
          <li>Auditorías de seguridad regulares</li>
          <li>Pruebas de penetración periódicas</li>
          <li>Backup automático de datos</li>
          <li>Política de acceso mínimo (principio de menor privilegio)</li>
          <li>Formación en privacidad para empleados</li>
        </ul>

        <p>
          A pesar de estas medidas, no podemos garantizar seguridad absoluta. Si sospecha una violación de datos, contacte inmediatamente a [CORREO ELECTRÓNICO DE CONTACTO].
        </p>
      </section>

      {/* Article 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          10. Menores de Edad
        </h2>

        <p>
          La Plataforma no está dirigida a menores de 18 años. No recopilamos deliberadamente datos de menores. Si descubrimos que hemos recopilado datos de un menor sin consentimiento de padres/tutores, procederemos inmediatamente a su eliminación.
        </p>

        <p>
          Los padres/tutores que tengan preocupaciones sobre datos de menores pueden contactar a [CORREO ELECTRÓNICO DE CONTACTO].
        </p>
      </section>

      {/* Article 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          11. Derechos de Datos de Vendedores
        </h2>

        <p>
          Los vendedores de NexoMarket son tratados como corresponsables de datos en ciertos aspectos. Específicamente:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>El vendedor es responsable de la veracidad de datos que proporciona</li>
          <li>El vendedor debe obtener consentimiento para procesar datos de sus clientes</li>
          <li>El vendedor debe cumplir RGPD/LOPD en mensajería a compradores</li>
          <li>El vendedor es responsable de políticas de privacidad en sus tiendas</li>
          <li>Hemos firmado Acuerdos de Procesamiento de Datos (DPA) con vendedores</li>
        </ul>
      </section>

      {/* Article 12 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          12. Derechos de Consumidores
        </h2>

        <p>
          Como consumidor en España, tiene derecho a presentar una reclamación ante la Autoridad de Protección de Datos competente:
        </p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 my-6 text-sm">
          <p className="font-semibold mb-3">Autoridad Española de Protección de Datos (AEPD)</p>
          <ul className="space-y-1 m-0">
            <li><strong>Web:</strong> www.aepd.es</li>
            <li><strong>Email:</strong> avpd@aepd.es</li>
            <li><strong>Dirección:</strong> C/ Jorge Juan 6, 28001 Madrid</li>
            <li><strong>Teléfono:</strong> +34 91 508 7600</li>
          </ul>
        </div>

        <p>
          También puede presentar reclamación ante la autoridad de protección de datos de otro país de la UE si es más conveniente.
        </p>
      </section>

      {/* Article 13 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          13. Violación de Datos
        </h2>

        <p>
          Si ocurre una violación de seguridad que afecte sus datos personales:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Notificaremos a la AEPD sin demora injustificada</li>
          <li>Le informaremos a usted si la violación presenta riesgo alto para sus derechos</li>
          <li>Proporcionaremos información sobre medidas mitigación</li>
        </ul>

        <p>
          Si tiene sospechas de una violación, contacte inmediatamente a [CORREO ELECTRÓNICO DE CONTACTO].
        </p>
      </section>

      {/* Article 14 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          14. Cambios a esta Política
        </h2>

        <p>
          Podemos actualizar esta Política de Privacidad periódicamente. Cambios materiales serán notificados con 30 días de anticipación. El uso continuado de la Plataforma implica aceptación de cambios.
        </p>

        <p>
          Revise regularmente esta página para estar informado sobre nuestras prácticas de privacidad.
        </p>
      </section>

      {/* Article 15 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          15. Contacto y Delegado de Protección de Datos
        </h2>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm space-y-3">
          <p><strong>Para consultas de privacidad:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</p>
          <p><strong>Delegado de Protección de Datos (DPO):</strong> dpo@nexomarket.com</p>
          <p><strong>Dirección Postal:</strong> [DOMICILIO SOCIAL]</p>
          <p><strong>Teléfono:</strong> [TELÉFONO]</p>
        </div>
      </section>

      {/* Final Note */}
      <section className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic">
          Esta Política de Privacidad forma parte integral de nuestros Términos y Condiciones. En caso de conflicto entre esta política y otras disposiciones, prevalecerá lo más favorable al usuario conforme a la normativa de protección de datos.
        </p>
      </section>
    </article>
  );
}
