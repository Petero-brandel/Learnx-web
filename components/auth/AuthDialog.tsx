'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

type Mode = 'modal' | 'page';
type Variant = 'login' | 'signup';

type FieldErrors = Partial<Record<'name' | 'email' | 'password', string>>;
type AuthDialogProps = {
  variant: Variant;
  mode: Mode;
};

function normalizeErrorMessage(value: unknown, fallback: string) {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  return fallback;
}

function extractFieldErrors(payload: any): FieldErrors {
  return {
    name: normalizeErrorMessage(payload?.full_name || payload?.name, ''),
    email: normalizeErrorMessage(payload?.email, ''),
    password: normalizeErrorMessage(payload?.password, ''),
  };
}

function extractMessage(payload: any, variant: Variant, fallback: string) {
  const common = payload?.detail || payload?.error || payload?.message || payload?.non_field_errors;
  if (common) return normalizeErrorMessage(common, fallback);

  if (variant === 'login') {
    return fallback;
  }

  const fieldErrors = extractFieldErrors(payload);
  return fieldErrors.email || fieldErrors.password || fieldErrors.name || fallback;
}

export function AuthDialog({ variant, mode }: { variant: Variant; mode: Mode }) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isSignup = variant === 'signup';
  const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  const closeTo = () => {
    if (mode === 'modal') {
      router.back();
      return;
    }

    router.push('/');
  };

  const clearErrors = () => {
    setError('');
    setFieldErrors({});
  };

  const runGoogleLogin = async (credential: string) => {
    setIsGoogleLoading(true);
    clearErrors();
    try {
      const response = await api.post('/auth/google/', { credential });
      await login(response.data.access, response.data.refresh, response.data.user);
    } catch (err: any) {
      setError(extractMessage(err.response?.data, variant, isSignup ? 'Google signup failed' : 'Google login failed'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setError('Google sign-in did not return a credential.');
      return;
    }

    await runGoogleLogin(credentialResponse.credential);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const nextFieldErrors: FieldErrors = {};
    if (isSignup && !name.trim()) nextFieldErrors.name = 'Full name is required.';
    if (!email.trim()) nextFieldErrors.email = 'Email is required.';
    if (!password.trim()) nextFieldErrors.password = 'Password is required.';

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('Please fix the highlighted fields.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        const response = await api.post('/auth/register/', {
          full_name: name,
          email,
          password,
        });
        await login(response.data.access, response.data.refresh, response.data.user);
      } else {
        const response = await api.post('/auth/login/', { email, password });
        await login(response.data.access, response.data.refresh, response.data.user);
      }
    } catch (err: any) {
      const payload = err.response?.data;
      setFieldErrors(extractFieldErrors(payload));
      setError(extractMessage(payload, variant, isSignup ? 'Registration failed' : 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  const title = isSignup ? 'Create your account' : 'Welcome back';
  const subtitle = isSignup ? 'Already have an account?' : 'Don\'t have an account?';
  const subtitleLink = isSignup ? '/login' : '/signup';
  const subtitleLinkLabel = isSignup ? 'Log in' : 'Sign up';
  const submitLabel = isSignup ? 'Create account with email' : 'Continue with email';
  const submitLoadingLabel = isSignup ? 'Creating account…' : 'Signing in…';

  const Card = (
    <div
      className="w-full max-w-[480px] rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 shadow-[0_30px_120px_rgba(0,0,0,0.24)] backdrop-blur-2xl p-6 sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-3 py-1 text-2xl font-bold tracking-tight hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          onClick={closeTo}
        >
          LearnX
        </Link>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {subtitle}{' '}
          <Link href={subtitleLink} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            {subtitleLinkLabel}
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-none" />
          <div className="space-y-1">
            <p className="font-medium">Something needs attention</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {hasGoogleClientId ? (
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError(isSignup ? 'Google signup failed' : 'Google login failed')}
            useOneTap={false}
            shape="rectangular"
            theme="outline"
            size="large"
            text={isSignup ? 'signup_with' : 'continue_with'}
            width={400}
            containerProps={{ className: 'w-full flex justify-center' }}
          />
        </div>
      ) : (
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
        >
          <Mail className="h-4 w-4" />
          Google sign-in is not configured
        </button>
      )}

      <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        {hasGoogleClientId ? 'Fast, passwordless access with Google.' : 'Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google login.'}
      </p>

      <div className="flex items-center gap-4 my-5">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {isSignup && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Adekunle"
              className={`w-full rounded-2xl border bg-white dark:bg-zinc-950 px-3.5 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}`}
            />
            {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete={isSignup ? 'email' : 'username'}
            className={`w-full rounded-2xl border bg-white dark:bg-zinc-950 px-3.5 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}`}
          />
          {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <label htmlFor="password" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            {!isSignup && (
              <Link href="/forgot-password" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? 'Create a password' : 'Enter your password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              className={`w-full rounded-2xl border bg-white dark:bg-zinc-950 px-3.5 py-3 pr-10 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>}
          {isSignup && <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">Use at least 8 characters for a stronger password.</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {isLoading ? submitLoadingLabel : submitLabel}
        </button>
      </form>
    </div>
  );

  if (mode === 'modal') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4 sm:p-6 lg:p-8" onClick={closeTo}>
        {Card}
      </div>
    );
  }

  return <div className="min-h-screen bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-zinc-950 dark:text-zinc-50">{Card}</div>;
}