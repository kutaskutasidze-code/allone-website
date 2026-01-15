'use client';

import { memo, useMemo } from 'react';

interface PathData {
  id: string;
  d: string;
  opacity: number;
  width: number;
  delay: number;
}

function generatePath(index: number, position: number): string {
  const amplitude = 80 + index * 10;
  const phase = index * 0.3;
  const points: string[] = [];

  const startX = 1200;
  const startY = 400;
  const endX = -1200;
  const endY = -400 + index * 30;

  for (let i = 0; i <= 8; i++) {
    const progress = i / 8;
    const eased = 1 - (1 - progress) ** 2;

    const baseX = startX + (endX - startX) * eased;
    const baseY = startY + (endY - startY) * eased;

    const wave = Math.sin(progress * Math.PI * 2.5 + phase) * amplitude * (1 - eased * 0.3);

    const x = baseX * position;
    const y = baseY + wave;

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }

  return points.join(' ');
}

const FloatingPaths = memo(function FloatingPaths({ position }: { position: number }) {
  const paths: PathData[] = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: `path-${i}`,
        d: generatePath(i, position),
        opacity: 0.15 + i * 0.03,
        width: 1 + i * 0.2,
        delay: i * 0.5,
      })),
    [position]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="-1200 -400 2400 800"
      >
        <title>Background</title>
        <defs>
          <linearGradient id="pathGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.1)" />
            <stop offset="50%" stopColor="rgba(0, 0, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.1)" />
          </linearGradient>
        </defs>

        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="url(#pathGradient)"
            strokeLinecap="round"
            strokeWidth={path.width}
            opacity={path.opacity}
            className="animate-float"
            style={{
              animationDelay: `${path.delay}s`,
            }}
          />
        ))}
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
});

export const BackgroundPaths = memo(function BackgroundPaths() {
  return (
    <div className="absolute inset-0">
      <FloatingPaths position={1} />
    </div>
  );
});
