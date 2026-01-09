"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function AnimatedBorderCard({
  children,
  containerClassName,
  className,
  duration = 2.5,
  clockwise = true,
  initialDirection = "TOP",
  simplified = false,
}: React.PropsWithChildren<{
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  initialDirection?: Direction;
  simplified?: boolean;
}>) {
  const [direction, setDirection] = useState<Direction>(initialDirection);

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  // Gradient positions - white/silver light that travels around the border
  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.4) 35%, rgba(150,150,150,0.15) 60%, transparent 100%)",
    LEFT: "radial-gradient(40% 60% at 0% 50%, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.4) 35%, rgba(150,150,150,0.15) 60%, transparent 100%)",
    BOTTOM: "radial-gradient(50% 70% at 50% 100%, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.4) 35%, rgba(150,150,150,0.15) 60%, transparent 100%)",
    RIGHT: "radial-gradient(40% 60% at 100% 50%, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.4) 35%, rgba(150,150,150,0.15) 60%, transparent 100%)",
  };

  // Simplified gradient for mobile (no animation needed, just static border)
  const staticGradient = "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)";

  useEffect(() => {
    // Skip animation interval on simplified mode
    if (simplified) return;

    const interval = setInterval(() => {
      setDirection((prevState) => rotateDirection(prevState));
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [duration, clockwise, simplified]);

  // Simplified version for mobile - static glow, no animation
  if (simplified) {
    return (
      <div
        className={cn(
          "relative rounded-3xl h-full",
          containerClassName
        )}
      >
        {/* Static glow - positioned at top */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.6) 0%, rgba(200,200,200,0.3) 35%, rgba(150,150,150,0.1) 60%, transparent 100%)",
          }}
        />

        {/* Outer glow for depth */}
        <div
          className="absolute -inset-[1px] rounded-3xl opacity-40"
          style={{
            background: "radial-gradient(50% 50% at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* Static subtle border */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{ background: staticGradient }}
        />

        {/* Inner card */}
        <div
          className={cn(
            "relative z-10 m-[2px] rounded-[22px] bg-[#0a0a0a] overflow-hidden h-[calc(100%-4px)]",
            className
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-3xl h-full",
        containerClassName
      )}
    >
      {/* Animated gradient light - the moving spotlight */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ filter: "blur(2px)" }}
        animate={{ background: movingMap[direction] }}
        transition={{ ease: [0.4, 0, 0.2, 1], duration: duration * 0.9 }}
      />

      {/* Outer glow for depth - reduced blur for better performance */}
      <motion.div
        className="absolute -inset-[1px] rounded-3xl opacity-30"
        style={{ filter: "blur(6px)" }}
        animate={{ background: movingMap[direction] }}
        transition={{ ease: [0.4, 0, 0.2, 1], duration: duration * 0.9 }}
      />

      {/* Static subtle border */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)",
        }}
      />

      {/* Inner card - the actual content container */}
      <div
        className={cn(
          "relative z-10 m-[2px] rounded-[22px] bg-[#0a0a0a] overflow-hidden h-[calc(100%-4px)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
