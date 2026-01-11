'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const navigationSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/sales', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Sales',
    items: [
      { name: 'Leads', href: '/sales/leads', icon: Users },
    ],
  },
];

export function SalesSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/sales/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/sales') {
      return pathname === '/sales';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-[var(--gray-200)]"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b border-[var(--gray-100)] px-5">
          <Link href="/sales" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[var(--gray-200)]">
              <Image
                src="/images/allone-logo.png"
                alt="Allone"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold tracking-tight text-[var(--black)]">
                Allone
              </span>
              <span className="text-xs font-medium text-[var(--gray-400)]">Sales</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <div key={section.label}>
                {/* Section Label */}
                <div className="px-3 mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--gray-400)]">
                    {section.label}
                  </span>
                </div>

                {/* Section Items */}
                <div className="space-y-0.5">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.05 * (sectionIndex * 3 + itemIndex),
                          duration: 0.3
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200',
                            active
                              ? 'bg-[var(--gray-100)] text-[var(--black)]'
                              : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)] hover:text-[var(--black)]'
                          )}
                        >
                          <Icon className={cn(
                            'h-[18px] w-[18px] flex-shrink-0',
                            active ? 'text-[var(--black)]' : 'text-[var(--gray-400)]'
                          )} />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="border-t border-[var(--gray-100)] p-3 space-y-1">
          {/* View Website Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--black)] transition-colors duration-200"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            <span>View Website</span>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--black)] transition-colors duration-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
