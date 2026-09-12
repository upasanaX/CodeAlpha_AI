import React, { useState } from 'react';
import { Cpu, Activity, Sun, Moon, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { HealthResponse, User } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  health: HealthResponse | null;
  isConnected: boolean;
  isDarkMode: boolean;
  currentUser: User | null;
  onToggleTheme: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  isConnected,
  isDarkMode,
  currentUser,
  onToggleTheme,
  onOpenAuthModal,
  onLogout
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-[#111622] border-b border-gray-200 dark:border-gray-800 shadow-xs sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <Logo className="w-10 h-10" showText={false} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center">
                Track<span className="text-brand-600 dark:text-brand-500">Optic</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[11px] font-bold text-white bg-brand-600 rounded">
                  AI
                </span>
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 rounded">
                YOLOv8 + SORT
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Task 4 – AI Internship <span className="mx-1">•</span> Vision Intelligence Command Center
            </p>
          </div>
        </div>

        {/* Status Indicators, Auth & Theme Switcher */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Stream Status */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md border font-medium ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-500'}`} />
            <span>{isConnected ? 'Stream Active' : 'Standby'}</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium">
            <Cpu className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{health ? health.model : 'YOLOv8n'}</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium">
            <Activity className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>SORT (Kalman)</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center justify-center p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 transition-colors shadow-2xs"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Account Button / Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 py-1 px-2.5 rounded-md bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-brand-800 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span className="font-semibold">{currentUser.username}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#161c28] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1.5 z-40 animate-fadeIn">
                  <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-200">{currentUser.username}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
