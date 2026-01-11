'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Login page has its own full-screen layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // All other admin pages get the sidebar layout
  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => {
          if (window.innerWidth < 1024) {
            setIsMobileOpen(!isMobileOpen);
          } else {
            setIsCollapsed(!isCollapsed);
          }
        }}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <motion.main
        className="lg:transition-[margin-left] lg:duration-200"
        initial={false}
        animate={{ marginLeft: isCollapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginLeft: 0 }}
      >
        <div className="min-h-screen p-4 pt-16 lg:pt-6 lg:p-8">{children}</div>
      </motion.main>
    </div>
  );
}
