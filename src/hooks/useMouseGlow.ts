'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface MouseGlowState {
  x: number;
  y: number;
  angle: number;
  intensity: number;
  isHovering: boolean;
}

interface UseMouseGlowOptions {
  /** Intensity multiplier for the glow effect (0-1). Default: 0.4 */
  intensity?: number;
  /** Whether to enable the effect. Default: true */
  enabled?: boolean;
  /** Decay rate when mouse leaves (0-1). Higher = faster decay. Default: 0.1 */
  decayRate?: number;
}

interface UseMouseGlowReturn {
  ref: React.RefObject<HTMLElement | null>;
  style: React.CSSProperties;
  glowState: MouseGlowState;
}

/**
 * Hook for creating interactive mouse-following glow effects on elements.
 * Creates a subtle, professional gradient border that follows cursor movement.
 */
export function useMouseGlow(options: UseMouseGlowOptions = {}): UseMouseGlowReturn {
  const { intensity = 0.4, enabled = true, decayRate = 0.1 } = options;

  const ref = useRef<HTMLElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });

  const [glowState, setGlowState] = useState<MouseGlowState>({
    x: 0.5,
    y: 0.5,
    angle: 135,
    intensity: 0,
    isHovering: false,
  });

  // Smooth animation loop
  const animate = useCallback(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    // Smooth interpolation towards target
    const lerp = 0.15;
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;

    // Calculate angle from center to mouse position
    const dx = currentRef.current.x - 0.5;
    const dy = currentRef.current.y - 0.5;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    // Calculate distance from center for intensity
    const distance = Math.sqrt(dx * dx + dy * dy);
    const normalizedIntensity = Math.min(distance * 2, 1) * intensity;

    setGlowState(prev => ({
      ...prev,
      x: currentRef.current.x,
      y: currentRef.current.y,
      angle,
      intensity: prev.isHovering ? normalizedIntensity : prev.intensity * (1 - decayRate),
    }));

    animationRef.current = requestAnimationFrame(animate);
  }, [enabled, intensity, decayRate]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const element = ref.current;
    if (!element || !enabled) return;

    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    targetRef.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  }, [enabled]);

  const handleMouseEnter = useCallback(() => {
    setGlowState(prev => ({ ...prev, isHovering: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlowState(prev => ({ ...prev, isHovering: false }));
    targetRef.current = { x: 0.5, y: 0.5 };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, handleMouseMove, handleMouseEnter, handleMouseLeave, animate]);

  // Generate CSS custom properties for the glow effect
  const style: React.CSSProperties = {
    '--glow-x': `${glowState.x * 100}%`,
    '--glow-y': `${glowState.y * 100}%`,
    '--glow-angle': `${glowState.angle}deg`,
    '--glow-intensity': glowState.intensity,
    '--glow-opacity': glowState.isHovering ? 1 : Math.max(0, glowState.intensity * 2),
  } as React.CSSProperties;

  return { ref, style, glowState };
}

/**
 * Generates a conic gradient string for the interactive border effect.
 * Uses the color palette: blue → purple → pink → coral → cyan
 */
export function getGlowGradient(angle: number, intensity: number): string {
  const opacity = Math.min(intensity * 0.6, 0.5);
  return `conic-gradient(
    from ${angle}deg at 50% 50%,
    rgba(61, 90, 128, ${opacity}) 0deg,
    rgba(124, 58, 237, ${opacity}) 72deg,
    rgba(236, 72, 153, ${opacity}) 144deg,
    rgba(249, 115, 22, ${opacity}) 216deg,
    rgba(6, 182, 212, ${opacity}) 288deg,
    rgba(61, 90, 128, ${opacity}) 360deg
  )`;
}

/**
 * Generates a radial gradient for spotlight effect at mouse position.
 */
export function getSpotlightGradient(x: number, y: number, intensity: number): string {
  const opacity = Math.min(intensity * 0.3, 0.2);
  return `radial-gradient(
    600px circle at ${x * 100}% ${y * 100}%,
    rgba(124, 58, 237, ${opacity}),
    rgba(61, 90, 128, ${opacity * 0.5}) 40%,
    transparent 70%
  )`;
}
