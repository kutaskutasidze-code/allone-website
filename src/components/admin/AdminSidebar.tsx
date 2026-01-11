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
  Tag,
  UserCheck,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';

const navigationSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { name: 'Services', href: '/admin/services', icon: Briefcase },
      { name: 'Clients', href: '/admin/clients', icon: Users },
      { name: 'Leads', href: '/admin/leads', icon: UserCheck },
    ],
  },
  {
    label: 'Manage',
    items: [
      { name: 'Categories', href: '/admin/categories', icon: Tag },
      { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
      { name: 'Values', href: '/admin/values', icon: Heart },
    ],
  },
  {
    label: 'Settings',
    items: [
      { name: 'About Page', href: '/admin/about', icon: FileText },
      { name: 'Contact', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: AdminSidebarProps) {
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

  const handleNavClick = () => {
    // Close mobile menu on navigation
    if (isMobileOpen) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className={cn(
        "flex h-16 items-center border-b border-[var(--gray-100)]",
        isCollapsed ? "justify-center px-2" : "px-5"
      )}>
        <Link href="/admin" className="flex items-center gap-3" onClick={handleNavClick}>
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[var(--gray-200)] flex-shrink-0">
            <Image
              src="/images/allone-logo.png"
              alt="Allone"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          {!isCollapsed && (
            <span className="text-base font-semibold tracking-tight text-[var(--black)]">
              Allone
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.label}>
              {/* Section Label */}
              {!isCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--gray-400)]">
                    {section.label}
                  </span>
                </div>
              )}

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <div key={item.name} className="relative group">
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        className={cn(
                          'flex items-center rounded-lg text-[13px] font-medium transition-colors duration-200',
                          isCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2',
                          active
                            ? 'bg-[var(--gray-100)] text-[var(--black)]'
                            : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)] hover:text-[var(--black)]'
                        )}
                      >
                        <Icon className={cn(
                          'h-[18px] w-[18px] flex-shrink-0',
                          active ? 'text-[var(--black)]' : 'text-[var(--gray-400)]'
                        )} />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[var(--black)] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </div>
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
        <div className="relative group">
          <Link
            href="/"
            target="_blank"
            className={cn(
              "flex items-center rounded-lg text-[13px] font-medium text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--black)] transition-colors duration-200",
              isCollapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2"
            )}
          >
            <ExternalLink className="h-[18px] w-[18px]" />
            {!isCollapsed && <span>View Website</span>}
          </Link>
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[var(--black)] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              View Website
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center rounded-lg text-[13px] font-medium text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--black)] transition-colors duration-200",
              isCollapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2"
            )}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[var(--black)] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              Sign Out
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button - Desktop only */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-[var(--gray-200)] rounded-full items-center justify-center text-[var(--gray-400)] hover:text-[var(--black)] hover:border-[var(--gray-300)] transition-colors shadow-sm"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-[var(--gray-200)] hidden lg:block"
        )}
        initial={false}
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => isMobileOpen ? onMobileClose() : onToggle()}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-[var(--gray-200)] rounded-lg flex items-center justify-center text-[var(--gray-600)] hover:text-[var(--black)] shadow-sm"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed left-0 top-0 z-50 h-screen w-[280px] bg-white border-r border-[var(--gray-200)]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile menu toggle button component for use in layout
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-[var(--gray-200)] rounded-lg flex items-center justify-center text-[var(--gray-600)] hover:text-[var(--black)] shadow-sm"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
