'use client';

import Image from 'next/image';
import { Search, Bell, Plus, FileText, Zap, Clock, MessageSquare, DollarSign, Command, Wifi, RefreshCw, Target, Activity, CheckCircle, LayoutDashboard, BarChart3, Puzzle, Settings, HelpCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PerformanceChart, CategoryChart } from './Charts';
import { AIInsightsCard } from './AIInsightsCard';
import { RecentAutomations } from './RecentAutomations';
import { IntegrationsGrid } from './IntegrationsGrid';

// Browser Chrome Wrapper
function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#1a1a1a] rounded-2xl overflow-hidden">
      {/* Browser top bar */}
      <div className="bg-[#252525] px-4 py-3 flex items-center gap-4">
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* URL bar */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="bg-[#1a1a1a] rounded-lg px-4 py-1.5 flex items-center gap-2 border border-[#333]">
            <svg className="w-3.5 h-3.5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-[#888]">app.allone.ge/dashboard</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="w-[68px]" />
      </div>

      {/* Browser content */}
      <div className="flex-1 bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// Live indicator component
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
  );
}

// Compact inline progress
function InlineProgress({ current, target }: { current: number; target: number }) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e4e4e7] rounded-lg">
      <div className="w-6 h-6 bg-[#f4f4f5] rounded flex items-center justify-center">
        <Target className="w-3 h-3 text-[#0a0a0a]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-medium text-[#0a0a0a]">Target</span>
          <span className="text-[10px] text-[#71717a]">{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-1 bg-[#f4f4f5] rounded-full overflow-hidden w-20">
          <div
            className="h-full bg-[#0a0a0a] rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Compact sidebar for embedded dashboard (140px width)
const compactNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Zap, label: 'Automations', active: false },
  { icon: Puzzle, label: 'Integrations', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

function CompactSidebar() {
  return (
    <aside className="w-[140px] h-full bg-white border-r border-[#e4e4e7] flex flex-col py-3 relative flex-shrink-0">
      {/* Logo */}
      <div className="px-3 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src="/images/allone-logo.png"
              alt="Allone"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-[#0a0a0a] font-semibold text-[13px] font-display tracking-tight">All</span>
            <span className="text-[#3d5a80] font-semibold text-[13px] font-display tracking-tight">one</span>
          </div>
        </div>
      </div>

      {/* Navigation Label */}
      <div className="px-3 mb-1">
        <span className="text-[8px] font-medium text-[#a1a1aa] uppercase tracking-wider">Menu</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-1.5">
        {compactNavItems.map((item, index) => (
          <button
            key={index}
            className={`w-full h-7 rounded-md flex items-center gap-2 px-2 transition-all duration-200 ${
              item.active
                ? 'bg-[#0a0a0a] text-white'
                : 'text-[#52525b] hover:text-[#0a0a0a] hover:bg-[#f4f4f5]'
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-1.5 space-y-0.5">
        <button className="w-full h-7 rounded-md flex items-center gap-2 px-2 text-[#52525b] hover:text-[#0a0a0a] hover:bg-[#f4f4f5] transition-all duration-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Help</span>
        </button>
      </div>

      {/* User Card */}
      <div className="mx-1.5 mt-2 p-1.5 rounded-md bg-[#f4f4f5] border border-[#e4e4e7]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3d5a80] to-[#6b8caa] flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">
            SL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-[#0a0a0a] truncate">Sarah Lee</p>
            <p className="text-[8px] text-[#71717a] truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardContent() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="h-full w-full bg-[#fafafa] flex overflow-hidden font-sans relative">
      {/* Sidebar - compact version */}
      <CompactSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar - compact */}
        <header className="h-11 bg-white border-b border-[#e4e4e7] flex items-center justify-between px-4 flex-shrink-0">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a1a1aa]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-7 pl-8 pr-10 rounded-md bg-[#f4f4f5] border border-transparent text-xs text-[#0a0a0a] placeholder-[#a1a1aa] focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1 py-0.5 bg-white rounded border border-[#e4e4e7]">
                <Command className="w-2 h-2 text-[#a1a1aa]" />
                <span className="text-[8px] text-[#a1a1aa] font-medium">K</span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="relative w-7 h-7 rounded-md hover:bg-[#f4f4f5] flex items-center justify-center transition-colors">
              <Bell className="w-3.5 h-3.5 text-[#52525b]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#3d5a80] rounded-full" />
            </button>
            <div className="w-px h-5 bg-[#e4e4e7]" />
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3d5a80] to-[#6b8caa] flex items-center justify-center text-white text-[9px] font-medium">
                SL
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - compact */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            {/* Welcome + Quick Actions Row */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-semibold text-[#0a0a0a] font-display">
                  Good morning, Sarah
                </h1>
                <p className="text-[#71717a] text-[10px]">{today}</p>
              </div>

              <div className="flex items-center gap-2">
                <InlineProgress current={1247} target={1500} />
                <button className="h-6 px-2 rounded-md bg-white border border-[#e4e4e7] text-[10px] font-medium text-[#52525b] flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Report
                </button>
                <button className="h-6 px-2 rounded-md bg-[#0a0a0a] text-[10px] font-medium text-white flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  New
                </button>
              </div>
            </div>

            {/* Metrics Grid - compact */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <MetricCard
                title="Automations"
                value="1,247"
                change={12.5}
                icon={Zap}
                sparklineData={[20, 35, 30, 45, 55, 48, 65, 72, 80]}
                sparklineColor="#0a0a0a"
                compact
              />
              <MetricCard
                title="Time Saved"
                value="340 hrs"
                change={8.2}
                icon={Clock}
                sparklineData={[40, 38, 45, 50, 48, 55, 58, 62, 68]}
                sparklineColor="#3d5a80"
                compact
              />
              <MetricCard
                title="AI Responses"
                value="89.4k"
                change={23.1}
                icon={MessageSquare}
                sparklineData={[25, 32, 40, 38, 52, 58, 65, 78, 89]}
                sparklineColor="#52525b"
                compact
              />
              <MetricCard
                title="Cost Savings"
                value="$42.8k"
                change={15.7}
                icon={DollarSign}
                sparklineData={[30, 35, 38, 42, 40, 48, 52, 58, 65]}
                sparklineColor="#71717a"
                compact
              />
            </div>

            {/* Charts Row - compact */}
            <div className="grid grid-cols-12 gap-2 mb-3">
              <div className="col-span-6">
                <PerformanceChart compact />
              </div>
              <div className="col-span-6">
                <CategoryChart compact />
              </div>
            </div>

            {/* Recent Automations - compact */}
            <div className="mb-2">
              <RecentAutomations compact />
            </div>
          </div>
        </div>

        {/* Status Bar - compact */}
        <div className="h-5 bg-white border-t border-[#e4e4e7] flex items-center justify-between px-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[9px] text-[#71717a]">
              <LiveDot />
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#71717a]">
              <Wifi className="w-2.5 h-2.5" />
              <span>Connected</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-[#a1a1aa]">
            <span>Built by</span>
            <span className="text-[#0a0a0a] font-semibold">Allone</span>
          </div>
        </div>
      </main>
    </div>
  );
}

// Embeddable version for the landing page (no scaling, fits container exactly)
export function EmbeddableDashboard() {
  return (
    <div
      className="w-full pointer-events-none"
      style={{ height: '600px' }}
    >
      <BrowserChrome>
        <DashboardContent />
      </BrowserChrome>
    </div>
  );
}

// Full page version for /dashboard-showcase route
export function DashboardShowcase() {
  return (
    <div className="h-screen w-full">
      <BrowserChrome>
        <DashboardContent />
      </BrowserChrome>
    </div>
  );
}
