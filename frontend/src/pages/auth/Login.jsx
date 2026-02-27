import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { HiAcademicCap, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      const redirectMap = { ADMIN: '/admin', RECRUITER: '/recruiter', CANDIDATE: '/candidate' };
      navigate(redirectMap[data.user.role] || '/candidate');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-card to-dark-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-transparent" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30">
            <HiAcademicCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">AI Interview Platform</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The intelligent hiring platform connecting exceptional candidates with world-class companies through AI-powered interviews.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[['500+', 'Companies'], ['10K+', 'Candidates'], ['95%', 'Match Rate']].map(([val, lbl]) => (
              <div key={lbl} className="bg-dark-800/50 rounded-xl p-4 border border-dark-border">
                <div className="text-2xl font-bold text-gradient">{val}</div>
                <div className="text-xs text-gray-400 mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiAcademicCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">AI<span className="text-gradient">Hire</span></span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
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
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
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

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Create one
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-dark-800 rounded-lg border border-dark-border">
            <p className="text-xs text-gray-400 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Admin: <span className="text-gray-300">admin@aiplatform.com / Admin@12345</span></p>
              <p>Or register a new Candidate / Recruiter account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
