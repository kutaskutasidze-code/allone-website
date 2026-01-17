'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Typewriter component - uses ref for callback to prevent restarts
const TypewriterText = memo(function TypewriterText({
  text,
  messageId,
  onComplete
}: {
  text: string;
  messageId: string;
  onComplete: (id: string) => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref updated without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    // Only reset if text actually changes
    indexRef.current = 0;
    completedRef.current = false;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        const charsToAdd = Math.min(3, text.length - indexRef.current);
        indexRef.current += charsToAdd;
        setDisplayedText(text.slice(0, indexRef.current));
      } else if (!completedRef.current) {
        completedRef.current = true;
        clearInterval(interval);
        onCompleteRef.current(messageId);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text, messageId]); // Removed onComplete from deps - using ref instead

  return <>{displayedText}</>;
});

// Memoized message component
const ChatMessage = memo(function ChatMessage({
  message,
  onTypingComplete
}: {
  message: Message;
  onTypingComplete: (id: string) => void;
}) {
  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          message.role === 'user' ? 'bg-black/10' : 'bg-black'
        }`}
      >
        {message.role === 'user' ? (
          <User className="w-4 h-4 text-black" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.role === 'user'
            ? 'bg-black text-white rounded-tr-sm'
            : 'bg-black/5 text-black rounded-tl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.isTyping ? (
            <TypewriterText
              text={message.content}
              messageId={message.id}
              onComplete={onTypingComplete}
            />
          ) : (
            message.content
          )}
        </p>
      </div>
    </div>
  );
});

// Isolated input component - typing here won't re-render messages
const ChatInput = memo(function ChatInput({
  onSend,
  isLoading,
  isRecording,
  isTranscribing,
  isAiTyping,
  onToggleRecording,
  inputRef,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  isAiTyping: boolean;
  onToggleRecording: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [inputValue, setInputValue] = useState('');

  const isDisabled = isLoading || isTranscribing || isAiTyping;

  const handleSend = () => {
    if (inputValue.trim() && !isDisabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Expose method to set input value from parent (for transcription)
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      (input as HTMLInputElement & { setExternalValue?: (v: string) => void }).setExternalValue = (v: string) => {
        setInputValue(prev => prev + (prev ? ' ' : '') + v);
      };
    }
  }, [inputRef]);

  return (
    <div className="p-4 border-t border-black/10">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isTranscribing ? "Transcribing..." : isRecording ? "Listening..." : isAiTyping ? "AI is responding..." : "Type or speak your message..."}
          className="flex-1 px-4 py-3 bg-black/5 rounded-full text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/20"
          disabled={isDisabled}
        />
        <button
          onClick={onToggleRecording}
          disabled={isDisabled}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : isTranscribing
                ? 'bg-black/10 text-black/50'
                : 'bg-black/10 text-black hover:bg-black/20'
          } disabled:cursor-not-allowed`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isTranscribing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isDisabled}
          className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-black/60 text-center mt-2">
        Powered by ALLONE AI
      </p>
    </div>
  );
});

// Messages list component - isolated from input state
const MessagesList = memo(function MessagesList({
  messages,
  isLoading,
  onTypingComplete,
  messagesContainerRef,
  messagesEndRef,
  onScroll,
  onTouchMove,
}: {
  messages: Message[];
  isLoading: boolean;
  onTypingComplete: (id: string) => void;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onTouchMove: (e: React.TouchEvent) => void;
}) {
  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      onTouchMove={onTouchMove}
      className="flex-1 min-h-0 overflow-y-scroll p-5 space-y-4"
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        isolation: 'isolate',
      }}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onTypingComplete={onTypingComplete}
        />
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-black/5 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span className="text-sm text-black">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
});

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm the ALLONE AI Assistant. I can help you learn about our AI automation services, answer questions about how we work, or help you get started. What would you like to know?",
      isTyping: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Check if any message is currently typing
  const isAiTyping = messages.some(m => m.isTyping);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const lastScrollTopRef = useRef(0);

  // Stable callback for typing completion
  const handleTypingComplete = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
  }, []);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [shouldAutoScroll]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (scrollTop < lastScrollTopRef.current && !isAtBottom) {
      setShouldAutoScroll(false);
    } else if (isAtBottom) {
      setShouldAutoScroll(true);
    }

    lastScrollTopRef.current = scrollTop;
  }, []);

  // Use native event listener for wheel to ensure non-passive (Windows fix)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const newScrollTop = Math.max(0, Math.min(scrollTop + e.deltaY, maxScroll));
      container.scrollTop = newScrollTop;
      e.preventDefault();
    };

    // Add with { passive: false } to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      setShouldAutoScroll(true);
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      isTyping: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShouldAutoScroll(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
            .filter((m) => m.id !== 'welcome')
            .map((m) => ({ role: m.role, content: m.content })),
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
        isTyping: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly at info@allone.ge",
        isTyping: false,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          const response = await fetch('/api/transcribe', { method: 'POST', body: formData });
          const data = await response.json();
          if (data.text && inputRef.current) {
            const input = inputRef.current as HTMLInputElement & { setExternalValue?: (v: string) => void };
            input.setExternalValue?.(data.text);
            inputRef.current.focus();
          }
        } catch (error) {
          console.error('Transcription error:', error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      startRecording();
    }
  }, [isRecording, startRecording]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">ALLONE Assistant</h3>
                  <p className="text-xs text-black">Ask me about AI automation</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <MessagesList
              messages={messages}
              isLoading={isLoading}
              onTypingComplete={handleTypingComplete}
              messagesContainerRef={messagesContainerRef}
              messagesEndRef={messagesEndRef}
              onScroll={handleScroll}
              onTouchMove={handleTouchMove}
            />

            <ChatInput
              onSend={sendMessage}
              isLoading={isLoading}
              isRecording={isRecording}
              isTranscribing={isTranscribing}
              isAiTyping={isAiTyping}
              onToggleRecording={toggleRecording}
              inputRef={inputRef}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
