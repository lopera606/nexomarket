'use client';

export default function AvisoLegalPage() {
  const lastUpdated = 'Marzo 2026';

  return (
    <article className="prose prose-sm max-w-none px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mt-0 mb-3 sm:mb-4">Aviso Legal</h1>
        <p className="text-xs sm:text-sm text-[#4A4A4A] m-0">
          <strong>Última actualización:</strong> {lastUpdated}
        </p>
      </div>

      {/* Article 1 */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-black mt-4 sm:mt-6 mb-3 sm:mb-4">
          1. Identificación del Responsable
        </h2>

        <p>
          De conformidad con lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ofrece la siguiente información:
        </p>

        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4 sm:p-6 my-4 sm:my-6 text-xs sm:text-sm">
          <p className="font-semibold text-black mb-3">Datos de la Empresa</p>
          <ul className="space-y-2 m-0">
            <li><strong>Razón Social:</strong> [RAZÓN SOCIAL]</li>
            <li><strong>CIF/NIF:</strong> [CIF/NIF]</li>
            <li><strong>Domicilio Social:</strong> [DOMICILIO SOCIAL]</li>
            <li><strong>Correo Electrónico:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</li>
            <li><strong>Teléfono:</strong> [TELÉFONO]</li>
            <li><strong>Registro Mercantil:</strong> [REGISTRO MERCANTIL]</li>
          </ul>
        </div>
      </section>

      {/* Article 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          2. Titularidad del Sitio Web
        </h2>

        <p>
          El presente sitio web y todos sus contenidos, incluyendo pero no limitado a textos, gráficos, logos, imágenes, archivos de audio y vídeo, iconos, fotografías, software y cualquier otra información son titularidad exclusiva de [RAZÓN SOCIAL] o de terceros licenciantes, siendo protegidos por las leyes de propiedad intelectual e industrial.
        </p>

        <p>
          El usuario se obliga a respetar todos y cada uno de los derechos de propiedad intelectual e industrial titularidad de NexoMarket. En particular, la reproducción, transformación, distribución, comunicación pública o puesta a disposición de los contenidos de este sitio web requiere la previa autorización escrita del titular.
        </p>
      </section>

      {/* Article 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          3. Objeto y Finalidad del Sitio Web
        </h2>

        <p>
          NexoMarket es un marketplace o mercado electrónico que actúa como plataforma de intermediación entre vendedores y compradores, permitiendo la compraventa de productos y servicios a través de Internet.
        </p>

        <p>
          La empresa se obliga a procurar que los contenidos, servicios e información del sitio web sean exactos, correctos y actualizados, aunque no garantiza la completa ausencia de errores o inexactitudes.
        </p>
      </section>

      {/* Article 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          4. Cambios y Actualizaciones
        </h2>

        <p>
          [RAZÓN SOCIAL] se reserva el derecho a cambiar, modificar o actualizar el contenido, diseño y funcionalidad del sitio web sin necesidad de previo aviso. El usuario acepta que estos cambios puedan afectar su experiencia de uso del sitio web.
        </p>
      </section>

      {/* Article 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          5. Exclusión de Responsabilidad
        </h2>

        <p>
          [RAZÓN SOCIAL] no será responsable por:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>
            Los daños y perjuicios de cualquier naturaleza derivados de la disponibilidad, acceso, uso o falta de disponibilidad del sitio web o de sus contenidos
          </li>
          <li>
            La existencia de virus, gusanos, malware o cualquier otro elemento que pueda causar alteración en los sistemas informáticos del usuario
          </li>
          <li>
            Las interferencias, cortes de acceso, desconexiones o lentitud en el funcionamiento derivadas de causas ajenas a [RAZÓN SOCIAL]
          </li>
          <li>
            Los contenidos e información aportados por los usuarios, incluyendo vendedores y compradores
          </li>
          <li>
            Los defectos o inexactitudes en los contenidos del sitio web
          </li>
          <li>
            El incumplimiento de las obligaciones de terceros contratados para la provisión de servicios
          </li>
        </ul>

        <p>
          En ningún caso [RAZÓN SOCIAL] será responsable por los daños y perjuicios que pudieran derivarse del mal uso del sitio web o de incumplimientos de la ley.
        </p>
      </section>

      {/* Article 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          6. Política de Uso Aceptable
        </h2>

        <p>
          El usuario se compromete a utilizar el sitio web de conformidad con la ley y a no utilizarlo con fines ilícitos o lesivos para derechos de terceros. En particular, el usuario se obliga a no:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>Violar o infringir los derechos de propiedad intelectual e industrial</li>
          <li>Acceder sin autorización a sistemas, redes o cuentas de terceros</li>
          <li>Distribuir virus, malware o código malicioso</li>
          <li>Enviar spam, mensajes publicitarios no solicitados o correos masivos</li>
          <li>Ejercer actividades ilícitas o contrarias a la ley</li>
          <li>Suplantar la identidad de terceros</li>
          <li>Difamar, injuriar o insultar a terceros</li>
        </ul>
      </section>

      {/* Article 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          7. Limitación de Responsabilidad
        </h2>

        <p>
          [RAZÓN SOCIAL] actúa como intermediaria entre compradores y vendedores. La empresa no es responsable de:
        </p>

        <ul className="list-decimal list-inside space-y-2 text-[#4A4A4A]">
          <li>La calidad, idoneidad, legalidad o exactitud de los productos y servicios ofertados por vendedores</li>
          <li>El cumplimiento de los compradores respecto a los pagos</li>
          <li>El cumplimiento de los vendedores respecto a la entrega y características de los productos</li>
          <li>Los incumplimientos contractuales entre compradores y vendedores</li>
          <li>Las transacciones que se realicen fuera de la plataforma</li>
        </ul>

        <p>
          Los usuarios reconocen que cualquier relación contractual se establece exclusivamente entre comprador y vendedor.
        </p>
      </section>

      {/* Article 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          8. Acceso a Terceros
        </h2>

        <p>
          El sitio web puede contener enlaces o referencias a sitios web de terceros. [RAZÓN SOCIAL] no controla, no es responsable ni respalda los contenidos, productos, servicios u opiniones expresados en esos sitios web.
        </p>

        <p>
          La inclusión de enlaces no implica relación alguna entre [RAZÓN SOCIAL] y los titulares de los sitios web enlazados, ni supone la aceptación o aprobación de sus contenidos.
        </p>
      </section>

      {/* Article 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          9. Derecho de Rectificación
        </h2>

        <p>
          El usuario reconoce que es responsable de la exactitud y veracidad de los datos que proporcione a [RAZÓN SOCIAL]. La empresa no es responsable por datos inexactos, incompletos o falsos proporcionados por el usuario.
        </p>

        <p>
          El usuario podrá solicitar la rectificación de sus datos en cualquier momento contactando a través del correo electrónico [CORREO ELECTRÓNICO DE CONTACTO].
        </p>
      </section>

      {/* Article 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          10. Protección de Datos
        </h2>

        <p>
          La recopilación, procesamiento y protección de datos personales se realizará de conformidad con la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPD-GDD) y el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 (RGPD).
        </p>

        <p>
          Consulte nuestra Política de Privacidad para más información sobre cómo tratamos sus datos personales.
        </p>
      </section>

      {/* Article 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          11. Cumplimiento de la Ley
        </h2>

        <p>
          El presente aviso legal está regido por las leyes españolas. Los usuarios aceptan someterse a la jurisdicción de los juzgados y tribunales competentes de la Comunidad de Madrid, de conformidad con lo dispuesto en la Ley 1/2000, de 7 de enero, de Enjuiciamiento Civil.
        </p>

        <p>
          En caso de conflicto entre la regulación nacional e internacional, prevalecerá aquella disposición más favorable al usuario consumidor, de conformidad con los principios de la Unión Europea.
        </p>
      </section>

      {/* Article 12 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-black mt-6 mb-4">
          12. Contacto
        </h2>

        <p>
          Para cualquier consulta, reclamación o comunicación relativa a este aviso legal, puede contactar con [RAZÓN SOCIAL] a través de:
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6 text-sm">
          <ul className="space-y-2 m-0">
            <li><strong>Correo Electrónico:</strong> [CORREO ELECTRÓNICO DE CONTACTO]</li>
            <li><strong>Teléfono:</strong> [TELÉFONO]</li>
            <li><strong>Dirección Postal:</strong> [DOMICILIO SOCIAL]</li>
          </ul>
        </div>
      </section>

      {/* Final Note */}
      <section className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic">
          Este aviso legal se aplica exclusivamente al sitio web de NexoMarket y es independiente de los términos y condiciones de uso y política de privacidad. En caso de conflicto entre este aviso y otros documentos legales, prevalecerá la disposición más favorable al usuario.
        </p>
      </section>
    </article>
  );
}
