'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login/', { email, password });
      await login(response.data.access, response.data.refresh);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/google/', {
        credential: credentialResponse.credential,
      });
      await login(response.data.access, response.data.refresh, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-zinc-50 dark:bg-[#121212] relative flex items-center justify-center p-4 lg:p-8 font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30 overflow-hidden"
      onClick={() => router.push('/')}
    >
      
      {/* Blurred Ambient Home Page Background */}
      <div className="hidden lg:block absolute inset-0 z-0 scale-[0.98] blur-[8px] opacity-60 dark:opacity-70 pointer-events-none origin-top -mt-10">
        <Navbar />
        <Hero />
      </div>

      {/* Main Card */}
      <div 
        className="relative w-full max-w-[480px] bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl lg:border border-zinc-200 dark:border-zinc-800 lg:shadow-2xl lg:rounded-3xl p-6 sm:p-8 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block font-bold text-2xl tracking-tight">
            LearnX
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

// ... (in the render, replacing the original button)
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Google OAuth */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-zinc-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors !mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue with email'}
          </button>
        </form>

      </div>
    </div>
  );
}
