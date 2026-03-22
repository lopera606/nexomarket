'use client';

import { Link } from '@/i18n/routing';
import { Users, TrendingUp, Globe, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Tiendas', value: '2,400+', icon: Users },
    { label: 'Productos', value: '1.2M+', icon: TrendingUp },
    { label: 'Clientes', value: '500K+', icon: Globe },
    { label: 'Países', value: '190+', icon: Award },
  ];

  const team = [
    { name: 'Carlos Martínez', role: 'CEO & Fundador', emoji: '👨‍💼' },
    { name: 'Laura González', role: 'CTO', emoji: '👩‍💻' },
    { name: 'Miguel Rodríguez', role: 'Director de Operaciones', emoji: '👨‍🏫' },
    { name: 'Sofia López', role: 'Directora de Producto', emoji: '👩‍🔬' },
  ];

  const timeline = [
    { year: 2018, event: 'Fundación de NexoMarket' },
    { year: 2020, event: 'Expansión internacional a 30+ países' },
    { year: 2022, event: 'Alcanzamos 1M de productos' },
    { year: 2024, event: 'Llegamos a 500K clientes activos' },
  ];

  const values = [
    { title: 'Transparencia', description: 'Confianza total con nuestros clientes y vendedores' },
    { title: 'Innovación', description: 'Tecnología de punta para mejorar la experiencia' },
    { title: 'Sostenibilidad', description: 'Compromiso con el medio ambiente' },
    { title: 'Comunidad', description: 'Apoyo mutuo entre vendedores y compradores' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-black">
            Sobre NexoMarket
          </h1>
          <p className="text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Revolucionando el comercio electrónico a nivel mundial con una plataforma justa, transparente e innovadora para vendedores y compradores.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-black">Nuestra Misión</h2>
          <p className="text-[#4A4A4A] text-lg leading-relaxed">
            En NexoMarket creemos que el comercio electrónico debe ser accesible, justo y beneficioso para todos. Nuestra misión es conectar pequeños y medianos vendedores con millones de compradores en todo el mundo, proporcionando herramientas innovadoras y un entorno transparente donde pueda florecer el negocio digital.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Icon className="w-8 h-8 text-[#0066FF] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[#0066FF] mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#0066FF]">Nuestro Recorrido</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-pink-500"></div>
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={item.year} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 text-right pr-8">
                    {idx % 2 === 0 && (
                      <div>
                        <div className="text-3xl font-bold text-[#0066FF]">{item.year}</div>
                        <div className="text-[#4A4A4A]">{item.event}</div>
                      </div>
                    )}
                  </div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 flex-shrink-0"></div>
                  <div className="w-1/2 pl-8">
                    {idx % 2 !== 0 && (
                      <div>
                        <div className="text-3xl font-bold text-[#0066FF]">{item.year}</div>
                        <div className="text-[#4A4A4A]">{item.event}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#0066FF]">Nuestro Equipo</h2>
          <div className="grid grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-[#0066FF]/50 transition">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-[#0066FF] text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-[#0066FF]">Nuestros Valores</h2>
          <div className="grid grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#0066FF] mb-2">{value.title}</h3>
                <p className="text-[#4A4A4A]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">¿Quieres ser parte de NexoMarket?</h3>
          <p className="text-[#4A4A4A] mb-6">Únete a miles de vendedores exitosos o crea tu cuenta de comprador hoy.</p>
          <div className="flex justify-center gap-4">
            <Link href="/vendedor/registro" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition">
              Vende en NexoMarket
            </Link>
            <Link href="/registro" className="border border-gray-500 hover:border-[#0066FF] px-8 py-3 rounded-lg font-semibold transition">
              Crea tu Cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
