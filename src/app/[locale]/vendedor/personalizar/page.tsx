'use client';

import { useState } from 'react';
import { Upload, Eye, Save, Clock, Phone, Mail, MapPin, Globe, Plus, Trash2, ChevronDown, ChevronUp, Palette, Store, Shield, Truck, Search, MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Social media platforms config
const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', prefix: '@', placeholder: 'tu_usuario', icon: '📸', color: 'from-blue-500/20 to-pink-500/20 text-blue-400' },
  { key: 'twitter', label: 'X (Twitter)', prefix: '@', placeholder: 'tu_usuario', icon: '𝕏', color: 'bg-gray-500/20 text-[#4A4A4A]' },
  { key: 'facebook', label: 'Facebook', prefix: 'facebook.com/', placeholder: 'tu_pagina', icon: 'f', color: 'bg-blue-600/20 text-blue-400' },
  { key: 'tiktok', label: 'TikTok', prefix: '@', placeholder: 'tu_usuario', icon: '♪', color: 'bg-pink-500/20 text-pink-400' },
  { key: 'youtube', label: 'YouTube', prefix: 'youtube.com/', placeholder: '@tu_canal', icon: '▶', color: 'bg-red-500/20 text-red-400' },
  { key: 'linkedin', label: 'LinkedIn', prefix: 'linkedin.com/company/', placeholder: 'tu_empresa', icon: 'in', color: 'bg-blue-700/20 text-blue-400' },
  { key: 'pinterest', label: 'Pinterest', prefix: 'pinterest.com/', placeholder: 'tu_perfil', icon: 'P', color: 'bg-red-600/20 text-red-400' },
  { key: 'whatsapp', label: 'WhatsApp Business', prefix: '+', placeholder: '34 612 345 678', icon: '💬', color: 'bg-green-500/20 text-green-400' },
  { key: 'telegram', label: 'Telegram', prefix: '@', placeholder: 'tu_canal', icon: '✈', color: 'bg-blue-400/20 text-[#0066FF]' },
  { key: 'website', label: 'Sitio Web', prefix: 'https://', placeholder: 'www.tu-tienda.com', icon: '🌐', color: 'bg-gray-500/20 text-[#4A4A4A]' },
];

const DAYS = [
  { key: 'mon', label: 'Lunes' },
  { key: 'tue', label: 'Martes' },
  { key: 'wed', label: 'Miércoles' },
  { key: 'thu', label: 'Jueves' },
  { key: 'fri', label: 'Viernes' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
];

const PAYMENT_METHODS = [
  { key: 'visa', label: 'Visa', icon: '💳' },
  { key: 'mastercard', label: 'Mastercard', icon: '💳' },
  { key: 'amex', label: 'American Express', icon: '💳' },
  { key: 'paypal', label: 'PayPal', icon: '🅿️' },
  { key: 'bizum', label: 'Bizum', icon: '📱' },
  { key: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
  { key: 'contrareembolso', label: 'Contrareembolso', icon: '💵' },
  { key: 'klarna', label: 'Klarna', icon: '🔄' },
  { key: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
  { key: 'google_pay', label: 'Google Pay', icon: '📱' },
];

const STORE_LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
];

export default function PersonalizarPage() {
  const [activeSection, setActiveSection] = useState('info');
  const [storeData, setStoreData] = useState({
    // Basic Info
    name: 'Mi Tienda Premium',
    description: 'Tienda de tecnología y accesorios con los mejores precios del mercado',
    tagline: '',
    storeUrl: 'mitienda',

    // Branding
    logo: null as string | null,
    banner: null as string | null,
    favicon: null as string | null,
    primaryColor: '#5B2FE8',
    secondaryColor: '#FF6B35',
    accentColor: '#10B981',
    backgroundColor: '#0F172A',
    fontStyle: 'modern',

    // Social Media
    socialLinks: {
      instagram: '@mitienda',
      twitter: '@mitienda',
      facebook: 'mitienda',
      tiktok: '',
      youtube: '',
      linkedin: '',
      pinterest: '',
      whatsapp: '',
      telegram: '',
      website: '',
    } as Record<string, string>,

    // Contact
    email: 'contacto@mitienda.com',
    phone: '+34 123 456 789',
    supportEmail: '',

    // Location
    address: '',
    city: '',
    state: '',
    country: 'ES',
    postalCode: '',
    showMap: false,

    // Business Hours
    businessHours: DAYS.reduce((acc, day) => ({
      ...acc,
      [day.key]: { open: day.key === 'sun' ? '10:00' : '09:00', close: day.key === 'sun' ? '14:00' : '20:00', closed: day.key === 'sun' }
    }), {} as Record<string, { open: string; close: string; closed: boolean }>),

    // Shipping & Returns
    freeShippingMinimum: 50,
    avgDeliveryDays: '3-5',
    returnDays: 30,
    shippingInfo: '',
    internationalShipping: false,

    // Payment
    acceptedPayments: ['visa', 'mastercard', 'paypal'] as string[],

    // Announcement
    announcement: '',
    announcementActive: false,
    announcementColor: '#F59E0B',

    // SEO
    metaTitle: '',
    metaDescription: '',
    keywords: '',

    // Languages
    languages: ['es'] as string[],

    // Trust / Certifications
    certifications: [] as string[],
    customCertification: '',

    // FAQ
    faq: [
      { question: '¿Cuáles son los plazos de envío?', answer: 'El envío estándar tarda 3-5 días laborables.' },
    ] as Array<{ question: string; answer: string }>,

    // Store Features (badges shown on store page)
    features: ['Envío gratuito desde 50€', 'Devoluciones en 30 días', 'Atención al cliente 24/7'] as string[],
    newFeature: '',
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    info: true, branding: false, social: false, contact: false, hours: false,
    shipping: false, payment: false, announcement: false, seo: false, languages: false,
    trust: false, faq: false, features: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setStoreData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleHoursChange = (day: string, field: string, value: any) => {
    setStoreData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day], [field]: value },
      },
    }));
  };

  const togglePayment = (method: string) => {
    setStoreData(prev => ({
      ...prev,
      acceptedPayments: prev.acceptedPayments.includes(method)
        ? prev.acceptedPayments.filter(m => m !== method)
        : [...prev.acceptedPayments, method],
    }));
  };

  const toggleLanguage = (code: string) => {
    setStoreData(prev => ({
      ...prev,
      languages: prev.languages.includes(code)
        ? prev.languages.filter(l => l !== code)
        : [...prev.languages, code],
    }));
  };

  const addFaq = () => {
    setStoreData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }],
    }));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setStoreData(prev => ({
      ...prev,
      faq: prev.faq.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
  };

  const removeFaq = (index: number) => {
    setStoreData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (storeData.newFeature.trim()) {
      setStoreData(prev => ({
        ...prev,
        features: [...prev.features, prev.newFeature.trim()],
        newFeature: '',
      }));
    }
  };

  const removeFeature = (index: number) => {
    setStoreData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // In production, POST to /api/store/customize
      await new Promise(r => setTimeout(r, 1500));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch {
      setSaveStatus('error');
    }
  };

  // Collapsible Section Component
  const Section = ({ id, title, icon, children, badge }: {
    id: string; title: string; icon: React.ReactNode; children: React.ReactNode; badge?: string;
  }) => (
    <Card className="border-0 shadow-sm overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#4A4A4A]">{icon}</span>
          <h2 className="text-lg font-bold text-black">{title}</h2>
          {badge && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        {expandedSections[id] ? <ChevronUp className="w-5 h-5 text-[#4A4A4A]" /> : <ChevronDown className="w-5 h-5 text-[#4A4A4A]" />}
      </button>
      {expandedSections[id] && <div className="px-6 pb-6 space-y-5">{children}</div>}
    </Card>
  );

  const inputClasses = "w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  // Navigation sidebar items
  const NAV_ITEMS = [
    { id: 'info', label: 'Información', icon: <Store className="w-4 h-4" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4" /> },
    { id: 'social', label: 'Redes Sociales', icon: <Globe className="w-4 h-4" /> },
    { id: 'contact', label: 'Contacto', icon: <Mail className="w-4 h-4" /> },
    { id: 'hours', label: 'Horarios', icon: <Clock className="w-4 h-4" /> },
    { id: 'shipping', label: 'Envíos y Devoluciones', icon: <Truck className="w-4 h-4" /> },
    { id: 'payment', label: 'Métodos de Pago', icon: <Shield className="w-4 h-4" /> },
    { id: 'announcement', label: 'Anuncio', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'languages', label: 'Idiomas', icon: <Globe className="w-4 h-4" /> },
    { id: 'trust', label: 'Confianza', icon: <Shield className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'features', label: 'Características', icon: <Plus className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r text-black ">
            Personalizar Tienda
          </h1>
          <p className="text-[#4A4A4A] text-lg">Configura todos los aspectos de tu tienda</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-gray-300 hover:bg-gray-100">
            <Eye className="h-4 w-4" />
            Vista Previa
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`gap-2 text-black border-0 ${
              saveStatus === 'saved'
                ? 'bg-green-600 hover:bg-green-700'
                : saveStatus === 'error'
                ? 'bg-red-600'
                : 'bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {saveStatus === 'saving' && <Clock className="h-4 w-4 animate-spin" />}
            {saveStatus === 'saved' ? '✓ Guardado' : saveStatus === 'error' ? 'Error' : <><Save className="h-4 w-4" /> Guardar</>}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Quick Nav Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-4 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Secciones</h3>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setExpandedSections(prev => ({ ...prev, [item.id]: true }));
                    document.getElementById(`section-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#4A4A4A] hover:text-black hover:bg-gray-50 transition-colors text-left"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">

          {/* === INFORMACIÓN BÁSICA === */}
          <div id="section-info">
            <Section id="info" title="Información de la Tienda" icon={<Store className="w-5 h-5" />}>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Nombre de la Tienda</label>
                <input type="text" value={storeData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Eslogan / Tagline</label>
                <input
                  type="text"
                  value={storeData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Ej: La mejor tecnología al mejor precio"
                  className={inputClasses}
                />
                <p className="text-xs text-gray-500 mt-1">Aparece debajo del nombre en tu tienda</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Descripción</label>
                <textarea
                  value={storeData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                />
                <p className="text-xs text-gray-500 mt-1">{storeData.description.length}/500 caracteres</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">URL de la Tienda</label>
                <div className="flex items-center gap-3">
                  <span className="text-[#4A4A4A] text-sm">nexomarket.com/tienda/</span>
                  <input type="text" value={storeData.storeUrl} onChange={(e) => handleInputChange('storeUrl', e.target.value)} className={`${inputClasses} flex-1`} />
                </div>
              </div>
            </Section>
          </div>

          {/* === BRANDING === */}
          <div id="section-branding">
            <Section id="branding" title="Branding y Diseño" icon={<Palette className="w-5 h-5" />}>
              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Logo de la Tienda</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gradient-to-br from-blue-500/5 to-transparent hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                  <p className="font-medium text-black text-sm">Arrastra o haz clic para subir</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG hasta 5MB | Recomendado: 400x400px</p>
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Banner Principal</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gradient-to-br from-blue-500/5 to-transparent hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                  <p className="font-medium text-black text-sm">Arrastra o haz clic para subir</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB | Recomendado: 1920x400px</p>
                </div>
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Favicon</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer inline-block">
                  <Upload className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">32x32px ICO/PNG</p>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-black mb-4">Paleta de Colores</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'primaryColor', label: 'Primario' },
                    { key: 'secondaryColor', label: 'Secundario' },
                    { key: 'accentColor', label: 'Acento' },
                    { key: 'backgroundColor', label: 'Fondo' },
                  ].map((color) => (
                    <div key={color.key}>
                      <p className="text-xs text-[#4A4A4A] mb-2">{color.label}</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={(storeData as any)[color.key]}
                          onChange={(e) => handleInputChange(color.key, e.target.value)}
                          className="w-10 h-10 rounded-lg border border-gray-600 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={(storeData as any)[color.key]}
                          onChange={(e) => handleInputChange(color.key, e.target.value)}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">Estilo de Fuente</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'modern', label: 'Moderna', font: 'Inter' },
                    { key: 'classic', label: 'Clásica', font: 'Georgia' },
                    { key: 'minimal', label: 'Minimalista', font: 'Helvetica' },
                  ].map((style) => (
                    <button
                      key={style.key}
                      onClick={() => handleInputChange('fontStyle', style.key)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        storeData.fontStyle === style.key
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <p className="text-black font-medium text-sm" style={{ fontFamily: style.font }}>{style.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{style.font}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          {/* === REDES SOCIALES === */}
          <div id="section-social">
            <Section id="social" title="Redes Sociales" icon={<Globe className="w-5 h-5" />} badge={`${Object.values(storeData.socialLinks).filter(Boolean).length} activas`}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Conecta tus redes sociales para que los clientes puedan seguirte y contactarte
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.key} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs text-gray-500 mb-1">{platform.label}</label>
                      <input
                        type="text"
                        value={storeData.socialLinks[platform.key] || ''}
                        onChange={(e) => handleSocialChange(platform.key, e.target.value)}
                        placeholder={platform.placeholder}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* === CONTACTO === */}
          <div id="section-contact">
            <Section id="contact" title="Información de Contacto" icon={<Mail className="w-5 h-5" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Email principal</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#4A4A4A] flex-shrink-0" />
                    <input type="email" value={storeData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Email de soporte</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#4A4A4A] flex-shrink-0" />
                    <input type="email" value={storeData.supportEmail} onChange={(e) => handleInputChange('supportEmail', e.target.value)} placeholder="soporte@mitienda.com" className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Teléfono</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#4A4A4A] flex-shrink-0" />
                    <input type="tel" value={storeData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={inputClasses} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-5">
                <label className="block text-sm font-semibold text-black mb-3">
                  <MapPin className="inline w-4 h-4 mr-1" /> Ubicación física
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" value={storeData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Dirección" className={inputClasses} />
                  <input type="text" value={storeData.city} onChange={(e) => handleInputChange('city', e.target.value)} placeholder="Ciudad" className={inputClasses} />
                  <input type="text" value={storeData.state} onChange={(e) => handleInputChange('state', e.target.value)} placeholder="Provincia/Estado" className={inputClasses} />
                  <input type="text" value={storeData.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} placeholder="Código postal" className={inputClasses} />
                </div>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input type="checkbox" checked={storeData.showMap} onChange={(e) => handleInputChange('showMap', e.target.checked)} className="rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500" />
                  <span className="text-sm text-[#4A4A4A]">Mostrar mapa en la página de la tienda</span>
                </label>
              </div>
            </Section>
          </div>

          {/* === HORARIOS === */}
          <div id="section-hours">
            <Section id="hours" title="Horario de Atención" icon={<Clock className="w-5 h-5" />}>
              <div className="space-y-3">
                {DAYS.map((day) => (
                  <div key={day.key} className="flex items-center gap-4">
                    <span className="w-24 text-sm text-[#4A4A4A] font-medium">{day.label}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!storeData.businessHours[day.key]?.closed}
                        onChange={(e) => handleHoursChange(day.key, 'closed', !e.target.checked)}
                        className="rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500"
                      />
                    </label>
                    {!storeData.businessHours[day.key]?.closed ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={storeData.businessHours[day.key]?.open || '09:00'}
                          onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={storeData.businessHours[day.key]?.close || '20:00'}
                          onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                          className="rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* === ENVÍOS Y DEVOLUCIONES === */}
          <div id="section-shipping">
            <Section id="shipping" title="Envíos y Devoluciones" icon={<Truck className="w-5 h-5" />}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Envío gratis desde (€)</label>
                  <input type="number" value={storeData.freeShippingMinimum} onChange={(e) => handleInputChange('freeShippingMinimum', Number(e.target.value))} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Plazo de entrega</label>
                  <input type="text" value={storeData.avgDeliveryDays} onChange={(e) => handleInputChange('avgDeliveryDays', e.target.value)} placeholder="3-5 días" className={inputClasses} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Días para devolver</label>
                  <input type="number" value={storeData.returnDays} onChange={(e) => handleInputChange('returnDays', Number(e.target.value))} className={inputClasses} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Información adicional de envío</label>
                <textarea
                  value={storeData.shippingInfo}
                  onChange={(e) => handleInputChange('shippingInfo', e.target.value)}
                  placeholder="Describe tu política de envíos, zonas de cobertura, etc."
                  rows={3}
                  className={`${inputClasses} resize-none`}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={storeData.internationalShipping} onChange={(e) => handleInputChange('internationalShipping', e.target.checked)} className="rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500" />
                <span className="text-sm text-[#4A4A4A]">Ofrecemos envío internacional</span>
              </label>
            </Section>
          </div>

          {/* === MÉTODOS DE PAGO === */}
          <div id="section-payment">
            <Section id="payment" title="Métodos de Pago Aceptados" icon={<Shield className="w-5 h-5" />}>
              <p className="text-sm text-[#4A4A4A] -mt-2">Selecciona los métodos de pago que muestra tu tienda</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.key}
                    onClick={() => togglePayment(method.key)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                      storeData.acceptedPayments.includes(method.key)
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-xs text-[#4A4A4A]">{method.label}</span>
                  </button>
                ))}
              </div>
            </Section>
          </div>

          {/* === ANUNCIO === */}
          <div id="section-announcement">
            <Section id="announcement" title="Banner de Anuncio" icon={<AlertCircle className="w-5 h-5" />}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Muestra un banner destacado en la parte superior de tu tienda
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeData.announcementActive}
                  onChange={(e) => handleInputChange('announcementActive', e.target.checked)}
                  className="rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-black font-medium">Activar banner de anuncio</span>
              </label>
              {storeData.announcementActive && (
                <>
                  <input
                    type="text"
                    value={storeData.announcement}
                    onChange={(e) => handleInputChange('announcement', e.target.value)}
                    placeholder="Ej: ¡Rebajas de verano! Hasta -50% en toda la tienda"
                    className={inputClasses}
                  />
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#4A4A4A]">Color del banner:</label>
                    <input
                      type="color"
                      value={storeData.announcementColor}
                      onChange={(e) => handleInputChange('announcementColor', e.target.value)}
                      className="w-8 h-8 rounded border border-gray-600 cursor-pointer bg-transparent"
                    />
                  </div>
                  {storeData.announcement && (
                    <div className="rounded-lg p-3 text-center text-sm font-medium text-black" style={{ backgroundColor: storeData.announcementColor }}>
                      {storeData.announcement}
                    </div>
                  )}
                </>
              )}
            </Section>
          </div>

          {/* === SEO === */}
          <div id="section-seo">
            <Section id="seo" title="SEO y Metadatos" icon={<Search className="w-5 h-5" />}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Optimiza cómo aparece tu tienda en los buscadores
              </p>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Título SEO</label>
                <input
                  type="text"
                  value={storeData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder={storeData.name || 'Nombre de tu tienda'}
                  className={inputClasses}
                />
                <p className="text-xs text-gray-500 mt-1">{(storeData.metaTitle || storeData.name).length}/60 caracteres recomendados</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Meta Descripción</label>
                <textarea
                  value={storeData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder={storeData.description || 'Descripción para buscadores...'}
                  rows={3}
                  className={`${inputClasses} resize-none`}
                />
                <p className="text-xs text-gray-500 mt-1">{(storeData.metaDescription || storeData.description).length}/160 caracteres recomendados</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Palabras clave</label>
                <input
                  type="text"
                  value={storeData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="tecnología, accesorios, gadgets, electrónica..."
                  className={inputClasses}
                />
                <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
              </div>

              {/* SEO Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Vista previa en Google:</p>
                <p className="text-blue-400 text-sm font-medium truncate">{storeData.metaTitle || storeData.name} | NexoMarket</p>
                <p className="text-green-400 text-xs">nexomarket.com/tienda/{storeData.storeUrl}</p>
                <p className="text-[#4A4A4A] text-xs mt-1 line-clamp-2">{storeData.metaDescription || storeData.description}</p>
              </div>
            </Section>
          </div>

          {/* === IDIOMAS === */}
          <div id="section-languages">
            <Section id="languages" title="Idiomas de Atención" icon={<Globe className="w-5 h-5" />}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Indica en qué idiomas puedes atender a los clientes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {STORE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`px-4 py-2.5 rounded-xl border text-sm transition-all ${
                      storeData.languages.includes(lang.code)
                        ? 'border-blue-500 bg-blue-500/10 text-[#0066FF]'
                        : 'border-gray-300 bg-white text-[#4A4A4A] hover:border-gray-400'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </Section>
          </div>

          {/* === CONFIANZA === */}
          <div id="section-trust">
            <Section id="trust" title="Sellos de Confianza" icon={<Shield className="w-5 h-5" />}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Añade certificaciones y sellos que generen confianza
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Vendedor Verificado',
                  'Envío Seguro',
                  'Garantía de Devolución',
                  'Pago Seguro SSL',
                  'Atención 24/7',
                  'Producto Original',
                  'Eco-Friendly',
                  'Hecho a Mano',
                  'Comercio Justo',
                ].map((cert) => (
                  <button
                    key={cert}
                    onClick={() => {
                      setStoreData(prev => ({
                        ...prev,
                        certifications: prev.certifications.includes(cert)
                          ? prev.certifications.filter(c => c !== cert)
                          : [...prev.certifications, cert],
                      }));
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-sm transition-all ${
                      storeData.certifications.includes(cert)
                        ? 'border-green-500 bg-green-500/10 text-green-600'
                        : 'border-gray-300 bg-white text-[#4A4A4A] hover:border-gray-400'
                    }`}
                  >
                    {storeData.certifications.includes(cert) ? '✓ ' : ''}{cert}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm text-[#4A4A4A] mb-2">Añadir certificación personalizada</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={storeData.customCertification}
                    onChange={(e) => handleInputChange('customCertification', e.target.value)}
                    placeholder="Ej: ISO 9001"
                    className={`${inputClasses} flex-1`}
                  />
                  <Button
                    onClick={() => {
                      if (storeData.customCertification.trim()) {
                        setStoreData(prev => ({
                          ...prev,
                          certifications: [...prev.certifications, prev.customCertification.trim()],
                          customCertification: '',
                        }));
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-black border-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Section>
          </div>

          {/* === FAQ === */}
          <div id="section-faq">
            <Section id="faq" title="Preguntas Frecuentes (FAQ)" icon={<MessageSquare className="w-5 h-5" />} badge={`${storeData.faq.length}`}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Añade preguntas frecuentes que se mostrarán en tu tienda
              </p>
              <div className="space-y-4">
                {storeData.faq.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-300/30">
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 font-mono mt-3">{index + 1}</span>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => updateFaq(index, 'question', e.target.value)}
                          placeholder="Pregunta..."
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={item.answer}
                          onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                          placeholder="Respuesta..."
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <button onClick={() => removeFaq(index)} className="text-gray-500 hover:text-red-400 mt-3">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={addFaq} variant="outline" className="gap-2 border-gray-300 hover:bg-gray-100 text-sm">
                <Plus className="w-4 h-4" /> Añadir pregunta
              </Button>
            </Section>
          </div>

          {/* === CARACTERÍSTICAS DESTACADAS === */}
          <div id="section-features">
            <Section id="features" title="Características Destacadas" icon={<Plus className="w-5 h-5" />}>
              <p className="text-sm text-[#4A4A4A] -mt-2">
                Badges y características que se muestran en la página de tu tienda
              </p>
              <div className="flex flex-wrap gap-2">
                {storeData.features.map((feature, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-[#0066FF]">
                    {feature}
                    <button onClick={() => removeFeature(index)} className="text-blue-400 hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={storeData.newFeature}
                  onChange={(e) => handleInputChange('newFeature', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Ej: Garantía extendida, Producto local..."
                  className={`${inputClasses} flex-1`}
                />
                <Button onClick={addFeature} className="bg-blue-600 hover:bg-blue-700 text-black border-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Section>
          </div>

          {/* Bottom Save */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`gap-2 flex-1 text-black border-0 py-6 text-base ${
                saveStatus === 'saved'
                  ? 'bg-green-600'
                  : 'bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {saveStatus === 'saving' && <Clock className="h-5 w-5 animate-spin" />}
              {saveStatus === 'saved' ? '✓ Cambios Guardados' : <><Save className="h-5 w-5" /> Guardar Todos los Cambios</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
