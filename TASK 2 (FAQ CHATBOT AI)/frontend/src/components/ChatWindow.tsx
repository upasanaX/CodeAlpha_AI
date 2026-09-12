import React, { useRef, useEffect } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Message } from '../types/faq';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick: (question: string) => void;
  onClearChat: () => void;
}

const QUICK_PROMPTS = [
  "How do I reset my password?",
  "Can I get a refund for my course?",
  "Can I access courses on mobile?",
  "How do I download my certificate?",
  "Do I get lifetime access to courses?",
  "Why is the video player buffering?",
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSuggestionClick,
  onClearChat,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome / Empty State */}
        {messages.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-5 animate-fade-in">
            <div className="relative group">
              <img
                src="/coursemate-icon.svg"
                alt="Coursemate AI Logo"
                className="w-20 h-20 rounded-3xl shadow-2xl shadow-indigo-600/40 group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How can we help you today?
              </h2>
              <p className="text-sm text-slate-400">
                Ask any question about Coursemate Academy courses, refunds, certificates, or technical issues.
                Our NLP engine matches your question with high precision.
              </p>
            </div>

            {/* Quick Suggestions */}
            <div className="w-full pt-4">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSuggestionClick(prompt)}
                    className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-xs sm:text-sm group"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header controls inside chat */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs text-slate-400">
              <span>{messages.length} message{messages.length !== 1 ? 's' : ''} in conversation</span>
              <button
                onClick={onClearChat}
                className="text-slate-400 hover:text-rose-400 transition-colors underline underline-offset-2"
              >
                Clear Conversation
              </button>
            </div>

            {/* Message List */}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onSuggestionClick={onSuggestionClick}
              />
            ))}
          </>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-800 border border-slate-700/70 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-typing" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-typing" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-typing" style={{ animationDelay: '400ms' }}></div>
                <span className="text-xs text-slate-400 ml-2 font-medium">Computing similarity...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
