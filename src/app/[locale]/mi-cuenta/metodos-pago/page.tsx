'use client';

import { useState } from 'react';
import { CreditCard, Trash2, Plus, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFourDigits: string;
  cardholder: string;
  expiryDate: string;
  isDefault: boolean;
}

const MOCK_CARDS: PaymentMethod[] = [
  {
    id: '1',
    type: 'visa',
    lastFourDigits: '1234',
    cardholder: 'Juan García López',
    expiryDate: '12/26',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mastercard',
    lastFourDigits: '5678',
    cardholder: 'Juan García López',
    expiryDate: '08/25',
    isDefault: false,
  },
];

const CARD_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  visa: { bg: 'from-blue-600 to-blue-700', text: 'text-white', icon: '🏦' },
  mastercard: { bg: 'from-red-600 to-orange-600', text: 'text-white', icon: '💳' },
  amex: { bg: 'from-green-600 to-green-700', text: 'text-white', icon: '🎫' },
};

export default function MetodosPagoPage() {
  const [cards, setCards] = useState<PaymentMethod[]>(MOCK_CARDS);

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id,
    })));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Métodos de Pago</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Gestiona tus tarjetas y métodos de pago</p>
        </div>
        <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm flex-shrink-0">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          Añadir
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {cards.map((card) => {
          const colors = CARD_COLORS[card.type];
          const cardType = card.type.toUpperCase();

          return (
            <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Card Visual */}
                    <div className={`w-16 h-10 sm:w-20 sm:h-12 bg-gradient-to-br ${colors.bg} rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xl sm:text-2xl">{colors.icon}</span>
                    </div>

                    {/* Card Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-xs sm:text-base text-[#000000]">{cardType}</p>
                        <p className="text-[10px] sm:text-sm text-[#4A4A4A]">•••• {card.lastFourDigits}</p>
                        {card.isDefault && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#0066FF] flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs font-medium text-[#0066FF]">Principal</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-sm text-[#4A4A4A] mt-0.5 sm:mt-1 truncate">{card.cardholder}</p>
                      <p className="text-[10px] sm:text-sm text-[#4A4A4A] mt-0.5 sm:mt-1">Vence: {card.expiryDate}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                  {!card.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(card.id)}
                      className="flex-1 border-gray-200 text-[#000000] hover:bg-gray-50 rounded-lg sm:rounded-2xl text-xs sm:text-sm"
                    >
                      Principal
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-lg sm:rounded-2xl"
                  >
                    <Trash2 className="h-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {cards.length === 0 && (
        <Card className="p-8 sm:p-12 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="text-center">
            <CreditCard className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#4A4A4A]" />
            <p className="mt-4 text-base sm:text-lg font-semibold text-[#4A4A4A]">No tienes métodos de pago</p>
            <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">Agrega una tarjeta para poder realizar compras</p>
            <Button className="mt-6 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              Añadir Tarjeta
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
