import React, { useState, useEffect } from 'react';
import { User, NextInterviewResponse, TrackerStatus } from '../../shared/types';
import { Login } from './screens/Login';
import { ConsentReady } from './screens/ConsentReady';
import { WindowPicker } from './screens/WindowPicker';
import { ActiveLockdown } from './screens/ActiveLockdown';
import { Settings } from './screens/Settings';
import { WindowControls } from './components/WindowControls';
import { ThemeProvider } from './context/ThemeContext';

type AppScreen = 'login' | 'consent-ready' | 'picking-window' | 'active-lockdown' | 'completed';

const MainApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentInterview, setCurrentInterview] = useState<NextInterviewResponse | null>(null);
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [screen, setScreen] = useState<AppScreen>('login');
  const [showSettings, setShowSettings] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check stored auth token on startup
  useEffect(() => {
    async function checkAuth() {
      if (window.electronAPI) {
        try {
          const stored = await window.electronAPI.getStoredAuth();
          if (stored && stored.user) {
            setUser(stored.user);
            setScreen('consent-ready');
          }
        } catch (err) {
          console.warn('Failed to restore session:', err);
        }

        // Register status change listener
        window.electronAPI.onStatusChange((newStatus) => {
          setStatus(newStatus);
        });
      }
      setIsInitializing(false);
    }

    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setStatus('idle');
    setScreen('consent-ready');
  };

  const handleLogout = async () => {
    if (window.electronAPI) {
      await window.electronAPI.logout();
    }
    setUser(null);
    setCurrentInterview(null);
    setStatus('idle');
    setScreen('login');
  };

  /**
   * When user clicks "Ready" on the ConsentReady screen,
   * transition to the window picker — NOT directly to lockdown.
   */
  const handleReadyClick = async (interview: NextInterviewResponse) => {
    setCurrentInterview(interview);
    setScreen('picking-window');
  };

  /**
   * User has picked their window in the WindowPicker.
   * Now start lockdown with the selected PID(s) and window title as allowed.
   */
  const handleWindowSelected = async (allowedPids: number[], allowedTitle?: string) => {
    if (!currentInterview) return;

    if (window.electronAPI) {
      const success = await window.electronAPI.startLockdown(currentInterview.interviewId, allowedPids, allowedTitle);
      if (success) {
        setStatus('active');
        setScreen('active-lockdown');
      }
    } else {
      // Dev fallback (no Electron API)
      setStatus('active');
      setScreen('active-lockdown');
    }
  };

  /**
   * User cancels the window picker — go back to consent/ready screen.
   */
  const handleWindowPickerCancel = () => {
    setScreen('consent-ready');
    setCurrentInterview(null);
  };

  const handleEndComplete = () => {
    setStatus('completed');
    setScreen('consent-ready');
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-slate-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-900 dark:text-white transition-colors">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading Tracker App...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login Screen
  if (!user || screen === 'login') {
    return (
      <>
        <WindowControls />
        <Login onLoginSuccess={handleLoginSuccess} />
        {showSettings && (
          <Settings user={null} onClose={() => setShowSettings(false)} onLogout={handleLogout} />
        )}
      </>
    );
  }

  // Window Picker Screen (between Ready and Active Lockdown)
  if (screen === 'picking-window' && currentInterview) {
    return (
      <>
        <WindowControls />
        <WindowPicker
          interview={currentInterview}
          onWindowSelected={handleWindowSelected}
          onCancel={handleWindowPickerCancel}
        />
      </>
    );
  }

  // Active Lockdown Screen
  if (screen === 'active-lockdown' && currentInterview) {
    return (
      <ActiveLockdown
        user={user}
        interview={currentInterview}
        onEndComplete={handleEndComplete}
      />
    );
  }

  // Consent & Ready Screen (default when logged in and not active)
  return (
    <>
      <WindowControls />
      <ConsentReady
        user={user}
        onReadyClick={handleReadyClick}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
      />
      {showSettings && (
        <Settings user={user} onClose={() => setShowSettings(false)} onLogout={handleLogout} />
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
};


