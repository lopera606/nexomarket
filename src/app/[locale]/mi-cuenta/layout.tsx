'use client';

import CustomerLayout from '@/components/layout/customer-layout';

interface MiCuentaLayoutProps {
  children: React.ReactNode;
}

export default function MiCuentaLayout({
  children,
}: MiCuentaLayoutProps) {
  return (
    <CustomerLayout>
      {children}
    </CustomerLayout>
  );
}
