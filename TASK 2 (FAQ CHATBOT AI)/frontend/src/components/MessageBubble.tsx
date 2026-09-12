import React, { useState } from 'react';
import { Bot, User, Copy, Check, Sparkles, HelpCircle, ArrowRight, Mail, ExternalLink } from 'lucide-react';
import { Message } from '../types/faq';
import { triggerSupportEmailModal } from '../utils/supportEmail';

interface MessageBubbleProps {
  message: Message;
  onSuggestionClick?: (question: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSuggestionClick }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceBadge = (confidence?: number, isFallback?: boolean) => {
    if (confidence === undefined || confidence === null) return null;
    const percentage = Math.round(confidence * 100);

    if (isFallback) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <HelpCircle className="w-3 h-3" />
          <span>Low Match ({percentage}%)</span>
        </span>
      );
    }

    if (percentage >= 70) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3 h-3" />
          <span>High Match ({percentage}%)</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <span>Similarity: {percentage}%</span>
      </span>
    );
  };

  /**
   * Parses text and renders interactive mailto: links and URLs.
   */
  const renderFormattedText = (text: string) => {
    // Regex matches email addresses or web URLs
    const tokenRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+)/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }

      if (match[1]) {
        // Email match
        const email = match[1];
        parts.push(
          <button
            key={match.index}
            onClick={() =>
              triggerSupportEmailModal(
                'Coursemate AI Student Support Request',
                `Hello Coursemate Support,\n\nI am reaching out regarding:\n"${message.matched_question || message.text}"\n\n`
              )
            }
            className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 hover:bg-indigo-500/10 px-1 py-0.5 rounded transition-colors"
            title={`Click to send email to ${email}`}
          >
            <Mail className="w-3.5 h-3.5 inline mr-0.5 text-indigo-400" />
            <span>{email}</span>
          </button>
        );
      } else if (match[2]) {
        // URL match
        const url = match[2];
        parts.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-2 hover:bg-indigo-500/10 px-1 py-0.5 rounded transition-colors"
          >
            <span>{url}</span>
            <ExternalLink className="w-3 h-3 inline ml-0.5" />
          </a>
        );
      }

      lastIdx = tokenRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts;
  };

  const hasEmailInText = message.text.includes('support@coursemate.ai');

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[88%] sm:max-w-[80%] space-x-2.5 sm:space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-md ${
            isUser
              ? 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white'
              : 'bg-slate-800 border border-slate-700 text-indigo-400'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Bubble Container */}
        <div className="flex flex-col space-y-1.5">
          {/* Sender Label & Meta */}
          <div className={`flex items-center space-x-2 text-xs text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="font-semibold text-slate-300">{isUser ? 'You' : 'Coursemate Bot'}</span>
            <span>•</span>
            <span className="text-[11px]">{message.timestamp}</span>
            {!isUser && getConfidenceBadge(message.confidence, message.is_fallback)}
            {!isUser && message.category && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold bg-slate-800 text-slate-400 border border-slate-700/60">
                {message.category}
              </span>
            )}
          </div>

          {/* Text Bubble */}
          <div
            className={`relative p-3.5 sm:p-4 rounded-2xl text-sm sm:text-[14.5px] leading-relaxed shadow-sm transition-all ${
              isUser
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none hover:border-slate-600/70'
            }`}
          >
            {/* Matched FAQ Question Header for bot responses */}
            {!isUser && message.matched_question && (
              <div className="mb-2 pb-2 border-b border-slate-700/50 flex items-start space-x-1.5 text-xs text-slate-300">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 text-[11px] block">Matched Knowledge Base Question:</span>
                  <span className="font-medium text-slate-200 italic">"{message.matched_question}"</span>
                </div>
              </div>
            )}

            {/* Main Message Body with clickable emails and links */}
            <div className="whitespace-pre-wrap">
              {isUser ? message.text : renderFormattedText(message.text)}
            </div>

            {/* Workable Contact Support Email Banner when relevant */}
            {!isUser && (message.is_fallback || hasEmailInText) && (
              <div className="mt-3 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs text-indigo-300">
                  <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Need human assistance? Direct email support is ready.</span>
                </div>
                <button
                  onClick={() =>
                    triggerSupportEmailModal(
                      'Coursemate AI Student Support Request',
                      `Hello Support Team,\n\nI need assistance regarding:\n"${message.matched_question || message.text}"\n\n`
                    )
                  }
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex-shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email support@coursemate.ai</span>
                </button>
              </div>
            )}

            {/* Bottom Actions for Bot Message */}
            {!isUser && (
              <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-slate-400 hover:text-indigo-300 transition-colors"
                  title="Copy answer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy response</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-3">
                  {message.is_fallback && onSuggestionClick && (
                    <button
                      onClick={() => onSuggestionClick("How do I contact customer support?")}
                      className="text-slate-400 hover:text-indigo-300 text-[11px] underline underline-offset-2"
                    >
                      Ask about support
                    </button>
                  )}
                  <button
                    onClick={() =>
                      triggerSupportEmailModal(
                        'Coursemate AI Support Inquiry',
                        `Hello Support Team,\n\nInquiry regarding:\n"${message.matched_question || message.text}"\n\n`
                      )
                    }
                    className="text-indigo-400 hover:text-indigo-300 text-[11px] inline-flex items-center space-x-1 hover:underline"
                    title="Open email sender to email support"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email Support</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
