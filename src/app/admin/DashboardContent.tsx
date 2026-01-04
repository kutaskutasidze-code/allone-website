'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Briefcase,
  Users,
  BarChart3,
  Heart,
  ArrowRight,
  Plus,
  FileText,
  Settings,
  Tag,
  TrendingUp,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardContentProps {
  counts: {
    projects: { total: number; published: number };
    services: { total: number; published: number };
    clients: { total: number; published: number };
    stats: number;
    values: number;
    categories: number;
  };
  dailyRevenue: Array<{ date: string; revenue: number }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function DashboardContent({ counts, dailyRevenue }: DashboardContentProps) {
  const [period, setPeriod] = useState<'month' | 'year' | 'lifetime'>('year');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    dailyRevenue.forEach(item => {
      years.add(new Date(item.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [dailyRevenue]);

  // Build complete date range with all dates filled in
  const filteredRevenue = useMemo(() => {
    const now = new Date();
    const revenueMap = new Map<string, number>();

    // Build map of existing revenue data
    dailyRevenue.forEach(item => {
      revenueMap.set(item.date, (revenueMap.get(item.date) || 0) + item.revenue);
    });

    const result: Array<{ date: string; revenue: number; label: string }> = [];

    if (period === 'month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayOfMonth = date.getDate();
        result.push({
          date: dateStr,
          revenue: revenueMap.get(dateStr) || 0,
          label: dayOfMonth % 5 === 0 || dayOfMonth === 1 ? `${date.toLocaleDateString('en-US', { month: 'short' })} ${dayOfMonth}` : '',
        });
      }
    } else if (period === 'year') {
      // Full year - aggregate by month
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(selectedYear, month, 1);
        const monthEnd = new Date(selectedYear, month + 1, 0);
        let monthRevenue = 0;

        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          monthRevenue += revenueMap.get(dateStr) || 0;
        }

        result.push({
          date: monthStart.toISOString().split('T')[0],
          revenue: monthRevenue,
          label: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        });
      }
    } else {
      // Lifetime - aggregate by year
      const years = new Set<number>();
      dailyRevenue.forEach(item => years.add(new Date(item.date).getFullYear()));
      const sortedYears = Array.from(years).sort((a, b) => a - b);

      if (sortedYears.length === 0) {
        sortedYears.push(now.getFullYear());
      }

      const startYear = sortedYears[0];
      const endYear = Math.max(sortedYears[sortedYears.length - 1], now.getFullYear());

      for (let year = startYear; year <= endYear; year++) {
        let yearRevenue = 0;
        dailyRevenue.forEach(item => {
          if (new Date(item.date).getFullYear() === year) {
            yearRevenue += item.revenue;
          }
        });
        result.push({
          date: `${year}-01-01`,
          revenue: yearRevenue,
          label: year.toString(),
        });
      }
    }

    // Calculate cumulative revenue
    let cumulative = 0;
    return result.map(item => {
      cumulative += item.revenue;
      return { ...item, cumulative };
    });
  }, [dailyRevenue, period, selectedYear]);

  const totalRevenue = filteredRevenue.length > 0 ? filteredRevenue[filteredRevenue.length - 1].cumulative : 0;
  const cards = [
    {
      title: 'Projects',
      total: counts.projects.total,
      published: counts.projects.published,
      icon: FolderKanban,
      href: '/admin/projects',
      description: 'Portfolio projects',
      color: 'from-blue-500/10 to-blue-600/5',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Services',
      total: counts.services.total,
      published: counts.services.published,
      icon: Briefcase,
      href: '/admin/services',
      description: 'Service offerings',
      color: 'from-emerald-500/10 to-emerald-600/5',
      iconBg: 'bg-emerald-500',
    },
    {
      title: 'Clients',
      total: counts.clients.total,
      published: counts.clients.published,
      icon: Users,
      href: '/admin/clients',
      description: 'Client logos',
      color: 'from-violet-500/10 to-violet-600/5',
      iconBg: 'bg-violet-500',
    },
    {
      title: 'Categories',
      total: counts.categories,
      icon: Tag,
      href: '/admin/categories',
      description: 'Project categories',
      color: 'from-amber-500/10 to-amber-600/5',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Stats',
      total: counts.stats,
      icon: BarChart3,
      href: '/admin/stats',
      description: 'Site statistics',
      color: 'from-rose-500/10 to-rose-600/5',
      iconBg: 'bg-rose-500',
    },
    {
      title: 'Values',
      total: counts.values,
      icon: Heart,
      href: '/admin/values',
      description: 'Company values',
      color: 'from-cyan-500/10 to-cyan-600/5',
      iconBg: 'bg-cyan-500',
    },
  ];

  const quickActions = [
    { label: 'Add New Project', href: '/admin/projects/new', icon: FolderKanban, primary: true },
    { label: 'Add New Service', href: '/admin/services/new', icon: Briefcase },
    { label: 'Edit About Page', href: '/admin/about', icon: FileText },
    { label: 'Update Contact', href: '/admin/settings', icon: Settings },
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <h1 className="text-3xl font-[var(--font-display)] font-bold tracking-tight text-[var(--black)]">
              Dashboard
            </h1>
          </div>
          <p className="text-[var(--gray-500)] max-w-lg">
            Welcome back! Here&apos;s an overview of your content. Manage all your website content from this panel.
          </p>
        </div>
        <motion.div
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </motion.div>
      </motion.div>

      {/* Revenue Chart - Full Width */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[var(--gray-200)] bg-white p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gray-100)]">
              <DollarSign className="w-5 h-5 text-[var(--black)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--black)]">Revenue</h2>
              <p className="text-sm text-[var(--gray-500)]">
                {period === 'month' ? 'Last 30 days' : period === 'year' ? `Year ${selectedYear}` : 'All time'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Period Selector */}
            <div className="flex rounded-lg bg-[var(--gray-100)] p-1">
              {(['month', 'year', 'lifetime'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    period === p
                      ? 'bg-white text-[var(--black)] shadow-sm'
                      : 'text-[var(--gray-600)] hover:text-[var(--black)]'
                  }`}
                >
                  {p === 'month' ? '1M' : p === 'year' ? '1Y' : 'All'}
                </button>
              ))}
            </div>
            {/* Year Selector - only show when period is 'year' */}
            {period === 'year' && availableYears.length > 0 && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--gray-100)] border-0 focus:ring-2 focus:ring-[var(--black)] cursor-pointer"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
            {/* Total Revenue */}
            <div className="text-right pl-4 border-l border-[var(--gray-200)]">
              <p className="text-2xl font-bold text-[var(--black)]">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-[var(--gray-500)]">Total</p>
            </div>
          </div>
        </div>
        {filteredRevenue.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-[var(--gray-500)]">
            <p className="text-sm">No revenue data for this period. Add projects with revenue to see the chart.</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelFormatter={(_, payload) => {
                    if (payload && payload[0]) {
                      const date = new Date(payload[0].payload.date);
                      if (period === 'lifetime') {
                        return date.getFullYear().toString();
                      } else if (period === 'year') {
                        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      }
                      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                    }
                    return '';
                  }}
                  formatter={(value, name, props) => {
                    const periodRevenue = props.payload.revenue;
                    return [
                      `${formatCurrency(value as number)} (${periodRevenue > 0 ? '+' : ''}${formatCurrency(periodRevenue)})`,
                      'Cumulative'
                    ];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={period === 'month' ? false : { fill: '#000000', strokeWidth: 0, r: 3 }}
                  activeDot={{ fill: '#000000', strokeWidth: 0, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={itemVariants}>
              <Link
                href={card.href}
                className="group relative block rounded-2xl border border-[var(--gray-200)] bg-white p-6 transition-all duration-300 hover:border-[var(--gray-300)] hover:shadow-xl hover:shadow-black/5 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <ArrowRight className="h-5 w-5 text-[var(--gray-400)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        className="text-4xl font-bold text-[var(--black)]"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                      >
                        {card.total}
                      </motion.span>
                      {'published' in card && (
                        <span className="text-sm text-[var(--gray-500)]">
                          ({card.published} live)
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[var(--black)]">{card.title}</h3>
                    <p className="text-sm text-[var(--gray-500)]">{card.description}</p>
                  </div>

                  {/* Progress bar for publishable content */}
                  {'published' in card && card.total > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--gray-100)]">
                      <div className="flex items-center justify-between text-xs text-[var(--gray-500)] mb-2">
                        <span>Published</span>
                        <span>{Math.round((card.published! / card.total) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--gray-100)] rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${card.iconBg} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(card.published! / card.total) * 100}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[var(--gray-200)] bg-white p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--gray-100)]">
            <TrendingUp className="w-4 h-4 text-[var(--gray-600)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--black)]">Quick Actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    action.primary
                      ? 'bg-[var(--black)] text-white hover:bg-[var(--gray-800)] shadow-lg shadow-black/10'
                      : 'bg-[var(--gray-50)] text-[var(--gray-700)] hover:bg-[var(--gray-100)]'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${
                    action.primary
                      ? 'bg-white/10'
                      : 'bg-white shadow-sm'
                  }`}>
                    {action.primary ? (
                      <Plus className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${
                    action.primary ? 'text-white/70' : 'text-[var(--gray-400)]'
                  }`} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
