'use client';

/**
 * Layered Browser Screens visual for Website Development card
 * Shows three stacked browser windows with abstract content
 */
export function LayeredScreens() {
  return (
    <div className="relative w-full h-[220px]">
      {/* Back screen - furthest */}
      <div
        className="absolute w-[160px] h-[110px] rounded-lg bg-[#18181b] border border-white/[0.08] overflow-hidden"
        style={{
          top: '5%',
          left: '5%',
          transform: 'rotate(-6deg)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Browser chrome */}
        <div className="h-4 bg-[#0a0a0a] border-b border-white/[0.05] flex items-center px-2 gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
        {/* Abstract hero content */}
        <div className="p-2.5">
          <div className="w-10 h-1.5 bg-zinc-700 rounded mb-1.5" />
          <div className="w-16 h-1 bg-zinc-800 rounded mb-2" />
          <div className="flex gap-1">
            <div className="w-6 h-2.5 bg-zinc-700 rounded" />
            <div className="w-6 h-2.5 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>

      {/* Middle screen */}
      <div
        className="absolute w-[160px] h-[110px] rounded-lg bg-[#1a1a1a] border border-white/[0.1] overflow-hidden"
        style={{
          top: '20%',
          left: '22%',
          transform: 'rotate(-2deg)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Browser chrome */}
        <div className="h-4 bg-[#0f0f0f] border-b border-white/[0.05] flex items-center px-2 gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        </div>
        {/* Abstract dashboard content */}
        <div className="p-2.5">
          <div className="flex gap-1.5 mb-2">
            <div className="w-8 h-5 bg-zinc-800 rounded" />
            <div className="w-8 h-5 bg-zinc-800 rounded" />
          </div>
          <div className="w-full h-6 bg-zinc-800/50 rounded" />
        </div>
      </div>

      {/* Front screen - closest */}
      <div
        className="absolute w-[160px] h-[110px] rounded-lg bg-[#1f1f1f] border border-white/[0.12] overflow-hidden"
        style={{
          top: '35%',
          left: '40%',
          transform: 'rotate(3deg)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Browser chrome */}
        <div className="h-4 bg-[#141414] border-b border-white/[0.08] flex items-center px-2 gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        </div>
        {/* Abstract form content */}
        <div className="p-2.5">
          <div className="w-12 h-1.5 bg-zinc-600 rounded mb-1.5" />
          <div className="w-full h-3 bg-zinc-700/50 rounded mb-1.5" />
          <div className="w-full h-3 bg-zinc-700/50 rounded mb-1.5" />
          <div className="w-10 h-3 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  );
}
