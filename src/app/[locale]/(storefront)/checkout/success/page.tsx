'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  CheckCircle,
  Package,
  ArrowRight,
  ShoppingBag,
  Loader,
} from 'lucide-react';

interface PaymentDetails {
  sessionId: string;
  paymentStatus: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found. Please check the URL.');
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.error || 'Failed to verify payment');
          setLoading(false);
          return;
        }

        setPaymentDetails({
          sessionId: data.sessionId,
          paymentStatus: data.paymentStatus,
          customerEmail: data.customerEmail,
          amountTotal: data.amountTotal,
          currency: data.currency,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('An error occurred while verifying your payment. Please try again.');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#0066FF] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black">Verificando tu pago...</h2>
          <p className="text-[#4A4A4A] mt-2">Por favor espera mientras procesamos tu pedido.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-screen">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-3">Error en el Pago</h2>
            <p className="text-[#4A4A4A] mb-6">{error}</p>
            <Link
              href="/carrito"
              className="inline-flex items-center gap-2 bg-[#0066FF] text-white font-bold py-3 px-6 rounded-2xl hover:bg-[#0052CC] transition-all duration-300"
            >
              Volver al Carrito
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            Checkout
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 text-center">
          {/* Checkmark Animation */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">
            ¡Pago Completado!
          </h2>
          <p className="text-[#4A4A4A] mb-8">
            Tu pedido ha sido procesado exitosamente.
          </p>

          {/* Order Details Card */}
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 mb-8 space-y-4 text-left">
            {/* Order Number */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-[#4A4A4A]">Número de Pedido</span>
              <span className="font-mono text-black font-semibold">
                {paymentDetails?.sessionId?.slice(0, 8).toUpperCase() || 'N/A'}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-[#4A4A4A]">Confirmación Enviada a</span>
              <span className="text-black break-all">
                {paymentDetails?.customerEmail || 'No disponible'}
              </span>
            </div>

            {/* Amount Paid */}
            <div className="flex items-center justify-between">
              <span className="text-[#4A4A4A]">Total Pagado</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                {paymentDetails?.amountTotal.toFixed(2) || '0.00'} €
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
            <Link
              href="/mi-cuenta/pedidos"
              className="block bg-[#0066FF] text-white font-bold py-3 px-6 rounded-2xl hover:bg-[#0052CC] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Ver mis Pedidos
            </Link>
            <Link
              href="/"
              className="block bg-white border border-gray-200 text-black font-bold py-3 px-6 rounded-2xl hover:bg-[#FAFAFA] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Seguir Comprando
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Info Message */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-blue-700">
              Se ha enviado un recibo a tu correo electrónico. Revisa tu bandeja de entrada y carpeta de spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
