'use client';

import { Link } from '@/i18n/routing';
import { MapPin, Briefcase, Users } from 'lucide-react';

export default function CareersPage() {
  const benefits = [
    { emoji: '🏠', title: 'Trabajo Remoto', description: 'Trabaja desde cualquier lugar' },
    { emoji: '📚', title: 'Formación Continua', description: 'Presupuesto para desarrollo profesional' },
    { emoji: '⏰', title: '25 Días Vacaciones', description: 'Más de 3 semanas de descanso' },
    { emoji: '💰', title: 'Salario Competitivo', description: 'Basado en mercado y experiencia' },
    { emoji: '🎯', title: 'Bonus Anual', description: 'Hasta 3 meses de salario' },
    { emoji: '🏥', title: 'Seguro Médico', description: 'Para ti y tu familia' },
  ];

  const culture = [
    {
      title: 'Innovación',
      description: 'Experimentamos constantemente con nuevas ideas y tecnologías',
      emoji: '💡',
    },
    {
      title: 'Colaboración',
      description: 'Trabajamos juntos para resolver problemas complejos',
      emoji: '🤝',
    },
    {
      title: 'Transparencia',
      description: 'Comunicación abierta y decisiones compartidas',
      emoji: '💬',
    },
    {
      title: 'Crecimiento',
      description: 'Oportunidades de desarrollo carrera constante',
      emoji: '📈',
    },
  ];

  const positions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Ingeniería',
      location: 'Remoto (España)',
      type: 'Jornada Completa',
      level: 'Senior',
      emoji: '👨‍💻',
    },
    {
      title: 'Product Manager',
      department: 'Producto',
      location: 'Madrid',
      type: 'Jornada Completa',
      level: 'Mid-Level',
      emoji: '🎯',
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remoto (Global)',
      type: 'Jornada Completa',
      level: 'Mid-Level',
      emoji: '📢',
    },
    {
      title: 'DevOps Engineer',
      department: 'Ingeniería',
      location: 'Barcelona',
      type: 'Jornada Completa',
      level: 'Senior',
      emoji: '⚙️',
    },
    {
      title: 'Community Manager',
      department: 'Marketing',
      location: 'Remoto',
      type: 'Jornada Completa',
      level: 'Junior',
      emoji: '👥',
    },
    {
      title: 'Data Analyst',
      department: 'Datos',
      location: 'Remoto (España)',
      type: 'Jornada Completa',
      level: 'Mid-Level',
      emoji: '📊',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-600/20 to-pink-600/20 border-b border-gray-200/20 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Únete a Nuestro Equipo</h1>
          <p className="text-[#4A4A4A]">
            Estamos buscando talentos apasionados para revolucionar el comercio electrónico a nivel mundial
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Why Work Here */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">¿Por Qué Trabajar en NexoMarket?</h2>
          <div className="grid grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">{benefit.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Culture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Nuestra Cultura</h2>
          <div className="grid grid-cols-4 gap-6">
            {culture.map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#0066FF]400 mb-2">180+</div>
            <p className="text-gray-500">Empleados en 8 países</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#0066FF]400 mb-2">92%</div>
            <p className="text-gray-500">Satisfacción de empleados</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#0066FF]400 mb-2">€25K</div>
            <p className="text-gray-500">Presupuesto anual formación</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#0066FF]400 mb-2">4.8/5</div>
            <p className="text-gray-500">Puntuación en Glassdoor</p>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Posiciones Abiertas</h2>
          <div className="space-y-4">
            {positions.map((position, idx) => (
              <Link
                key={idx}
                href={`/empleo/${idx + 1}`}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-200/50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{position.emoji}</span>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-[#0066FF]300 transition">
                          {position.title}
                        </h3>
                        <p className="text-sm text-[#0066FF]400">{position.department}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Briefcase className="w-4 h-4" />
                        {position.type}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        {position.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#0066FF]400 group-hover:text-[#0066FF]300 transition text-lg">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Hiring Process */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Nuestro Proceso de Selección</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold mb-2">1. Solicitud</h3>
              <p className="text-sm text-gray-500">Envía tu CV y cover letter</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-bold mb-2">2. Entrevista</h3>
              <p className="text-sm text-gray-500">Charla inicial por teléfono</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-bold mb-2">3. Prueba</h3>
              <p className="text-sm text-gray-500">Prueba técnica (si aplica)</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold mb-2">4. Oferta</h3>
              <p className="text-sm text-gray-500">Celebramos tu incorporación</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Lo que Dicen Nuestros Empleados</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                quote: 'El mejor lugar donde he trabajado. Equipo increíble y oportunidades de crecimiento.',
                author: 'Marina G.',
                role: 'Senior Developer',
                emoji: '👩‍💻',
              },
              {
                quote: 'La flexibilidad y confianza que dan es excepcional. Trabajo remoto sin estrés.',
                author: 'Carlos M.',
                role: 'Product Manager',
                emoji: '👨‍💼',
              },
              {
                quote: 'Ambiente de trabajo saludable, desafiante y muy colaborativo. ¡Recomendado!',
                author: 'Sofia P.',
                role: 'Marketing Manager',
                emoji: '👩‍🎓',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-4xl mb-4">{testimonial.emoji}</div>
                <p className="text-[#4A4A4A] mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200/20 pt-4">
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-[#0066FF]400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perks & Facilities */}
        <div className="grid grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Beneficios Adicionales</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">✓</span>
                <span>Equipamiento de trabajo (laptop, monitor, periféricos)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">✓</span>
                <span>Suscripción a Udemy Premium</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">✓</span>
                <span>Acceso a gym online</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">✓</span>
                <span>Bonificación por referral de talento</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">✓</span>
                <span>Stock options (en roles senior)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">✓</span>
                <span>Reuniones de team building trimestral</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Valores que Buscamos</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">⭐</span>
                <span>Iniciativa y autonomía en la toma de decisiones</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">⭐</span>
                <span>Pasión por aprender y mejorar continuamente</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">⭐</span>
                <span>Colaboración y empatía con el equipo</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">⭐</span>
                <span>Responsabilidad y compromiso con la calidad</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">⭐</span>
                <span>Adaptabilidad a cambios y nuevos retos</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0066FF]400">⭐</span>
                <span>Transparencia y comunicación honesta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para Comenzar Tu Aventura?</h2>
          <p className="text-[#4A4A4A] mb-6">
            Explora nuestras posiciones abiertas y envía tu solicitud hoy.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/empleo/aplicar" className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition">
              Ver Todas las Posiciones
            </Link>
            <Link href="/empleo/contacto" className="border border-green-500 hover:border-green-400 px-8 py-3 rounded-lg font-semibold transition">
              Contactar Recursos Humanos
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">¿Nuevas Oportunidades?</h3>
          <p className="text-[#4A4A4A] mb-6">Suscríbete para recibir notificaciones de nuevas posiciones.</p>
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
