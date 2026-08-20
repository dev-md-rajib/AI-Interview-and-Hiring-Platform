import React from 'react';
import { Minus, X } from 'lucide-react';

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
      <button
        onClick={handleMinimize}
        className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-md active:scale-95"
        title="Minimize Window"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleClose}
        className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-red-600 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-md active:scale-95"
        title="Close App"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
