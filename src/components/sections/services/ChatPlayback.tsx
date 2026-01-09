'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { conversationScript } from './constants';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

// Bot avatar SVG - compact size
const BotAvatar = memo(() => (
  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
    <svg className="w-2.5 h-2.5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  </div>
));
BotAvatar.displayName = 'BotAvatar';

export function ChatPlayback() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const animation = animationRef.current;
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const typeText = async (text: string) => {
      for (let i = 0; i <= text.length; i++) {
        if (animation.cancelled) return;
        setCurrentInput(text.slice(0, i));
        await sleep(35 + Math.random() * 25);
      }
    };

    const runConversation = async () => {
      while (!animation.cancelled) {
        setMessages([]);
        setCurrentInput('');
        setIsTyping(false);
        await sleep(1500);

        for (const item of conversationScript) {
          if (animation.cancelled) return;

          if (item.type === 'user') {
            await typeText(item.text);
            await sleep(350);
            if (animation.cancelled) return;
            setIsSending(true);
            await sleep(150);
            setIsSending(false);
            setCurrentInput('');
            setMessages(prev => [...prev, { type: 'user', text: item.text }]);
            setTimeout(scrollToBottom, 50);
            await sleep(500);
          } else {
            if (animation.cancelled) return;
            setIsTyping(true);
            setTimeout(scrollToBottom, 50);
            await sleep(1000 + item.text.length * 6);
            if (animation.cancelled) return;
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: item.text }]);
            setTimeout(scrollToBottom, 50);
            await sleep(1200);
          }
        }
        await sleep(2500);
      }
    };

    runConversation();
    return () => { animation.cancelled = true; };
  }, []);

  return (
    <div className="rounded-2xl bg-[#111111] border border-white/[0.08] overflow-hidden">
      {/* Chat Header */}
      <div className="px-3 py-2.5 border-b border-white/[0.05] flex items-center gap-2.5">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-zinc-500 font-medium">Support Assistant</span>
      </div>

      {/* Chat Messages - reduced height and padding */}
      <div ref={chatContainerRef} className="h-[220px] p-3 space-y-3 overflow-y-auto">
        {/* Bot welcome */}
        <div className="flex gap-2">
          <BotAvatar />
          <div className="bg-white/[0.05] rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
            <p className="text-xs text-zinc-300 leading-relaxed">Hi! How can I help you today?</p>
          </div>
        </div>

        {/* Dynamic messages */}
        {messages.map((msg, i) => (
          msg.type === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="bg-white rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                <p className="text-xs text-zinc-900 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-2">
              <BotAvatar />
              <div className="bg-white/[0.05] rounded-xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                <p className="text-xs text-zinc-300 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          )
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2">
            <BotAvatar />
            <div className="bg-white/[0.05] rounded-xl rounded-tl-sm px-3 py-2">
              <div className="flex gap-1 items-center">
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-pulse [animation-delay:0ms]" />
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-pulse [animation-delay:200ms]" />
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-pulse [animation-delay:400ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact Input Bar */}
      <div className="p-2.5 border-t border-white/[0.05]">
        <div className="relative">
          {/* Glowing border */}
          <div
            className="absolute -inset-[1px] rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
            }}
          />
          {/* Input container */}
          <div className="relative bg-[#1a1a1a] rounded-lg flex items-center gap-2 px-2.5 py-2">
            <button className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors flex-shrink-0">
              <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className="flex-1 min-w-0 min-h-[20px] flex items-center">
              {currentInput ? (
                <span className="text-xs text-zinc-300 break-words leading-relaxed">{currentInput}</span>
              ) : (
                <span className="text-xs text-zinc-600">Type a message...</span>
              )}
            </div>
            <motion.button
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-zinc-200 transition-colors flex-shrink-0"
              animate={isSending ? {
                scale: [1, 0.85, 1],
                backgroundColor: ['#ffffff', '#e4e4e7', '#ffffff'],
              } : {}}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <motion.svg
                className="w-3 h-3 text-zinc-900"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={isSending ? { x: [0, 3, 0] } : {}}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
