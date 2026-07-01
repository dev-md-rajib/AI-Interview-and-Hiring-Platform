import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  HiLightBulb, HiClock, HiPlus, HiTrash, HiSave, HiUser, HiCheck,
} from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TECH_STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#',
  'Kubernetes', 'GraphQL', 'Redis', 'Spring Boot', 'Django', 'FastAPI',
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function InterviewerProfile() {
  const { user, updateUser } = useAuth();
  const [expertise, setExpertise] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bio, setBio] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });

  useEffect(() => {
    const profile = user?.interviewerProfile;
    if (profile) {
      setExpertise(profile.expertise || []);
      setSlots(profile.availabilitySlots || []);
      setBio(profile.bio || '');
      setIsActive(profile.isActive !== false);
    }
  }, [user]);

  const toggleExpertise = (stack) => {
    setExpertise((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  };

  const addSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) {
      return toast.error('End time must be after start time');
    }
    const conflict = slots.find(
      (s) => s.dayOfWeek === newSlot.dayOfWeek &&
        !(newSlot.endTime <= s.startTime || newSlot.startTime >= s.endTime)
    );
    if (conflict) return toast.error('This time overlaps an existing slot');
    setSlots((prev) => [...prev, { ...newSlot }]);
  };

  const removeSlot = (idx) => {
    setSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (expertise.length === 0) return toast.error('Please select at least one area of expertise');
    setSaving(true);
    try {
      const { data } = await api.put('/interviewer/profile', {
        expertise,
        availabilitySlots: slots,
        bio,
        isActive,
      });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HiLightBulb className="text-cyan-400" /> My Profile & Availability
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Configure your expertise and weekly availability for interviews.</p>
      </div>

      {/* Status toggle */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Interviewer Status</p>
          <p className="text-gray-400 text-xs mt-1">
            {isActive ? 'You are currently active and eligible to receive interview assignments.' : 'You are marked as inactive and will not receive new assignments.'}
          </p>
        </div>
        <button
          onClick={() => setIsActive((v) => !v)}
          className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-dark-border'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-6' : ''}`} />
        </button>
      </div>

      {/* Bio */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <HiUser className="text-primary-400" />
          <h2 className="section-title">About Me</h2>
        </div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Brief intro about your experience, background, and interviewing style..."
          className="input h-24 resize-none text-sm"
        />
      </div>

      {/* Expertise multi-select */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HiLightBulb className="text-cyan-400" />
          <h2 className="section-title">Areas of Expertise</h2>
          <span className="text-xs text-gray-500">({expertise.length} selected)</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">Select all technologies you're qualified to interview candidates on.</p>
        <div className="flex flex-wrap gap-2">
          {TECH_STACKS.map((stack) => {
            const selected = expertise.includes(stack);
            return (
              <button
                key={stack}
                onClick={() => toggleExpertise(stack)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300'
                    : 'border-dark-border text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {selected && <HiCheck className="w-3 h-3" />}
                {stack}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability slots */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HiClock className="text-primary-400" />
          <h2 className="section-title">Weekly Availability</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">Define your regular weekly time slots when you're available for interviews (UTC time).</p>

        {/* Add new slot */}
        <div className="bg-dark-800 rounded-xl border border-dark-border p-4 mb-4">
          <p className="text-xs font-semibold text-gray-300 mb-3">Add Time Slot</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label text-xs">Day</label>
              <select
                value={newSlot.dayOfWeek}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                className="input text-sm"
              >
                {DAY_NAMES.map((day, idx) => (
                  <option key={day} value={idx}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label text-xs">Start Time (UTC)</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="label text-xs">End Time (UTC)</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))}
                className="input text-sm"
              />
            </div>
          </div>
          <button
            onClick={addSlot}
            className="mt-3 flex items-center gap-2 text-sm px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <HiPlus className="w-4 h-4" /> Add Slot
          </button>
        </div>

        {/* Existing slots */}
        {slots.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">No availability slots added yet.</p>
        ) : (
          <div className="space-y-2">
            {slots
              .slice()
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
              .map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-4 py-2.5 bg-dark-800 rounded-lg border border-dark-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-xs font-semibold text-cyan-300">{DAY_NAMES[slot.dayOfWeek]}</span>
                    <span className="text-white text-sm font-mono">{slot.startTime} – {slot.endTime}</span>
                    <span className="text-gray-500 text-xs">UTC</span>
                  </div>
                  <button
                    onClick={() => removeSlot(idx)}
                    className="text-gray-600 hover:text-red-400 p-1 rounded transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-primary-600 hover:from-cyan-700 hover:to-primary-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <HiSave className="w-5 h-5" /> Save Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
}
