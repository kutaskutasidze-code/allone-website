"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function AnimatedBorderCard({
  children,
  containerClassName,
  className,
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
  // CSS-based animation class for the glow position
  const glowPositionClass = {
    TOP: "animate-glow-top",
    LEFT: "animate-glow-left",
    BOTTOM: "animate-glow-bottom",
    RIGHT: "animate-glow-right",
  }[initialDirection];

  // Simplified version for mobile - static glow, no animation
  if (simplified) {
    return (
      <div className={cn("relative rounded-3xl h-full", containerClassName)}>
        {/* Static glow */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "radial-gradient(50% 70% at 50% 0%, rgba(255,255,255,0.5) 0%, rgba(200,200,200,0.2) 40%, transparent 70%)",
          }}
        />
        {/* Static border */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.07) 100%)",
          }}
        />
        {/* Inner card */}
        <div className={cn("relative z-10 m-[2px] rounded-[22px] bg-[#0a0a0a] overflow-hidden h-[calc(100%-4px)]", className)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-3xl h-full", containerClassName)}>
      {/* CSS animated glow - uses GPU-accelerated opacity animation */}
      <div className={cn("absolute inset-0 rounded-3xl", glowPositionClass)} />

      {/* Static border */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)",
        }}
      />

      {/* Inner card */}
      <div className={cn("relative z-10 m-[2px] rounded-[22px] bg-[#0a0a0a] overflow-hidden h-[calc(100%-4px)]", className)}>
        {children}
      </div>
    </div>
  );
}
