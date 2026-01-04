'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Briefcase,
  Users,
  BarChart3,
  Heart,
  FileText,
  LogOut,
  ExternalLink,
  ChevronRight,
  Tag,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
  { name: 'Values', href: '/admin/values', icon: Heart },
  { name: 'About Page', href: '/admin/about', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 h-screen w-72 bg-white border-r border-[var(--gray-200)]"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <motion.div
          className="flex h-20 items-center border-b border-[var(--gray-200)] px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/admin" className="group flex items-center gap-3">
            {/* Animated Logo */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(61, 90, 128, 0.15) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                  transform: 'scale(1.5)',
                }}
                animate={{
                  scale: [1.4, 1.6, 1.4],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Logo Container */}
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-white to-[var(--gray-50)] shadow-md border border-[var(--gray-200)] group-hover:border-[var(--accent)] transition-colors duration-300">
                <Image
                  src="/images/allone-logo.png"
                  alt="Allone"
                  width={44}
                  height={44}
                  className="object-contain p-1"
                  priority
                />
              </div>
              {/* Status Dot */}
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Brand Text */}
            <div className="flex flex-col">
              <span className="text-lg font-[var(--font-display)] font-semibold tracking-tight text-[var(--black)]">
                ALLONE
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--accent)] font-medium -mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                      active
                        ? 'bg-[var(--black)] text-white shadow-lg shadow-black/10'
                        : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-[var(--black)]'
                    )}
                  >
                    {/* Active Indicator Line */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent)] rounded-r-full"
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          exit={{ scaleY: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <div className={cn(
                      'relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300',
                      active
                        ? 'bg-white/10'
                        : 'bg-[var(--gray-100)] group-hover:bg-[var(--gray-200)]'
                    )}>
                      <Icon className={cn(
                        'h-4.5 w-4.5 transition-transform duration-300',
                        !active && 'group-hover:scale-110'
                      )} />
                    </div>

                    {/* Label */}
                    <span className="flex-1">{item.name}</span>

                    {/* Arrow on hover (non-active) */}
                    {!active && (
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--gray-400)]" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <motion.div
          className="border-t border-[var(--gray-200)] p-4 space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {/* View Website Link */}
          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--gray-600)] hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] transition-all duration-300"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--gray-100)] group-hover:bg-[var(--accent)]/10 transition-colors duration-300">
              <ExternalLink className="h-4 w-4" />
            </div>
            <span>View Website</span>
            <motion.div
              className="ml-auto"
              whileHover={{ x: 3, y: -3 }}
            >
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </Link>

          {/* Sign Out Button */}
          <motion.button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--gray-600)] hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--gray-100)] group-hover:bg-red-100 transition-colors duration-300">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Sign Out</span>
          </motion.button>

          {/* Version Badge */}
          <div className="flex items-center justify-center pt-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--gray-400)] font-medium">
              v1.0.0 • Admin Panel
            </span>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
