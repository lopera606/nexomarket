'use client';

import { useState } from 'react';
import { MapPin, Edit, Trash2, Plus, Home, Building2, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'work';
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Casa',
    street: 'Calle Principal 123, Apto 4B',
    city: 'Madrid, 28001',
    postalCode: '28001',
    phone: '+34 912 345 678',
    isDefault: true,
    type: 'home',
  },
  {
    id: '2',
    name: 'Oficina',
    street: 'Avenida de la Tecnología 456',
    city: 'Barcelona, 08002',
    postalCode: '08002',
    phone: '+34 932 111 222',
    isDefault: false,
    type: 'work',
  },
];

export default function DireccionesPage() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mis Direcciones</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Gestiona tus direcciones de entrega</p>
        </div>
        <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm flex-shrink-0">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          Añadir
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {addresses.map((address) => {
          const Icon = address.type === 'home' ? Home : Building2;
          return (
            <Card key={address.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-[#0066FF] rounded-full flex-shrink-0">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-base text-[#000000]">{address.name}</h3>
                      {address.isDefault && (
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                          <CheckCircle className="h-3 w-3 text-[#0066FF] flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs font-medium text-[#0066FF]">Predeterminada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex gap-2 text-[#4A4A4A]">
                    <MapPin className="h-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-[#4A4A4A]" />
                    <span className="truncate">{address.street}</span>
                  </div>
                  <p className="text-[#4A4A4A] text-xs">{address.city}</p>
                  <p className="text-[#4A4A4A] text-xs">CP: {address.postalCode}</p>
                  <p className="text-[#4A4A4A] text-xs">{address.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-200 text-[#000000] hover:bg-gray-50 rounded-lg sm:rounded-2xl text-xs sm:text-sm">
                    <Edit className="h-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-lg sm:rounded-2xl"
                  >
                    <Trash2 className="h-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-[#0066FF] hover:text-[#0052CC] hover:bg-blue-50 border-gray-200 rounded-lg sm:rounded-2xl text-xs"
                    >
                      Principal
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {addresses.length === 0 && (
        <Card className="p-8 sm:p-12 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#4A4A4A]" />
            <p className="mt-4 text-base sm:text-lg font-semibold text-[#4A4A4A]">No tienes direcciones</p>
            <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">Agrega una dirección para poder realizar compras</p>
            <Button className="mt-6 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              Añadir Dirección
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
