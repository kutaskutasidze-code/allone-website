'use client';

import { motion } from 'framer-motion';

// Reconstructed Allone logo as SVG (transparent background)
function AlloneLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      {/* Center cross made of 4 diamonds */}
      {/* Top diamond */}
      <path d="M50 20 L58 35 L50 50 L42 35 Z" />
      {/* Right diamond */}
      <path d="M80 50 L65 58 L50 50 L65 42 Z" />
      {/* Bottom diamond */}
      <path d="M50 80 L42 65 L50 50 L58 65 Z" />
      {/* Left diamond */}
      <path d="M20 50 L35 42 L50 50 L35 58 Z" />

      {/* Four hexagons at corners */}
      {/* Top hexagon */}
      <path d="M50 0 L58 4 L58 14 L50 18 L42 14 L42 4 Z" />
      {/* Right hexagon */}
      <path d="M100 50 L96 58 L86 58 L82 50 L86 42 L96 42 Z" />
      {/* Bottom hexagon */}
      <path d="M50 100 L42 96 L42 86 L50 82 L58 86 L58 96 Z" />
      {/* Left hexagon */}
      <path d="M0 50 L4 42 L14 42 L18 50 L14 58 L4 58 Z" />

      {/* Connecting lines from hexagons to center */}
      {/* Top connector */}
      <path d="M46 18 L46 20 L50 24 L54 20 L54 18" />
      {/* Right connector */}
      <path d="M82 46 L80 46 L76 50 L80 54 L82 54" />
      {/* Bottom connector */}
      <path d="M54 82 L54 80 L50 76 L46 80 L46 82" />
      {/* Left connector */}
      <path d="M18 54 L20 54 L24 50 L20 46 L18 46" />
    </svg>
  );
}

// Animated logo background - floating Allone logos
export function LogoShapesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating logo - top right */}
      <motion.div
        className="absolute -top-10 -right-10 w-48 h-48 text-[var(--accent)] opacity-[0.06]"
        animate={{
          rotate: [0, 10, 0, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlloneLogo className="w-full h-full" />
      </motion.div>

      {/* Medium floating logo - left */}
      <motion.div
        className="absolute top-1/3 -left-8 w-32 h-32 text-[var(--accent)] opacity-[0.05]"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlloneLogo className="w-full h-full" />
      </motion.div>

      {/* Small floating logo - bottom right */}
      <motion.div
        className="absolute bottom-10 right-1/4 w-24 h-24 text-[var(--black)] opacity-[0.04]"
        animate={{
          y: [0, 15, 0],
          x: [0, 8, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlloneLogo className="w-full h-full" />
      </motion.div>

      {/* Extra small floating logo - center right */}
      <motion.div
        className="absolute top-1/2 right-16 w-16 h-16 text-[var(--accent)] opacity-[0.04]"
        animate={{
          y: [0, -12, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <AlloneLogo className="w-full h-full" />
      </motion.div>

      {/* Additional small logo - bottom left */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-20 h-20 text-[var(--black)] opacity-[0.03]"
        animate={{
          rotate: [0, 15, 0],
          y: [0, 10, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <AlloneLogo className="w-full h-full" />
      </motion.div>
    </div>
  );
}
