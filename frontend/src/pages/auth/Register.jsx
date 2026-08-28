import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  HiEye,
  HiEyeOff,
  HiUser,
  HiBriefcase,
  HiLightBulb,
  HiCamera,
  HiTrash,
  HiUpload,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import api from '../../services/api';

const roles = [
  { value: 'CANDIDATE', label: 'Candidate', icon: HiUser, desc: 'Looking for opportunities' },
  { value: 'RECRUITER', label: 'Recruiter', icon: HiBriefcase, desc: 'Hiring top talent' },
  { value: 'INTERVIEWER', label: 'Interviewer', icon: HiLightBulb, desc: 'Conduct tech interviews' },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('CANDIDATE');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const handleImageChange = (file) => {
    setImageError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (formData) => {
    // Validate mandatory profile image for Candidate
    if (selectedRole === 'CANDIDATE' && !imageFile) {
      setImageError('Profile image is required for Candidate registration');
      toast.error('Please upload a profile photo to verify your identity as a Candidate.');
      return;
    }

    setLoading(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append('name', formData.name);
      dataPayload.append('email', formData.email);
      dataPayload.append('password', formData.password);
      dataPayload.append('role', selectedRole);
      if (imageFile) {
        dataPayload.append('profileImage', imageFile);
      }

      const { data } = await api.post('/auth/register', dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      login(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      const redirectMap = { RECRUITER: '/recruiter', INTERVIEWER: '/interviewer' };
      navigate(redirectMap[selectedRole] || '/candidate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative">
      {/* Theme switcher */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/30 p-2">
            <img src="/images/logo.png" alt="AIH Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account on A<span className="text-cyan-600 dark:text-cyan-400">I</span><span className="text-accent-500 dark:text-accent-400">H</span></h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join the AI-powered hiring platform</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {roles.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSelectedRole(value);
                setImageError('');
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-gray-900 dark:text-white shadow-sm'
                  : 'border-dark-border bg-dark-card text-gray-700 dark:text-gray-400 hover:border-primary-500/50'
              }`}
            >
              <Icon className={`w-6 h-6 ${selectedRole === value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className="font-bold text-sm">{label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{desc}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Photo Upload Section */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-200 flex items-center gap-1.5">
                <span>Profile Photo</span>
                {selectedRole === 'CANDIDATE' ? (
                  <span className="text-xs font-bold text-danger-500 bg-danger-500/10 px-2 py-0.5 rounded-full">
                    * Required for Candidate
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-500 bg-gray-500/10 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                )}
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-xs text-danger-400 hover:text-danger-300 flex items-center gap-1 transition-colors"
                >
                  <HiTrash className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-4 flex items-center gap-4 transition-all duration-200 ${
                isDragging
                  ? 'border-primary-500 bg-primary-500/10'
                  : imageError
                  ? 'border-danger-500/60 bg-danger-500/5'
                  : imagePreview
                  ? 'border-primary-500/50 bg-primary-500/5'
                  : 'border-dark-border hover:border-primary-500/40 bg-dark-800/40 hover:bg-dark-800/70'
              }`}
            >
              <div className="relative group flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-800 border-2 border-primary-500/40 flex items-center justify-center shadow-md">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <HiUser className="w-8 h-8 text-gray-500 group-hover:text-primary-400 transition-colors" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <HiCamera className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                  {imageFile ? imageFile.name : 'Choose a profile photo or drag & drop'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>

              <button
                type="button"
                className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 pointer-events-none"
              >
                <HiUpload className="w-3.5 h-3.5" />
                {imagePreview ? 'Change' : 'Browse'}
              </button>
            </div>

            {imageError && (
              <p className="mt-2 text-xs text-danger-400 font-medium animate-fade-in flex items-center gap-1">
                <span>⚠️</span> {imageError}
              </p>
            )}
          </div>

          <div>
            <label className="label">Full Name</label>
            <input
              id="name"
              className="input"
              placeholder="John Doe"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
            />
            {errors.name && <p className="mt-1 text-xs text-danger-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
            />
            {errors.email && <p className="mt-1 text-xs text-danger-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input pr-12"
                placeholder="Min 6 characters"
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-danger-400">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              placeholder="Repeat password"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-danger-400">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : `Create ${selectedRole === 'RECRUITER' ? 'Recruiter' : selectedRole === 'INTERVIEWER' ? 'Interviewer' : 'Candidate'} Account`}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

