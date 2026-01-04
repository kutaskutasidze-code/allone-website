'use client';

import { memo } from 'react';

interface GradientMeshBackgroundProps {
  /** Whether to show the mesh (can be disabled on specific pages) */
  enabled?: boolean;
  /** Opacity of the overall effect (0-1) */
  opacity?: number;
  /** Whether to use the dark variant */
  dark?: boolean;
}

/**
 * Animated gradient mesh background inspired by Apple/Stripe
 * Creates soft, slowly morphing gradient blobs for visual interest
 */
export const GradientMeshBackground = memo(function GradientMeshBackground({
  enabled = true,
  opacity = 0.4,
  dark = false,
}: GradientMeshBackgroundProps) {
  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? 'linear-gradient(to bottom, rgb(15, 15, 20), rgb(10, 10, 15))'
            : 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(250, 250, 252))',
        }}
      />

      {/* Gradient Blob 1 - Blue (top-left) */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '600px',
          maxHeight: '600px',
          left: '-10%',
          top: '-10%',
          background: dark
            ? `radial-gradient(circle, rgba(61, 90, 128, ${opacity * 0.6}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(61, 90, 128, ${opacity * 0.3}) 0%, transparent 70%)`,
          animation: 'gradient-mesh-1 25s ease-in-out infinite',
        }}
      />

      {/* Gradient Blob 2 - Purple (top-right) */}
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          width: '45vw',
          height: '45vw',
          maxWidth: '550px',
          maxHeight: '550px',
          right: '-5%',
          top: '10%',
          background: dark
            ? `radial-gradient(circle, rgba(124, 58, 237, ${opacity * 0.5}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(124, 58, 237, ${opacity * 0.25}) 0%, transparent 70%)`,
          animation: 'gradient-mesh-2 30s ease-in-out infinite',
        }}
      />

      {/* Gradient Blob 3 - Pink (center-bottom) */}
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: '650px',
          maxHeight: '650px',
          left: '25%',
          bottom: '-20%',
          background: dark
            ? `radial-gradient(circle, rgba(236, 72, 153, ${opacity * 0.4}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(236, 72, 153, ${opacity * 0.2}) 0%, transparent 70%)`,
          animation: 'gradient-mesh-3 28s ease-in-out infinite',
        }}
      />

      {/* Gradient Blob 4 - Cyan (floating) */}
      <div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: '35vw',
          height: '35vw',
          maxWidth: '400px',
          maxHeight: '400px',
          right: '15%',
          top: '50%',
          background: dark
            ? `radial-gradient(circle, rgba(6, 182, 212, ${opacity * 0.4}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(6, 182, 212, ${opacity * 0.2}) 0%, transparent 70%)`,
          animation: 'gradient-mesh-4 35s ease-in-out infinite',
        }}
      />

      {/* Subtle accent blob - Orange (corner accent) */}
      <div
        className="absolute rounded-full blur-[90px]"
        style={{
          width: '30vw',
          height: '30vw',
          maxWidth: '350px',
          maxHeight: '350px',
          left: '60%',
          top: '30%',
          background: dark
            ? `radial-gradient(circle, rgba(249, 115, 22, ${opacity * 0.3}) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(249, 115, 22, ${opacity * 0.15}) 0%, transparent 70%)`,
          animation: 'gradient-mesh-2 32s ease-in-out infinite reverse',
        }}
      />

      {/* Very subtle noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});
