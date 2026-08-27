import React from 'react';
import { HiSearch, HiFilter, HiX, HiSortAscending } from 'react-icons/hi';

export default function InterviewHistoryFilter({
  search,
  onSearchChange,
  evaluator,
  onEvaluatorChange,
  level,
  onLevelChange,
  result,
  onResultChange,
  sortBy,
  onSortByChange,
  onReset,
  totalCount,
  filteredCount,
}) {
  const isFiltered = search || evaluator !== 'all' || level !== 'all' || result !== 'all' || sortBy !== 'newest';

  return (
    <div className="bg-dark-800/60 border border-dark-border rounded-xl p-3.5 mb-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by stack or domain (e.g. React, Node, Marketing)..."
            className="input pl-9 text-xs h-9 py-1 bg-dark-900/80 w-full"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <HiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Count & Reset */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Showing <b className="text-gray-900 dark:text-white font-bold">{filteredCount}</b> of {totalCount}
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 hover:underline ml-1"
            >
              <HiX className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-dark-border/40">
        {/* Evaluator Mode */}
        <div>
          <label className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1 block">
            Evaluator Mode
          </label>
          <select
            value={evaluator}
            onChange={(e) => onEvaluatorChange(e.target.value)}
            className="input text-xs h-8 py-0.5 bg-dark-900"
          >
            <option value="all">All Modes</option>
            <option value="AI Agent">🤖 AI Agent</option>
            <option value="Human Team">👤 Human Team (Zoom)</option>
            <option value="Standard">📝 Standard / Normal Query</option>
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1 block">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
            className="input text-xs h-8 py-0.5 bg-dark-900"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1 (Junior)</option>
            <option value="2">Level 2 (Mid-Level)</option>
            <option value="3">Level 3 (Senior)</option>
          </select>
        </div>

        {/* Result Status */}
        <div>
          <label className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1 block">
            Verdict / Result
          </label>
          <select
            value={result}
            onChange={(e) => onResultChange(e.target.value)}
            className="input text-xs h-8 py-0.5 bg-dark-900"
          >
            <option value="all">All Results</option>
            <option value="passed">✅ Passed Only</option>
            <option value="failed">❌ Failed Only</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-1 block">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="input text-xs h-8 py-0.5 bg-dark-900"
          >
            <option value="newest">📅 Newest Date First</option>
            <option value="oldest">📅 Oldest Date First</option>
            <option value="highest_score">🏆 Highest Score First</option>
            <option value="lowest_score">📉 Lowest Score First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
