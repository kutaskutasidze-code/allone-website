'use client';

import { usePathname } from 'next/navigation';
import { SalesSidebar } from '@/components/sales/SalesSidebar';

export function SalesLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/sales/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white">
      <SalesSidebar />
      <main className="ml-64">
        <div className="min-h-screen p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
