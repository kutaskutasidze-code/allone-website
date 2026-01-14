'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout';
import { useEffect, useRef, useState, useCallback } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { ShimmerText } from '@/components/ui/ShimmerText';
import { ArrowRight, Send } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulseOffset: number;
  color: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const colors = [
  '38, 38, 38',     // Charcoal
  '64, 64, 64',     // Dark gray
  '82, 82, 82',     // Medium gray
  '115, 115, 115',  // Gray
];

function ConnectedNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let isPaused = false;
    const connectionDistance = 150;
    const nodeCount = 40;

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
      const count = isMobile ? 20 : nodeCount;
      const speed = isMobile ? 0.12 : 0.15;
      const padding = 20;

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: padding + Math.random() * (width - padding * 2),
          y: padding + Math.random() * (height - padding * 2),
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: isMobile ? 1.5 + Math.random() * 1 : 2 + Math.random() * 1.5,
          pulseOffset: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const animate = (time: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const { width, height } = getCanvasDimensions();
      ctx.clearRect(0, 0, width, height);

      const padding = 20;
      const maxVel = 0.25;

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < padding) { node.x = padding; node.vx *= -1; }
        else if (node.x > width - padding) { node.x = width - padding; node.vx *= -1; }
        if (node.y < padding) { node.y = padding; node.vy *= -1; }
        else if (node.y > height - padding) { node.y = height - padding; node.vy *= -1; }

        node.vx = Math.max(-maxVel, Math.min(maxVel, node.vx));
        node.vy = Math.max(-maxVel, Math.min(maxVel, node.vy));
      }

      // Draw connections - simple lines, no gradients
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistance * connectionDistance) {
            const opacity = (1 - Math.sqrt(distSq) / connectionDistance) * 0.25;
            ctx.strokeStyle = `rgba(100, 100, 100, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes - simple circles, no gradients
      const pulse = Math.sin(time * 0.001) * 0.2 + 1;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const radius = node.radius * pulse;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.color}, 0.6)`;
        ctx.fill();
      }

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

    // Pause animation when tab is not visible to save resources
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
  const [isChatActive, setIsChatActive] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openChat = useCallback(() => {
    setIsChatActive(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatActive(false);
    setMessages([]);
    setInput('');
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't connect. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === 'Escape') {
      closeChat();
    }
  };

  return (
    <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden">
      {/* Connected nodes background */}
      <ConnectedNodes />

      <Container>
        <div className="flex flex-col items-center text-center pt-28 pb-16 lg:pt-36 lg:pb-20 relative z-10">
          <AnimatePresence mode="wait">
            {!isChatActive ? (
              /* Default Hero Content */
              <motion.div
                key="hero-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Main Headline with Shimmer */}
                <div className="mb-6">
                  <ShimmerText
                    text="The Future Runs Itself"
                    className="text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] tracking-[-0.02em]"
                    delay={0.2}
                  />
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

                {/* CTA Buttons */}
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
                    onClick={openChat}
                    variant="secondary"
                    size="lg"
                  >
                    Ask AI
                  </GlassButton>
                </motion.div>
              </motion.div>
            ) : (
              /* Chat Mode */
              <motion.div
                key="chat-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-2xl flex flex-col items-center"
              >
                {/* Messages */}
                <div className="w-full min-h-[120px] mb-8 flex flex-col items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{
                          opacity: 0,
                          x: message.role === 'assistant' ? 100 : 0,
                          y: message.role === 'user' ? -20 : 0
                        }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: 'easeOut',
                          delay: message.role === 'assistant' ? 0.1 : 0
                        }}
                        className={`w-full mb-4 ${
                          message.role === 'user'
                            ? 'text-center'
                            : 'text-center'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <span className="text-sm text-[var(--gray-400)] italic">
                            {message.content}
                          </span>
                        ) : (
                          <p className="text-base lg:text-lg text-[var(--gray-700)] leading-relaxed max-w-xl mx-auto">
                            {message.content}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1"
                    >
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </motion.div>
                  )}
                </div>

                {/* Input - minimal, no borders */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-md relative"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="write here"
                    disabled={isLoading}
                    className="w-full bg-transparent border-none outline-none text-center text-lg text-[var(--gray-800)] placeholder:text-[var(--gray-400)] focus:ring-0"
                    style={{ caretColor: 'var(--gray-500)' }}
                  />

                  {/* Subtle underline */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px bg-[var(--gray-300)]" />

                  {/* Send button - appears when there's input */}
                  <AnimatePresence>
                    {input.trim() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={sendMessage}
                        disabled={isLoading}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--gray-500)] hover:text-[var(--gray-800)] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Close hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-[var(--gray-400)] mt-8"
                >
                  press <kbd className="px-1.5 py-0.5 bg-[var(--gray-100)] rounded text-[var(--gray-500)]">esc</kbd> to close
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
