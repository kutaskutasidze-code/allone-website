'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout';
import { useEffect, useRef, useState, useCallback } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { ShimmerText } from '@/components/ui/ShimmerText';
import { ArrowRight, Send } from 'lucide-react';
import { LiquidMetal, PulsingBorder } from '@paper-design/shaders-react';

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
function TypewriterText({ text, onComplete, onType }: { text: string; onComplete?: () => void; onType?: () => void }) {
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
        onType?.(); // Trigger scroll on each character
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, isComplete, onComplete, onType]);

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
    setTimeout(() => inputRef.current?.focus(), 50);
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

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
    <section className="min-h-[100svh] relative overflow-hidden">
      <ConnectedNodes />

      <Container>
        {/* Fixed height container - button position never changes */}
        <div className="min-h-[100svh] flex flex-col items-center justify-center relative z-10 py-20">

          {/* Upper content area - fixed height so button stays in place */}
          <div className="h-[260px] flex flex-col items-center justify-end mb-4 relative">
            {/* Hero content - fades out */}
            <div
              className={`
                flex flex-col items-center text-center
                transition-all duration-500 ease-out
                ${isChatActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
              `}
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
                className="text-base lg:text-lg text-[var(--gray-500)] max-w-md leading-relaxed"
              >
                We design and build intelligent automation systems that transform how businesses operate, scale, and compete.
              </motion.p>

            </div>

            {/* Chat messages area - classic chatbot layout */}
            <div
              className={`
                absolute inset-0 flex flex-col justify-end
                w-full max-w-lg mx-auto px-4
                transition-all duration-500 ease-out
                ${isChatActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              `}
            >
              {/* Messages container - scrollable, content aligned to bottom */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto flex flex-col justify-end"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

                {/* Fade gradient at top */}
                {messages.length > 0 && (
                  <div className="sticky top-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                )}

                {/* Messages */}
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="animate-fade-in">
                      {message.role === 'user' ? (
                        <p className="text-sm text-black text-left">{message.content}</p>
                      ) : (
                        <p className="text-[15px] text-black leading-relaxed text-left">
                          {streamingMessageId === message.id ? (
                            <TypewriterText
                              text={message.content}
                              onComplete={() => setStreamingMessageId(null)}
                              onType={scrollToBottom}
                            />
                          ) : (
                            message.content
                          )}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-1.5 py-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ask AI - Button that expands into input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="relative flex justify-center items-center"
          >
            {/* PulsingBorder container */}
            <div
              className={`
                relative flex items-center justify-center
                transition-all duration-500 ease-out
                ${isChatActive ? 'w-[500px] sm:w-[540px] h-[80px]' : 'w-[320px] h-[80px]'}
              `}
            >
              {/* PulsingBorder shader - hidden when chat active */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${isChatActive ? 'opacity-0' : 'opacity-100'}`}>
                <PulsingBorder
                  speed={0.79}
                  roundness={1}
                  thickness={0.03}
                  softness={0.75}
                  intensity={0.25}
                  bloom={0.3}
                  spots={5}
                  spotSize={0.5}
                  pulse={0.25}
                  smoke={0.3}
                  smokeSize={0.6}
                  scale={0.6}
                  rotation={0}
                  aspectRatio="auto"
                  colors={['#233944', '#262426', '#F6F3F3C2']}
                  colorBack="#00000000"
                  className="w-full h-full"
                />
              </div>

              {/* Inner content - LiquidMetal + Button */}
              <div className={`relative z-10 flex items-center gap-3 ${isChatActive ? '' : 'pl-4'}`}>
                {/* LiquidMetal circle on left */}
                <div className={`flex-shrink-0 transition-all duration-500 overflow-hidden ${isChatActive ? 'opacity-0 scale-90 w-0' : 'opacity-100 scale-100'}`}>
                  <LiquidMetal
                    speed={0.68}
                    softness={0.1}
                    repetition={2}
                    shiftRed={0.3}
                    shiftBlue={0.3}
                    distortion={0.07}
                    contour={0.4}
                    scale={0.6}
                    rotation={0}
                    shape="circle"
                    angle={70}
                    image="https://workers.paper.design/file-assets/01KF3FJDBVRQRC2Z21M10KBDQ5/01KF3JVMCGH3M6TG0XEQ9ZA6S3.svg"
                    colorBack="#00000000"
                    colorTint="#FFFFFF"
                    className="w-[56px] h-[56px] rounded-full"
                  />
                </div>

                {/* Ask AI button / Input area */}
                <div
                  onClick={!isChatActive ? openChat : undefined}
                  className={`
                    relative h-[50px] rounded-full
                    flex items-center justify-center
                    transition-all duration-500 ease-out
                    ${!isChatActive ? 'cursor-pointer w-[140px]' : 'w-[420px] sm:w-[460px]'}
                  `}
                >
                  {/* "Ask AI" text */}
                  <span
                    className={`
                      text-base font-medium tracking-wide text-[var(--black)]
                      transition-all duration-300
                      ${isChatActive ? 'opacity-0 scale-90 absolute' : 'opacity-100 scale-100'}
                    `}
                  >
                    Ask AI
                  </span>

                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || !isChatActive}
                    placeholder={isChatActive ? "Ask me anything..." : ""}
                    className={`
                      w-full h-full px-6 pr-12
                      text-sm font-medium tracking-wide
                      bg-transparent text-black rounded-full
                      outline-none text-left caret-black
                      placeholder:text-black/50 placeholder:font-normal
                      transition-all duration-300
                      ${isChatActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}
                    `}
                  />

                  {/* Send button - only shows when typing */}
                  <button
                    onClick={(e) => { e.stopPropagation(); sendMessage(); }}
                    disabled={isLoading || !input.trim()}
                    className={`
                      absolute right-4 top-1/2 -translate-y-1/2
                      transition-all duration-200
                      ${isChatActive && input.trim()
                        ? 'opacity-100 text-black hover:text-black/70'
                        : 'opacity-0 pointer-events-none'}
                    `}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Close button - positioned absolutely to not affect centering */}
            <button
              onClick={closeChat}
              className={`
                absolute left-full ml-3 top-1/2 -translate-y-1/2
                p-2 rounded-full
                text-black hover:text-black/70 hover:bg-black/5
                transition-all duration-300
                ${isChatActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
              `}
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
