import React from 'react';
import { Link } from 'react-router-dom';
import { HiUserGroup, HiArrowLeft, HiCalendar, HiChatAlt2, HiChip } from 'react-icons/hi';

const features = [
  {
    icon: HiChatAlt2,
    title: 'Panel Discussion',
    desc: 'Face a panel of interviewers for a comprehensive, multi-perspective evaluation.',
  },
  {
    icon: HiCalendar,
    title: 'Scheduled Sessions',
    desc: 'Book time slots that work for you and the interview team.',
  },
  {
    icon: HiChip,
    title: 'AI-Assisted Questions',
    desc: 'The interview team is provided AI-generated question sets tailored to your profile.',
  },
];

export default function InterviewTeamRoom() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to="/candidate/interview" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
        <HiArrowLeft /> Back to Interview Options
      </Link>

      <div className="card border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-900/10 to-dark-card text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-cyan-900/40 border-2 border-cyan-500/40 flex items-center justify-center mx-auto mb-4">
          <HiUserGroup className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Interview Team Mode</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 text-sm font-semibold mb-4">
          🔜 Coming Soon
        </div>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Interview Team mode will let a panel of interviewers conduct a real-time, live interview session with you — combining human judgment with AI assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="card text-center">
              <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-snug">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="card bg-gradient-to-r from-primary-900/30 to-dark-card flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-white font-semibold">Ready to interview now?</p>
          <p className="text-gray-400 text-sm mt-1">Try our AI Agent for an instant voice interview.</p>
        </div>
        <Link to="/candidate/interview" className="btn-primary px-6 py-2.5 flex items-center gap-2">
          <HiChip /> Start AI Interview
        </Link>
      </div>
    </div>
  );
}
