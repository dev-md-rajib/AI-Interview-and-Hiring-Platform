import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Day / Light mode' : 'Switch to Dark mode'}
      aria-label={isDark ? 'Switch to Day / Light mode' : 'Switch to Dark mode'}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-300 group
        ${isDark 
          ? 'bg-dark-800/80 border-dark-border text-amber-300 hover:text-amber-200 hover:border-amber-400/40 hover:bg-dark-700 shadow-sm' 
          : 'bg-white/90 border-slate-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-300 hover:bg-white shadow-sm'
        } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <HiSun className="w-5 h-5 transition-transform duration-500 transform group-hover:rotate-45 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
        ) : (
          <HiMoon className="w-5 h-5 transition-transform duration-500 transform group-hover:-rotate-12 text-indigo-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide">
          {isDark ? 'Day Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
