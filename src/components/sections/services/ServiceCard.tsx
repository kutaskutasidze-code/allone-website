'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { AnimatedBorderCard } from '@/components/ui/animated-border-card';
import { SPRING_CONFIG, OPACITY_SPRING_CONFIG, DIRECTION_TRANSFORMS, easeOutCubic, type Direction } from './constants';

type BorderDirection = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface ServiceCardProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  borderStart?: BorderDirection;
}

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Custom hook for scroll-linked spring animations (desktop only)
function useScrollSpring(scrollYProgress: MotionValue<number>, outputRange: [number, number], enabled: boolean) {
  const smoothProgress = useTransform(scrollYProgress, easeOutCubic);
  const value = useTransform(smoothProgress, [0, 1], outputRange);
  // Lighter spring config for better performance
  const spring = useSpring(value, enabled ? SPRING_CONFIG : { stiffness: 200, damping: 30, mass: 0.1 });
  return enabled ? spring : value;
}

// Mobile-optimized card with CSS transitions
function MobileServiceCard({ children, className = '', borderStart = 'TOP' }: Omit<ServiceCardProps, 'direction'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      <AnimatedBorderCard initialDirection={borderStart} simplified>
        {children}
      </AnimatedBorderCard>
    </div>
  );
}

// Desktop card with full spring animations
function DesktopServiceCard({ children, className = '', direction = 'bottom', borderStart = 'TOP' }: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 40%"]
  });

  const transforms = DIRECTION_TRANSFORMS[direction];

  // Simplified: only use essential transforms
  const smoothY = useScrollSpring(scrollYProgress, transforms.y, true);
  const smoothScale = useScrollSpring(scrollYProgress, [0.98, 1], true);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        y: smoothY,
        scale: smoothScale,
        opacity,
      }}
      className={`h-full ${className}`}
    >
      <AnimatedBorderCard initialDirection={borderStart}>{children}</AnimatedBorderCard>
    </motion.div>
  );
}

export function ServiceCard(props: ServiceCardProps) {
  const isMobile = useIsMobile();

  // Render appropriate version based on device
  if (isMobile) {
    return <MobileServiceCard {...props} />;
  }

  return <DesktopServiceCard {...props} />;
}
