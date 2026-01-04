'use client';

import { useEffect, useRef, useCallback } from 'react';

interface WaveLayer {
  color: string;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  opacity: number;
  yOffset: number;
}

interface ColorWaveProps {
  className?: string;
  height?: number;
}

export function ColorWave({ className = '', height = 200 }: ColorWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let width = 0;
    let canvasHeight = 0;

    // Soft, elegant wave layers
    const waves: WaveLayer[] = [
      { color: '61, 90, 128', amplitude: 25, frequency: 0.006, speed: 0.012, phase: 0, opacity: 0.08, yOffset: 0 },
      { color: '124, 58, 237', amplitude: 20, frequency: 0.008, speed: 0.018, phase: 1.5, opacity: 0.06, yOffset: 15 },
      { color: '236, 72, 153', amplitude: 18, frequency: 0.01, speed: 0.015, phase: 3, opacity: 0.05, yOffset: 30 },
      { color: '6, 182, 212', amplitude: 15, frequency: 0.012, speed: 0.02, phase: 4.5, opacity: 0.04, yOffset: 45 },
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      width = rect.width;
      canvasHeight = rect.height;
    };

    const drawWave = (wave: WaveLayer, t: number) => {
      const { color, amplitude, frequency, speed, phase, opacity, yOffset } = wave;

      const baseY = canvasHeight * 0.5 + yOffset;

      ctx.beginPath();
      ctx.moveTo(0, canvasHeight);

      // Draw wave from left to right
      for (let x = 0; x <= width; x += 3) {
        const y = baseY +
          Math.sin(x * frequency + t * speed + phase) * amplitude +
          Math.sin(x * frequency * 0.5 + t * speed * 0.7 + phase * 0.5) * (amplitude * 0.4);

        if (x === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Complete the shape
      ctx.lineTo(width, canvasHeight);
      ctx.lineTo(0, canvasHeight);
      ctx.closePath();

      // Soft gradient fill
      const gradient = ctx.createLinearGradient(0, baseY - amplitude, 0, canvasHeight);
      gradient.addColorStop(0, `rgba(${color}, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(${color}, ${opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(${color}, ${opacity * 0.2})`);

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, canvasHeight);
      time += 1;

      // Draw waves back to front
      waves.forEach((wave) => {
        drawWave(wave, time);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full pointer-events-none ${className}`}
      style={{ height }}
    />
  );
}
