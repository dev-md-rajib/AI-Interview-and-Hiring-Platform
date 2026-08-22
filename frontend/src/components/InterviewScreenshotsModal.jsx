import React, { useState, useEffect } from 'react';
import {
  HiX,
  HiPhotograph,
  HiShieldExclamation,
  HiClock,
  HiExternalLink,
  HiDownload,
  HiChevronRight,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return cleanPath;
};

export default function InterviewScreenshotsModal({ interview, onClose }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('normal'); // 'normal' | 'closedWindows'
  const [data, setData] = useState({
    normal: [],
    closedWindows: [],
    totalCount: 0,
    normalCount: 0,
    closedWindowsCount: 0,
  });
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    if (!interview) return;

    const interviewId = interview._id || interview.interviewId || '';
    const candidateId = interview.candidate?._id || interview.candidate || '';

    api
      .get(`/tracker/screenshots/${interviewId}?candidateId=${candidateId}`)
      .then(({ data: resData }) => {
        setData({
          normal: resData.screenshots?.normal || [],
          closedWindows: resData.screenshots?.closedWindows || [],
          totalCount: resData.totalCount || 0,
          normalCount: resData.normalCount || 0,
          closedWindowsCount: resData.closedWindowsCount || 0,
        });
      })
      .catch(() => {
        toast.error('Failed to load proctoring screenshots');
      })
      .finally(() => setLoading(false));
  }, [interview]);

  if (!interview) return null;

  const currentItems = activeTab === 'normal' ? data.normal : data.closedWindows;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-dark-border flex items-center justify-between bg-dark-900/60 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📸</span>
              <h2 className="text-lg font-bold text-white">
                Proctoring Screenshots & History
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-900/40 text-primary-300 border border-primary-500/30">
                {interview.stack} · Level {interview.level}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Evaluator: <span className="text-gray-200 font-medium">{interview.evaluator || 'Standard'}</span> · Score: <strong className="text-primary-400">{interview.totalScore ?? '—'}%</strong> · Date: {interview.completedAt ? new Date(interview.completedAt).toLocaleDateString() : '—'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-dark-border bg-dark-850 flex-shrink-0">
          <button
            onClick={() => setActiveTab('normal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'normal'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-border'
            }`}
          >
            <HiPhotograph className="w-4 h-4" />
            <span>Normal & Random Captures</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30">
              {data.normalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('closedWindows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'closedWindows'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-border'
            }`}
          >
            <HiShieldExclamation className="w-4 h-4" />
            <span>Closed Windows & Violations</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-bold">
              {data.closedWindowsCount}
            </span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Loading proctoring evidence...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <HiOutlineInformationCircle className="w-12 h-12 text-gray-600 mb-2" />
              <p className="text-gray-400 font-medium text-sm">
                No {activeTab === 'normal' ? 'routine interval' : 'closed window violation'} screenshots recorded.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {activeTab === 'closedWindows'
                  ? 'No unauthorized apps or browser tabs were detected during this interview.'
                  : 'Screenshots will appear here when captured during desktop tracker sessions.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentItems.map((item, idx) => {
                const isViolation = item.category === 'closed_windows';
                const isPasteViolation = Boolean(
                  item.reason?.toLowerCase().includes('paste') ||
                  item.reason?.toLowerCase().includes('clipboard') ||
                  item.targetName?.toLowerCase().includes('paste')
                );
                const date = new Date(item.capturedAt);

                return (
                  <div
                    key={item._id || idx}
                    onClick={() => setLightboxImg(item)}
                    className={`group cursor-pointer rounded-xl border overflow-hidden hover:shadow-xl transition-all flex flex-col ${
                      isPasteViolation
                        ? 'border-amber-500/40 bg-dark-800/95 hover:border-amber-500/70'
                        : isViolation
                        ? 'border-rose-500/30 bg-dark-800/80 hover:border-rose-500/60'
                        : 'border-dark-border bg-dark-800/80 hover:border-primary-500/50'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={`Capture ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="text-[11px] text-white font-semibold flex items-center gap-1">
                          <HiExternalLink className="w-3.5 h-3.5" /> Click to expand
                        </span>
                      </div>

                      {/* Source tag */}
                      <span
                        className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-md ${
                          isPasteViolation
                            ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                            : isViolation
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : 'bg-dark-900/80 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {isPasteViolation
                          ? '🚫 Paste Violation'
                          : isViolation
                          ? '⚠️ Closed Window'
                          : item.captureSource || 'Interval'}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-3 flex-1 flex flex-col justify-between text-xs space-y-1">
                      <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                        <HiClock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{date.toLocaleTimeString()} · {date.toLocaleDateString()}</span>
                      </div>

                      {item.targetName && (
                        <p className="text-gray-300 font-mono text-[11px] truncate" title={item.targetName}>
                          Target: <strong className={isPasteViolation ? 'text-amber-300' : 'text-white'}>{item.targetName}</strong>
                        </p>
                      )}

                      {item.reason && (
                        <p className={`text-[11px] font-medium truncate ${isPasteViolation ? 'text-amber-400 font-semibold' : 'text-rose-400'}`}>
                          Reason: {item.reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox zoom modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
            <a
              href={getImageUrl(lightboxImg.imageUrl)}
              download="screenshot.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-dark-800 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-dark-border"
            >
              <HiDownload className="w-4 h-4" /> Download
            </a>
            <button
              onClick={() => setLightboxImg(null)}
              className="p-2 rounded-lg bg-dark-800 text-gray-400 hover:text-white border border-dark-border"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <div
            className="max-w-6xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(lightboxImg.imageUrl)}
              alt="Screenshot full size"
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-dark-border shadow-2xl"
            />
            <div className="mt-3 text-center text-xs text-gray-300 bg-dark-900/80 px-4 py-2 rounded-xl border border-dark-border">
              <span className="font-semibold text-white">
                {lightboxImg.reason?.toLowerCase().includes('paste')
                  ? '🚫 Paste Violation Capture'
                  : lightboxImg.category === 'closed_windows'
                  ? '⚠️ Closed Window Capture'
                  : 'Routine Capture'}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <span>{new Date(lightboxImg.capturedAt).toLocaleString()}</span>
              {lightboxImg.targetName && (
                <>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="font-mono text-amber-300">{lightboxImg.targetName}</span>
                </>
              )}
              {lightboxImg.reason && (
                <>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-rose-400">{lightboxImg.reason}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
