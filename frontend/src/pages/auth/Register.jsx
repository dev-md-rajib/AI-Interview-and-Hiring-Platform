import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { HiAcademicCap, HiEye, HiEyeOff, HiUser, HiBriefcase } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const roles = [
  { value: 'CANDIDATE', label: 'Candidate', icon: HiUser, desc: 'Looking for opportunities' },
  { value: 'RECRUITER', label: 'Recruiter', icon: HiBriefcase, desc: 'Hiring top talent' },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('CANDIDATE');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...formData, role: selectedRole });
      login(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate(selectedRole === 'RECRUITER' ? '/recruiter' : '/candidate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/30">
            <HiAcademicCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2">Join the AI-powered hiring platform</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {roles.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedRole(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${selectedRole === value ? 'border-primary-500 bg-primary-900/30 text-white' : 'border-dark-border bg-dark-card text-gray-400 hover:border-primary-700'}`}
            >
              <Icon className={`w-6 h-6 ${selectedRole === value ? 'text-primary-400' : ''}`} />
              <span className="font-semibold text-sm">{label}</span>
              <span className="text-xs text-gray-500">{desc}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            ) : `Create ${selectedRole === 'RECRUITER' ? 'Recruiter' : 'Candidate'} Account`}
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
