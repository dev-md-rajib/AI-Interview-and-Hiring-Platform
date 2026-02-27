import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-8xl font-black text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2"><HiHome />Go Home</Link>
      </div>
    </div>
  );
}
