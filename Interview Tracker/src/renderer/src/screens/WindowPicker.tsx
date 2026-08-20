import React, { useState, useEffect, useCallback } from 'react';
import {
  Monitor,
  RefreshCw,
  ShieldCheck,
  AppWindow,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Globe,
  Terminal,
  FileText,
  Music,
  Video,
  MessageSquare,
  Code
} from 'lucide-react';
import { OpenWindowInfo, NextInterviewResponse } from '../../../shared/types';

interface WindowPickerProps {
  interview: NextInterviewResponse;
  onWindowSelected: (allowedPids: number[], allowedTitle?: string) => void;
  onCancel: () => void;
}

/**
 * Infer an icon for the process based on its name/title.
 */
function getWindowIcon(processName: string, title: string) {
  const name = processName.toLowerCase();
  const t = title.toLowerCase();

  if (name.includes('chrome') || name.includes('brave') || name.includes('firefox') || name.includes('edge') || name.includes('opera') || name.includes('safari'))
    return <Globe className="w-5 h-5" />;
  if (name.includes('code') || name.includes('vscode') || name.includes('intellij') || name.includes('webstorm') || name.includes('pycharm'))
    return <Code className="w-5 h-5" />;
  if (name.includes('terminal') || name.includes('cmd') || name.includes('powershell') || name.includes('wt'))
    return <Terminal className="w-5 h-5" />;
  if (name.includes('discord') || name.includes('slack') || name.includes('teams') || name.includes('telegram') || name.includes('whatsapp'))
    return <MessageSquare className="w-5 h-5" />;
  if (name.includes('spotify') || name.includes('music') || t.includes('music'))
    return <Music className="w-5 h-5" />;
  if (name.includes('vlc') || name.includes('mpv') || t.includes('video') || t.includes('youtube'))
    return <Video className="w-5 h-5" />;
  if (name.includes('notepad') || name.includes('word') || name.includes('excel') || name.includes('docs'))
    return <FileText className="w-5 h-5" />;

  return <AppWindow className="w-5 h-5" />;
}

export const WindowPicker: React.FC<WindowPickerProps> = ({
  interview,
  onWindowSelected,
  onCancel
}) => {
  const [windows, setWindows] = useState<OpenWindowInfo[]>([]);
  const [selectedItem, setSelectedItem] = useState<OpenWindowInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchWindows = useCallback(async () => {
    setIsLoading(true);
    try {
      if (window.trackerAPI) {
        const openWindows = await window.trackerAPI.listWindows();
        setWindows(openWindows);
        if (selectedItem) {
          const stillExists = openWindows.some(
            (w) => (w.id && w.id === selectedItem.id) || (w.pid === selectedItem.pid && w.tabTitle === selectedItem.tabTitle)
          );
          if (!stillExists) {
            setSelectedItem(null);
          }
        }
      } else if (window.electronAPI) {
        const openWindows = await window.electronAPI.getOpenWindows();
        setWindows(openWindows);
        if (selectedItem) {
          const stillExists = openWindows.some(
            (w) => (w.id && w.id === selectedItem.id) || (w.pid === selectedItem.pid && w.tabTitle === selectedItem.tabTitle)
          );
          if (!stillExists) {
            setSelectedItem(null);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch open windows:', err);
    }
    setIsLoading(false);
  }, [selectedItem]);

  useEffect(() => {
    fetchWindows();
  }, []);

  const handleConfirm = async () => {
    if (!selectedItem) return;
    setIsConfirming(true);

    // Pass the selected PID and title to the parent, which will start lockdown with it
    onWindowSelected([selectedItem.pid], selectedItem.tabTitle || selectedItem.windowTitle);
  };

  return (
    <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-2">
            <Monitor className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Select Your Interview Window / Tab
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Choose the window or browser tab where you'll be taking your interview for{' '}
            <span className="text-white font-medium">{interview.jobTitle}</span>.
            All other applications and secondary browser tabs will be closed once you confirm.
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <span className="font-semibold text-amber-300">Single-Tab Policy:</span>{' '}
            If you select a browser, only the selected tab will remain open. All other tabs will be automatically closed and opening new tabs is blocked.
          </p>
        </div>

        {/* Window list */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* List header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppWindow className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Open Windows & Browser Tabs ({windows.length})
              </span>
            </div>
            <button
              onClick={fetchWindows}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-150"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Scrollable window list */}
          <div className="max-h-[320px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mb-3" />
                <span className="text-xs font-medium">Scanning open windows and browser tabs...</span>
              </div>
            ) : windows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <AppWindow className="w-8 h-8 mb-3 opacity-50" />
                <span className="text-xs font-medium">No open windows or tabs detected</span>
                <span className="text-xs text-zinc-600 mt-1">Open your interview browser tab, then click Refresh</span>
              </div>
            ) : (
              windows.map((win, idx) => {
                const itemKey = win.id || `${win.pid}-${win.tabTitle || win.windowTitle}-${idx}`;
                const isSelected = selectedItem !== null && (
                  selectedItem.id ? selectedItem.id === win.id : (selectedItem.pid === win.pid && selectedItem.tabTitle === win.tabTitle)
                );
                const displayTitle = win.tabTitle || win.windowTitle;

                return (
                  <button
                    key={itemKey}
                    onClick={() => setSelectedItem(win)}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-150
                      ${isSelected
                        ? 'bg-blue-500/15 border border-blue-500/40 ring-1 ring-blue-500/20'
                        : 'bg-zinc-800/40 border border-transparent hover:bg-zinc-800/80 hover:border-zinc-700/50'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                      ${isSelected
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-zinc-700/50 text-zinc-400'
                      }
                    `}>
                      {getWindowIcon(win.processName, displayTitle)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                          {displayTitle}
                        </p>
                        {win.isTab && (
                          <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
                            Tab
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {win.processName} {win.isTab ? '· Browser Tab' : `· PID ${win.pid}`}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-zinc-600 bg-transparent'
                      }
                    `}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedItem || isConfirming}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg
              ${selectedItem
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
              }
            `}
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Starting Lockdown...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Start Lockdown</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(113, 113, 122, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.5);
        }
      `}</style>
    </div>
  );
};
