'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Login page has its own full-screen layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // All other admin pages get the sidebar layout
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <AdminSidebar />
      <main className="ml-72">
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}
