'use client';

import AdminLayout from '@/components/layout/admin-layout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutProps) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
