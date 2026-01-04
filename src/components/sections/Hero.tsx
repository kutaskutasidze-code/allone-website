'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { useEffect, useRef } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulseOffset: number;
  color: string;
}

const colors = [
  '10, 10, 10',     // Near black
  '38, 38, 38',     // Charcoal
  '64, 64, 64',     // Dark gray
  '82, 82, 82',     // Medium gray
  '115, 115, 115',  // Gray
  '140, 140, 140',  // Light gray
];

function ConnectedNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let animationFrameId: number;
    let nodes: Node[] = [];
    const connectionDistance = 180;
    const nodeCount = 60;

    const getCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return { width: window.innerWidth, height: window.innerHeight };
      return { width: parent.offsetWidth, height: parent.offsetHeight };
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = getCanvasDimensions();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const initNodes = () => {
      nodes = [];
      const { width, height } = getCanvasDimensions();

      const isMobile = width < 768;
      const count = isMobile ? 30 : nodeCount;
      const speed = isMobile ? 0.15 : 0.2;
      const padding = 20;

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: padding + Math.random() * (width - padding * 2),
          y: padding + Math.random() * (height - padding * 2),
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: isMobile ? 1.5 + Math.random() * 1.5 : 2 + Math.random() * 2.5,
          pulseOffset: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    const animate = (time: number) => {
      const { width, height } = getCanvasDimensions();

      ctx.clearRect(0, 0, width, height);

      const padding = 20;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with padding
        if (node.x < padding) {
          node.x = padding;
          node.vx *= -1;
        } else if (node.x > width - padding) {
          node.x = width - padding;
          node.vx *= -1;
        }
        if (node.y < padding) {
          node.y = padding;
          node.vy *= -1;
        } else if (node.y > height - padding) {
          node.y = height - padding;
          node.vy *= -1;
        }

        const maxVel = 0.3;
        node.vx = Math.max(-maxVel, Math.min(maxVel, node.vx));
        node.vy = Math.max(-maxVel, Math.min(maxVel, node.vy));
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = easeInOutQuad(1 - distance / connectionDistance) * 0.35;

            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            );
            gradient.addColorStop(0, `rgba(${nodes[i].color}, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(${nodes[i].color}, ${opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${nodes[j].color}, ${opacity})`);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 0.002 + node.pulseOffset) * 0.3 + 1;
        const radius = node.radius * pulse;

        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 4
        );
        glowGradient.addColorStop(0, `rgba(${node.color}, 0.25)`);
        glowGradient.addColorStop(0.5, `rgba(${node.color}, 0.08)`);
        glowGradient.addColorStop(1, `rgba(${node.color}, 0)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.color}, 0.7)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    initNodes();

    let lastWidth = window.innerWidth;
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        resize();
        if (Math.abs(newWidth - lastWidth) > 50) {
          initNodes();
          lastWidth = newWidth;
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

export function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      {/* Connected nodes background */}
      <ConnectedNodes />

      <Container>
        <div className="flex flex-col items-center text-center pt-28 pb-16 lg:pt-36 lg:pb-20 relative z-10">
          {/* Main Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,6vw,5rem)] font-[var(--font-display)] font-light text-[var(--black)] leading-[1.1] tracking-[-0.02em]"
            >
              The Future Runs Itself
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base lg:text-lg text-[var(--gray-500)] max-w-md leading-relaxed"
          >
            We design and build intelligent automation systems that
            transform how businesses operate, scale, and compete.
          </motion.p>

          {/* Glass CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <GlassButton
              href="/projects"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              className="group"
            >
              View Our Work
            </GlassButton>
            <GlassButton
              href="/contact"
              variant="secondary"
              size="lg"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Get Started
            </GlassButton>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
