import React from 'react';
import { MessageSquare, Database, Mail } from 'lucide-react';
import { HealthStatus } from '../types/faq';

interface NavbarProps {
  currentView: 'chat' | 'admin';
  onViewChange: (view: 'chat' | 'admin') => void;
  health: HealthStatus | null;
  faqCount: number;
  onOpenSupport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  health,
  faqCount,
  onOpenSupport,
}) => {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onViewChange('chat')}>
          <img
            src="/coursemate-icon.svg"
            alt="Coursemate AI Logo"
            className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                Coursemate <span className="text-indigo-400">AI</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                FAQ Bot
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">NLP & TF-IDF Similarity Assistant</p>
          </div>
        </div>

        {/* View Switcher Tabs & Status */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 flex items-center space-x-1">
            <button
              onClick={() => onViewChange('chat')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Knowledge Base</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-slate-900/60 rounded-full font-mono text-slate-300">
                {faqCount}
              </span>
            </button>
          </div>

          {/* Workable Email Support Link / Launcher */}
          <button
            onClick={onOpenSupport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all shadow-sm group"
            title="Click to directly send email to support@coursemate.ai"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">support@coursemate.ai</span>
            <span className="sm:hidden">Email Support</span>
          </button>

          {/* Health indicator */}
          <div
            className="hidden md:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400"
            title={`Status: ${isHealthy ? 'Online' : 'Checking...'}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="font-mono text-[11px]">{isHealthy ? 'Online' : 'Connecting'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
