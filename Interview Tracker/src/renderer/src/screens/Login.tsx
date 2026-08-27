import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { User } from '../../../shared/types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (window.electronAPI) {
        const authData = await window.electronAPI.login({
          email,
          password,
          rememberMe
        });
        setIsLoading(false);
        onLoginSuccess(authData.user);
      } else {
        // Fallback for standalone browser testing
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess({
            id: 'cand_9921',
            name: 'Alex Johnson',
            email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          });
        }, 800);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Invalid email or password');
    }
  };

  const handleOpenSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.electronAPI) {
      window.electronAPI.openExternal('http://localhost:5000/signup');
    }
  };

  const handleOpenForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.electronAPI) {
      window.electronAPI.openExternal('http://localhost:5000/forgot-password');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4 relative overflow-hidden transition-colors">
      {/* Top drag bar for frameless window */}
      <div className="absolute top-0 left-0 right-24 h-10 drag-region z-40" />
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-xl z-10 border border-slate-200 dark:border-zinc-800 transition-colors">
        {/* Header Logo + Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/60 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10 mb-3 p-1">
            <img src="/app-icon.svg" alt="App Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Interview Tracker</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Sign in to start your desktop proctored interview</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@company.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900/80 border border-slate-300 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Inline Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Remember Me & Lost Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 text-xs font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={handleOpenForgotPassword}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold"
            >
              Lost Your Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all duration-200 text-sm flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Link to Web Platform Signup */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-zinc-600 dark:text-zinc-400">
          Don't have an account?{' '}
          <button
            onClick={handleOpenSignup}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold inline-flex items-center gap-1 transition-colors"
          >
            Sign Up Now
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
