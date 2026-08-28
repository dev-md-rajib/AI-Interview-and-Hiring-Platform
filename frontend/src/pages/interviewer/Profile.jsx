import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  HiLightBulb, HiClock, HiPlus, HiTrash, HiSave, HiUser, HiCheck, HiBriefcase, HiVideoCamera, HiCamera, HiUpload,
} from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SECTORS, TECH_STACKS as STACKS } from '../../constants/sectors';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function InterviewerProfile() {
  const { user, updateUser } = useAuth();
  const [expertise, setExpertise] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bio, setBio] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
  const [newAvatarPreview, setNewAvatarPreview] = useState('');
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const avatarInputRef = useRef(null);

  const populateFields = (profileUser) => {
    const profile = profileUser?.interviewerProfile;
    if (profile) {
      setExpertise(profile.expertise || []);
      setSectors(profile.sectors || []);
      setSlots(profile.availabilitySlots || []);
      setBio(profile.bio || '');
      setHostEmail(profile.hostEmail || '');
      setIsActive(profile.isActive !== false);
    }
  };

  useEffect(() => {
    // Populate from AuthContext first for instant display
    if (user?.interviewerProfile) {
      populateFields(user);
    }

    // Always fetch fresh data directly from MongoDB database
    api.get('/interviewer/profile')
      .then(({ data }) => {
        if (data.user) {
          updateUser(data.user);
          populateFields(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleExpertise = (stack) => {
    setExpertise((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  };

  const toggleSector = (sectorId) => {
    setSectors((prev) =>
      prev.includes(sectorId) ? prev.filter((s) => s !== sectorId) : [...prev, sectorId]
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

  const handleAvatarChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    setNewAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setNewAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (expertise.length === 0 && sectors.length === 0) return toast.error('Please select at least one area of expertise or sector');
    setSaving(true);
    try {
      if (newAvatarFile) {
        const formData = new FormData();
        formData.append('profileImage', newAvatarFile);
        const { data: userRes } = await api.put('/auth/update-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (userRes.user) {
          updateUser(userRes.user);
        }
      }

      const { data } = await api.put('/interviewer/profile', {
        expertise,
        sectors,
        availabilitySlots: slots,
        bio,
        hostEmail: hostEmail.trim(),
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HiLightBulb className="text-cyan-500 dark:text-cyan-400" /> My Profile & Availability
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Configure your expertise, Zoom host details, and weekly availability for interviews.</p>
      </div>

      {!user?.isVerified && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⏳</span>
          <div className="text-xs">
            <p className="text-amber-300 font-bold text-sm">Account Pending Admin Verification</p>
            <p className="text-amber-200/80 mt-1 leading-relaxed">
              Your interviewer profile is currently pending verification from the platform administration. You can configure your availability slots and expertise now; you will automatically be matched with candidate interviews once approved by an Admin.
            </p>
          </div>
        </div>
      )}

      {/* User Info & Profile Picture Card */}
      <div className="card flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-primary-700 border-2 border-primary-500/30 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shadow-md">
              {newAvatarPreview ? (
                <img src={newAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : user?.profileImage ? (
                <img src={user.profileImage} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || <HiUser className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
            >
              <HiCamera className="w-6 h-6" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">Interviewer Account</span>
              {user?.isVerified ? (
                <span className="badge bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-[10px] flex items-center gap-1 font-bold">
                  <HiCheck className="w-3 h-3" /> Verified by Admin
                </span>
              ) : (
                <span className="badge bg-amber-900/40 text-amber-300 border border-amber-500/30 text-[10px] flex items-center gap-1 font-bold">
                  ⏳ Pending Admin Verification
                </span>
              )}
            </div>
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleAvatarChange(e.target.files?.[0])}
        />

        <div className="flex items-center gap-2">
          {newAvatarPreview && (
            <button
              type="button"
              onClick={() => {
                setNewAvatarFile(null);
                setNewAvatarPreview('');
                if (avatarInputRef.current) avatarInputRef.current.value = '';
              }}
              className="btn-secondary text-xs text-danger-400 hover:text-danger-300"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="btn-secondary text-xs flex items-center gap-1"
          >
            <HiUpload className="w-3.5 h-3.5" />
            {newAvatarPreview || user?.profileImage ? 'Change Photo' : 'Upload Photo'}
          </button>
        </div>
      </div>

      {/* Status toggle */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-gray-900 dark:text-white font-bold text-base">Interviewer Status</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
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

      {/* Host Email */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <HiVideoCamera className="text-cyan-500 dark:text-cyan-400 w-5 h-5" />
          <h2 className="section-title">Zoom Interview Host Email</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Enter your Zoom account email address to be designated as the host when Zoom interview sessions are scheduled with you.
        </p>
        <div className="space-y-1.5">
          <input
            type="email"
            value={hostEmail}
            onChange={(e) => setHostEmail(e.target.value)}
            placeholder="e.g. your-email@zoom.us (Default: rajibmiah978@gmail.com)"
            className="input text-sm"
          />
          <p className="text-[11px] text-gray-500">
            If no email is provided, <span className="text-cyan-600 dark:text-cyan-400 font-mono font-medium">rajibmiah978@gmail.com</span> will be assigned as the meeting host by default.
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <HiUser className="text-primary-500 dark:text-primary-400" />
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
          <HiLightBulb className="text-cyan-500 dark:text-cyan-400" />
          <h2 className="section-title">Tech Stack Expertise</h2>
          <span className="text-xs text-gray-500">({expertise.length} selected)</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Select all technologies you're qualified to interview candidates on.</p>
        <div className="flex flex-wrap gap-2">
          {STACKS.map((stack) => {
            const selected = expertise.includes(stack);
            return (
              <button
                key={stack}
                onClick={() => toggleExpertise(stack)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-semibold shadow-sm'
                    : 'border-dark-border text-gray-600 dark:text-gray-400 bg-dark-card hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-white'
                }`}
              >
                {selected && <HiCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 stroke-2" />}
                {stack}
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Sectors multi-select */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HiBriefcase className="text-amber-500 dark:text-amber-400" />
          <h2 className="section-title">General & Professional Fields</h2>
          <span className="text-xs text-gray-500">({sectors.length} selected)</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Select fields & domains you can conduct interviews for.
          This allows you to be matched with candidates taking domain and professional field team interviews.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SECTORS.map((sector) => {
            const selected = sectors.includes(sector.id);
            const Icon = sector.Icon;
            return (
              <button
                key={sector.id}
                onClick={() => toggleSector(sector.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2.5 ${
                  selected
                    ? `${sector.border} ${sector.bg}`
                    : 'border-dark-border hover:border-gray-400 bg-dark-card'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? `${sector.bg} ${sector.color} border ${sector.border}` : 'bg-dark-card text-gray-400 border border-dark-border'}`}>
                  {Icon && <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold text-xs truncate ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{sector.label}</div>
                  {selected && <div className={`text-[10px] ${sector.color} font-bold`}>✓ Selected</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability slots */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HiClock className="text-primary-400" />
          <h2 className="section-title">Weekly Availability (Bangladesh Time)</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">Define your regular weekly time slots when you're available for interviews in Bangladesh Standard Time (BST, UTC+6).</p>

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
              <label className="label text-xs">Start Time (BST)</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="label text-xs">End Time (BST)</label>
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
                    <span className="text-cyan-400 text-xs font-medium">BST</span>
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
