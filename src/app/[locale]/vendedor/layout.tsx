'use client';

import SellerLayout from '@/components/layout/seller-layout';

interface VendedorLayoutProps {
  children: React.ReactNode;
}

export default function VendedorLayout({
  children,
}: VendedorLayoutProps) {
  return (
    <SellerLayout>
      {children}
    </SellerLayout>
  );
}
