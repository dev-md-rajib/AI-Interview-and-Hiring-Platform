import toast from 'react-hot-toast';
import api from '../services/api';

// Cooldown tracker to prevent duplicate rapid triggers on a single paste action
let lastViolationTimestamp = 0;
const DEBOUNCE_COOLDOWN_MS = 2500;

/**
 * Intercepts paste attempts during an interview session, blocks the action,
 * alerts the candidate with a single prominent warning, and triggers exactly ONE violation capture
 * on the Interview Tracker desktop app.
 *
 * @param {ClipboardEvent|React.ClipboardEvent} e - The paste event
 * @param {string} interviewId - Active interview ID
 * @param {string} targetName - Name/context of the input where paste was attempted
 */
export const handlePasteViolation = async (e, interviewId, targetName = 'Candidate Answer Box') => {
  // Always prevent and stop propagation immediately
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  const now = Date.now();
  if (now - lastViolationTimestamp < DEBOUNCE_COOLDOWN_MS) {
    // Within cooldown: paste is blocked, skip duplicate toast & duplicate screenshot upload
    return;
  }
  lastViolationTimestamp = now;

  // Show a single toast using fixed ID to guarantee no duplicate stacked toasts
  toast.error('❌ Pasting is strictly prohibited during the interview! Violation captured.', {
    id: 'paste-violation-toast',
    duration: 4000,
    icon: '🚫',
  });

  const payload = {
    interviewId: interviewId || '',
    reason: 'Clipboard Paste Attempt - Pasting text into answer box',
    targetName: targetName || 'Candidate Answer Box',
    category: 'Closed Windows',
    captureSource: 'closed-windows',
  };

  // Call backend REST endpoint to instruct the candidate's tracker to snap 1 screenshot
  try {
    await api.post('/tracker/violation', payload);
  } catch (err) {
    console.warn('Failed to dispatch violation report:', err);
  }
};
