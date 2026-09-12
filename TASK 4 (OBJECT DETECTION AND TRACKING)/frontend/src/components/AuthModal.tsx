import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { videoApi } from '../api/videoApi';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await videoApi.login(usernameOrEmail, password);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await videoApi.register(regUsername, regEmail, regPassword);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Register or login demo account
      try {
        const res = await videoApi.register('demo_analyst', 'demo@trackoptic.ai', 'TrackOptic2026!');
        onLoginSuccess(res.user);
        onClose();
        return;
      } catch {
        // If already exists, login
        const res = await videoApi.login('demo_analyst', 'TrackOptic2026!');
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Demo access unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#111622] rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-md w-full overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-[#0c1017]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                TrackOptic Security
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                User Authentication & Session Cloud Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50/40 dark:bg-brand-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5">
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </div>
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50/40 dark:bg-brand-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </div>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center space-x-2 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md p-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="e.g. analyst or name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161c28] text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161c28] text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161c28] text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161c28] text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161c28] text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-md transition-colors shadow-xs flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Registering...' : 'Create Account'}</span>
              </button>
            </form>
          )}

          {/* 1-Click Demo Login */}
          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-md text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>1-Click Demo Analyst Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
