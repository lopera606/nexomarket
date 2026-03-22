'use client';

import { Link } from '@/i18n/routing';
import { Download, Mail, Calendar } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    {
      date: '15 de Marzo de 2026',
      title: 'NexoMarket alcanza 500,000 clientes activos en todo el mundo',
      excerpt: 'Hito importante en el crecimiento de la plataforma con expansión a nuevos mercados.',
      emoji: '🎉',
    },
    {
      date: '10 de Febrero de 2026',
      title: 'Lanzamiento de la nueva función de compra con un clic',
      excerpt: 'Experiencia de compra más rápida y fluida para nuestros usuarios premium.',
      emoji: '⚡',
    },
    {
      date: '5 de Enero de 2026',
      title: 'NexoMarket invierte €5M en tecnología de IA',
      excerpt: 'Mejoras en recomendaciones personalizadas y experiencia de usuario.',
      emoji: '🤖',
    },
    {
      date: '20 de Diciembre de 2025',
      title: 'Asociación estratégica con Fundación Sostenible',
      excerpt: 'Compromiso con la sostenibilidad ambiental y comercio responsable.',
      emoji: '🌱',
    },
  ];

  const brands = ['Amazon', 'TechCrunch', 'El País', 'Expansión', 'Forbes', 'CNBC'];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-600/20 to-pink-600/20 border-b border-gray-200/20 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Centro de Prensa</h1>
          <p className="text-[#4A4A4A]">
            Últimas noticias, comunicados de prensa y recursos media sobre NexoMarket.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Press Releases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Comunicados de Prensa Recientes</h2>
          <div className="space-y-4">
            {pressReleases.map((release, idx) => (
              <Link
                key={idx}
                href={`/prensa/${idx + 1}`}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-200/50 transition flex gap-6"
              >
                <div className="text-4xl flex-shrink-0">{release.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#0066FF]400" />
                    <time className="text-sm text-gray-500">{release.date}</time>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-[#0066FF]300 transition mb-2">
                    {release.title}
                  </h3>
                  <p className="text-gray-500">{release.excerpt}</p>
                </div>
                <div className="text-[#0066FF]400 group-hover:text-[#0066FF]300 transition">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Kit de Medios</h2>
          <p className="text-[#4A4A4A] mb-6">
            Accede a logos de alta resolución, imágenes, directrices de marca y otros recursos para periodistas y medios.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Link
              href="/prensa/media-kit.zip"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              <Download className="w-5 h-5" />
              Kit Completo
            </Link>
            <Link
              href="/prensa/logos.zip"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              <Download className="w-5 h-5" />
              Logos
            </Link>
            <Link
              href="/prensa/imagenes.zip"
              className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              <Download className="w-5 h-5" />
              Imágenes
            </Link>
          </div>
        </div>

        {/* Hechos y Cifras */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Hechos y Cifras sobre NexoMarket</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#0066FF]400 mb-2">2,400+</div>
              <p className="text-[#4A4A4A]">Tiendas verificadas en la plataforma</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#0066FF]400 mb-2">1.2M+</div>
              <p className="text-[#4A4A4A]">Productos disponibles</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#0066FF]400 mb-2">500K+</div>
              <p className="text-[#4A4A4A]">Clientes activos</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-3xl font-bold text-[#0066FF]400 mb-2">15</div>
              <p className="text-[#4A4A4A]">Países de operación</p>
            </div>
          </div>
        </div>

        {/* Featured In */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Destacado En</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="grid grid-cols-3 gap-8 items-center">
              {brands.map((brand) => (
                <div key={brand} className="text-center py-4 border-r border-gray-200/20 last:border-r-0">
                  <p className="font-bold text-lg text-[#4A4A4A]">{brand}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Press Contact */}
        <div className="bg-gradient-to-r from-gray-600/20 to-pink-600/20 border border-gray-200/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Contacto de Prensa</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Consultas Generales de Prensa</h3>
              <p className="text-[#4A4A4A] mb-3">
                Para solicitudes de entrevistas, comentarios y consultas generales:
              </p>
              <a href="mailto:prensa@nexomarket.com" className="flex items-center gap-2 text-[#0066FF]400 hover:text-[#0066FF]300">
                <Mail className="w-5 h-5" />
                prensa@nexomarket.com
              </a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Director de Comunicaciones</h3>
              <p className="text-[#4A4A4A] mb-3">
                Ana Rodríguez - Directora de Relaciones Públicas
              </p>
              <div className="space-y-1">
                <a href="mailto:ana.rodriguez@nexomarket.com" className="flex items-center gap-2 text-[#0066FF]400 hover:text-[#0066FF]300">
                  <Mail className="w-5 h-5" />
                  ana.rodriguez@nexomarket.com
                </a>
                <p className="text-gray-500">+34 912 345 678</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Suscríbete a Nuestro Boletín de Prensa</h3>
          <p className="text-[#4A4A4A] mb-6">Recibe los últimos comunicados y noticias directamente en tu bandeja de entrada.</p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 bg-white text-black placeholder-slate-400 rounded-lg px-4 py-2 border border-gray-200/30 focus:outline-none focus:border-gray-200"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              Suscribir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
