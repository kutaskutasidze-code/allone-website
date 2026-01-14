'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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
  displayedContent?: string;
}

const colors = [
  '38, 38, 38',
  '64, 64, 64',
  '82, 82, 82',
  '115, 115, 115',
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

// Typewriter component for streaming effect
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    let index = 0;
    const speed = 20; // ms per character

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, isComplete, onComplete]);

  return <>{displayedText}</>;
}

export function Hero() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const openChat = useCallback(() => {
    setIsChatActive(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatActive(false);
    setMessages([]);
    setInput('');
    setStreamingMessageId(null);
  }, []);

  // Global ESC key listener
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatActive) {
        closeChat();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isChatActive, closeChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessageId(assistantMessageId);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't connect. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingMessageId(errorMessage.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden">
      <ConnectedNodes />

      <Container>
        <div className="flex flex-col items-center text-center pt-28 pb-16 lg:pt-36 lg:pb-20 relative z-10 min-h-[400px] justify-center">
          <LayoutGroup>
            {/* Headline and description - fade out when chat active */}
            <AnimatePresence>
              {!isChatActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-6">
                    <ShimmerText
                      text="The Future Runs Itself"
                      className="text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] tracking-[-0.02em]"
                      delay={0.2}
                    />
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-base lg:text-lg text-[var(--gray-500)] max-w-md leading-relaxed mb-10"
                  >
                    We design and build intelligent automation systems that
                    transform how businesses operate, scale, and compete.
                  </motion.p>

                  {/* View Our Work button - fades out */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mb-4"
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages area - only shown when chat is active */}
            <AnimatePresence>
              {isChatActive && messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-xl mb-6 relative"
                >
                  {/* Fade gradient at top */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

                  {/* Messages container with fixed height and scroll */}
                  <div
                    ref={messagesContainerRef}
                    className="max-h-[200px] overflow-y-auto px-4 pt-8 pb-2 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.role === 'assistant' ? 50 : 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-3"
                      >
                        {message.role === 'user' ? (
                          <p className="text-sm text-[var(--gray-400)] italic text-left">
                            {message.content}
                          </p>
                        ) : (
                          <p className="text-base text-[var(--gray-700)] leading-relaxed text-left">
                            {streamingMessageId === message.id ? (
                              <TypewriterText
                                text={message.content}
                                onComplete={() => setStreamingMessageId(null)}
                              />
                            ) : (
                              message.content
                            )}
                          </p>
                        )}
                      </motion.div>
                    ))}

                    {/* Loading dots */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1 py-2"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ask AI button / Input - transforms between states */}
            <motion.div
              layout
              className="relative"
            >
              {!isChatActive ? (
                <motion.button
                  layoutId="chat-input"
                  onClick={openChat}
                  className="px-8 py-3.5 text-sm font-medium tracking-wide bg-white text-[var(--black)] border border-[var(--gray-300)] rounded-full hover:border-[var(--gray-400)] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ask AI
                </motion.button>
              ) : (
                <motion.div
                  layoutId="chat-input"
                  className="relative"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                    className="min-w-[200px] px-8 py-3.5 text-sm font-medium tracking-wide bg-white text-[var(--black)] border border-[var(--gray-300)] rounded-full outline-none text-left focus:border-[var(--gray-400)] transition-colors caret-[var(--gray-500)]"
                  />

                  <AnimatePresence>
                    {input.trim() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={sendMessage}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--gray-500)] hover:text-[var(--gray-800)] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>

            {/* ESC hint - only when chat is active */}
            <AnimatePresence>
              {isChatActive && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs text-[var(--gray-400)] mt-6"
                >
                  press <kbd className="px-1.5 py-0.5 bg-[var(--gray-100)] rounded text-[var(--gray-500)]">esc</kbd> to close
                </motion.p>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </Container>
    </section>
  );
}
