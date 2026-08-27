import React from 'react';
import { Minus, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const WindowControls: React.FC = () => {
  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <div className="fixed top-3 right-3 z-[9999] flex items-center gap-1.5 pointer-events-auto">
      <ThemeToggle />
      <button
        onClick={handleMinimize}
        className="w-7 h-7 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700/50 flex items-center justify-center text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm active:scale-95"
        title="Minimize Window"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleClose}
        className="w-7 h-7 rounded-lg bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white border border-zinc-300 dark:border-zinc-700/50 flex items-center justify-center text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition-all shadow-sm active:scale-95"
        title="Close App"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

