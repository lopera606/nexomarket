'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight, Loader,
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  image?: string;
  store: string;
  unit?: string; // 'unidad', 'metro', 'kg', 'litro', 'm2', 'pack'
  step?: number; // quantity step (e.g. 0.5 for half meters)
}

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'MacBook Pro 14"', price: 1199.99, quantity: 1, emoji: '', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop', store: 'Tech Store ES', unit: 'unidad', step: 1 },
    { id: '2', name: 'Sony WH-1000XM5', price: 279.99, quantity: 1, emoji: '', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop', store: 'Audio Premium', unit: 'unidad', step: 1 },
    { id: '3', name: 'Nike Air Max 90', price: 119.99, quantity: 1, emoji: '', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=200&h=200&fit=crop', store: 'Sports Outlet', unit: 'unidad', step: 1 },
  ]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) { removeItem(id); return; }
    setItems(items.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: string) => { setItems(items.filter((item) => item.id !== id)); };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const cartItems = items.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity }));
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        alert(`Error al procesar el pago: ${data.error || 'Unknown error'}`);
        setIsCheckingOut(false);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al procesar el pago. Por favor, intenta de nuevo.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Mi Carrito
          </h1>
          <p className="text-[#4A4A4A] mt-2">
            {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 hover:scale-[1.01] transition-all duration-200"
                  style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex-shrink-0 w-20 sm:w-24 h-20 sm:h-24 bg-[#FAFAFA] rounded-2xl overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl">{item.emoji}</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-black mb-1">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-[#4A4A4A] mb-2">{item.store}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[#4A4A4A] mb-1">
                        {item.price.toFixed(2)}€/{item.unit || 'unidad'}
                      </p>
                      <p className="text-xl sm:text-2xl font-extrabold text-black">
                        {item.price.toFixed(2)}€ × {item.quantity}
                        {item.unit && item.unit !== 'unidad' ? ` ${item.unit.charAt(0).toUpperCase() + item.unit.slice(1)}` : ''} = {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-4 mt-3 sm:mt-0">
                    {item.unit && item.unit !== 'unidad' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={item.step || 0.1}
                          step={item.step || 0.1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                          className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center font-bold text-black focus:outline-none focus:border-[#0066FF] transition-colors duration-200"
                        />
                        <span className="text-sm text-[#4A4A4A] font-medium">{item.unit}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-white rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Minus className="w-4 h-4 text-[#4A4A4A]" />
                        </button>
                        <span className="px-3 font-bold text-black min-w-[2rem] text-center">{Math.round(item.quantity)}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Plus className="w-4 h-4 text-[#4A4A4A]" />
                        </button>
                      </div>
                    )}
                    <button onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1 text-xs sm:text-sm min-h-[44px] min-w-[44px] justify-center">
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 sm:p-8 sticky top-24" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.05)' }}>
                <h2 className="text-xl font-extrabold text-black mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0066FF]" />
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-[#4A4A4A]">Subtotal</span>
                    <span className="font-semibold text-black">{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#4A4A4A]" />
                      <span className="text-[#4A4A4A]">Envío</span>
                    </div>
                    {shipping === 0 ? (
                      <span className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Gratis</span>
                    ) : (
                      <span className="font-semibold text-black">{shipping.toFixed(2)}€</span>
                    )}
                  </div>
                </div>

                <div className="mb-6 p-5 bg-[#FAFAFA] rounded-2xl">
                  <p className="text-[#4A4A4A] text-sm mb-1">Total a pagar</p>
                  <p className="text-3xl font-extrabold text-black">{total.toFixed(2)}€</p>
                </div>

                <button onClick={handleCheckout} disabled={isCheckingOut}
                  className="w-full bg-[#0066FF] text-white font-bold py-3 sm:py-4 px-6 rounded-2xl hover:bg-[#0052CC] transition-all duration-200 mb-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed min-h-[48px] text-sm sm:text-base"
                  style={{ boxShadow: '0 4px 30px rgba(0,102,255,0.2)' }}>
                  {isCheckingOut ? (
                    <><Loader className="w-5 h-5 animate-spin" /> Procesando...</>
                  ) : (
                    <>Proceder al Pago <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                <Link href="/" className="block text-center py-3 text-[#0066FF] hover:text-[#0052CC] font-semibold transition-colors duration-200">
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#0066FF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#0066FF]" />
            </div>
            <h2 className="text-2xl font-extrabold text-black mb-2">Tu carrito está vacío</h2>
            <p className="text-[#4A4A4A] mb-8">¡Descubre nuestros productos y añade algunos a tu carrito!</p>
            <Link href="/" className="inline-block bg-[#0066FF] text-white font-bold py-3 px-8 rounded-2xl hover:bg-[#0052CC] transition-all duration-200 min-h-[48px] flex items-center justify-center"
              style={{ boxShadow: '0 4px 30px rgba(0,102,255,0.2)' }}>
              Continuar Comprando
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
