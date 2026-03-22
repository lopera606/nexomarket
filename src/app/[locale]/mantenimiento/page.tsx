'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Shield, Bell, ArrowRight, Sparkles, Clock, Store, Globe } from 'lucide-react';

export default function MantenimientoPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown to "launch" — set to 15 days from now as placeholder
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 15);
    launchDate.setHours(0, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-200/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-200/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/5 rounded-full blur-[200px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-[#0066FF] rounded-2xl flex items-center justify-center shadow-[0_2px_60px_rgba(0,102,255,0.2)]">
            <span className="text-white font-black text-2xl">N</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-black">
            Nexo<span className="text-[#0066FF]">Market</span>
          </span>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#0066FF]" />
          <span className="text-[#0066FF] text-sm font-medium">Lanzamiento próximamente</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center text-black leading-tight mb-4 max-w-3xl">
          Algo grande está{' '}
          <span className="text-[#0066FF]">
            en camino
          </span>
        </h1>

        <p className="text-gray-400 text-center text-lg max-w-xl mb-10">
          El marketplace multi-vendedor que conecta vendedores y compradores de todo el mundo. Estamos preparando algo grande para ti.
        </p>

        {/* Countdown */}
        <div className="flex gap-3 sm:gap-5 mb-12">
          {[
            { value: timeLeft.days, label: 'Días' },
            { value: timeLeft.hours, label: 'Horas' },
            { value: timeLeft.minutes, label: 'Min' },
            { value: timeLeft.seconds, label: 'Seg' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-gray-500 text-xs font-medium mt-2">{label}</span>
            </div>
          ))}
        </div>

        {/* Email signup */}
        <div className="w-full max-w-md">
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="flex-1 relative">
                <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-[#5B2FE8] to-[#7C5CF0] text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
              >
                Avisarme <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-emerald-300 font-semibold">Te avisaremos cuando lancemos</span>
            </div>
          )}
          <p className="text-gray-600 text-xs text-center mt-3">Sin spam. Solo te avisaremos del lanzamiento.</p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl w-full">
          {[
            { icon: Store, label: 'Multi-vendedor', desc: '2,400+ tiendas' },
            { icon: Shield, label: 'Pago seguro', desc: 'Stripe integrado' },
            { icon: Rocket, label: 'Envíos globales', desc: 'Shippo + carriers' },
            { icon: Globe, label: 'Todo el mundo', desc: '190+ países' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center hover:border-gray-300 transition-colors group">
              <Icon className="w-6 h-6 text-[#0066FF] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">&copy; 2026 NexoMarket. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
