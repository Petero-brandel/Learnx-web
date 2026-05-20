'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Eye, EyeOff, Loader2, AlertCircle, Mail, X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';

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

function AuthDialogContent({ variant, mode }: AuthDialogProps) {
 const router = useRouter();
 const searchParams = useSearchParams();
 const { login } = useAuth();
 const { resolvedTheme } = useTheme();
 const [showPassword, setShowPassword] = useState(false);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
 const [isLoading, setIsLoading] = useState(false);
 const [isGoogleLoading, setIsGoogleLoading] = useState(false);

 const [isVerificationSent, setIsVerificationSent] = useState(false);

 const isSignup = variant === 'signup';
 const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

 const passwordScore = (() => {
 if (!password) return 0;
 let score = 0;
 if (password.length >= 8) score += 1;
 if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
 if (/\d/.test(password)) score += 1;
 if (/[^a-zA-Z0-9]/.test(password)) score += 1;
 return score;
 })();

 const passwordStrengthLabel = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore];

 // Prevent body scroll when in modal mode
 useEffect(() => {
 if (mode === 'modal') {
 document.body.style.overflow = 'hidden';
 return () => {
 document.body.style.overflow = 'unset';
 };
 }
 }, [mode]);

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

 const loginWithGoogle = useGoogleLogin({
 onSuccess: async (tokenResponse) => {
 setIsGoogleLoading(true);
 clearErrors();
 try {
 const response = await api.post('/auth/google/', { access_token: tokenResponse.access_token });
 const loggedInUser = await login(response.data.access, response.data.refresh, response.data.user);
 if (loggedInUser) {
 const checkoutId = searchParams.get('checkout');
 if (checkoutId) {
 try {
 const checkoutRes = await api.post('/payments/checkout/', { course_id: parseInt(checkoutId) });
 if (checkoutRes.data?.authorization_url) {
 window.location.href = checkoutRes.data.authorization_url;
 return;
 }
 } catch (err: any) {
 if (err.response?.data?.code === 'already_enrolled') {
 window.location.replace('/dashboard');
 return;
 }
 console.error('Checkout redirect failed', err);
 }
 }
 const dest = loggedInUser.is_staff || loggedInUser.is_superuser ? '/admin/dashboard' : '/dashboard';
 window.location.replace(dest);
 }
 } catch (err: any) {
 setError(extractMessage(err.response?.data, variant, isSignup ? 'Google signup failed' : 'Google login failed'));
 } finally {
 setIsGoogleLoading(false);
 }
 },
 onError: () => setError(isSignup ? 'Google signup failed' : 'Google login failed'),
 });

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 clearErrors();

 const nextFieldErrors: FieldErrors = {};
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
 await api.post('/auth/register/', {
 email,
 password,
 });
 setIsVerificationSent(true);
 } else {
 const response = await api.post('/auth/login/', { email, password });
 const loggedInUser = await login(response.data.access, response.data.refresh, response.data.user);
 if (loggedInUser) {
 const checkoutId = searchParams.get('checkout');
 if (checkoutId) {
 try {
 const checkoutRes = await api.post('/payments/checkout/', { course_id: parseInt(checkoutId) });
 if (checkoutRes.data?.authorization_url) {
 window.location.href = checkoutRes.data.authorization_url;
 return;
 }
 } catch (err: any) {
 if (err.response?.data?.code === 'already_enrolled') {
 window.location.replace('/dashboard');
 return;
 }
 console.error('Checkout redirect failed', err);
 }
 }
 const dest = loggedInUser.is_staff || loggedInUser.is_superuser ? '/admin/dashboard' : '/dashboard';
 window.location.replace(dest);
 }
 }
 } catch (err: any) {
 if (!err.response) {
 setError('Network error: Cannot connect to server.');
 } else {
 const payload = err.response.data;
 setFieldErrors(extractFieldErrors(payload));
 
 // Handle specific email unverified error
 if (payload.code === 'email_unverified' || payload.detail?.includes('verify your email')) {
 setError('Please verify your email address before logging in.');
 } else {
 setError(extractMessage(payload, variant, isSignup ? 'Registration failed' : 'Invalid email or password'));
 }
 }
 } finally {
 setIsLoading(false);
 }
 };

 const title = isSignup ? 'Create your account' : 'Welcome back';
 const subtitle = isSignup ? 'Already have an account?' : 'Don\'t have an account?';
 const subtitleLink = isSignup ? '/login' : '/signup';
 const subtitleLinkLabel = isSignup ? 'Log in' : 'Sign up';
 const submitLabel = isSignup ? 'Create account with email' : 'Continue with email';
 const submitLoadingLabel = isSignup ? 'Creating account...' : 'Signing in...';

 let CardContent;
 if (isVerificationSent) {
 CardContent = (
 <div
 className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/60 bg-white/95 dark:bg-zinc-900 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10 text-center"
 onClick={(e) => e.stopPropagation()}
 >
 <button
 type="button"
 onClick={closeTo}
 className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
 aria-label="Close"
 >
 <X className="h-5 w-5" />
 </button>

 <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
 <Mail className="h-8 w-8" />
 </div>
 
 <h2 className="text-2xl font-bold tracking-tight mb-3">Check your inbox</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
 We've sent a verification link to <span className="font-medium text-zinc-900 dark:text-zinc-100">{email}</span>. Please click the link to verify your account.
 </p>
 
 <button 
 onClick={closeTo} 
 className="w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
 >
 Return to home
 </button>
 </div>
);
 } else {
 CardContent = (
 <div
 className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/60 bg-white/95 dark:bg-zinc-900 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-8"
 onClick={(e) => e.stopPropagation()}
 >
 <button
 type="button"
 onClick={closeTo}
 className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
 aria-label="Close"
 >
 <X className="h-5 w-5" />
 </button>

 <div className="text-center mb-6 pt-2">
 <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
 <p className="text-sm text-zinc-500 dark:text-zinc-400">
 {subtitle}{' '}
 <Link
 href={subtitleLink}
 replace={mode === 'modal'}
 className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
 >
 {subtitleLinkLabel}
 </Link>
 </p>
 </div>

 {error && (
 <div className="mb-4 flex items-center gap-3 p-3 rounded-xl text-sm border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/70 shadow-sm text-zinc-900 dark:text-zinc-100">
 <div className="h-7 w-7 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
 <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
 </div>
 <p className="flex-1 font-medium text-xs">{error}</p>
 </div>
 )}

 {hasGoogleClientId ? (
 <button
 type="button"
 onClick={() => loginWithGoogle()}
 disabled={isGoogleLoading || isLoading}
 className="w-full flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-transparent px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
 >
 {isGoogleLoading ? (
 <Loader2 className="h-5 w-5 animate-spin" />
) : (
 <svg className="h-5 w-5" viewBox="0 0 24 24">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
 </svg>
)}
 {isSignup ? 'Sign up with Google' : 'Continue with Google'}
 </button>
) : (
 <button
 type="button"
 disabled
 className="w-full flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
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
 <div>
 <label htmlFor="auth-email" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
 Email address
 </label>
 <input
 id="auth-email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="name@example.com"
 autoComplete={isSignup ? 'email' : 'username'}
 className={`w-full rounded-2xl border bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
 />
 {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
 </div>

 <div>
 <div className="mb-1.5 flex items-center justify-between gap-4">
 <label htmlFor="auth-password" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
 Password
 </label>
 {!isSignup && (
 <a href="/forgot-password" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
 Forgot?
 </a>
)}
 </div>
 <div className="relative">
 <input
 id="auth-password"
 type={showPassword ? 'text' : 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder={isSignup ? 'Create a password' : 'Enter your password'}
 autoComplete={isSignup ? 'new-password' : 'current-password'}
 className={`w-full rounded-2xl border bg-white dark:bg-zinc-900 px-3.5 py-3 pr-10 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
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
 {isSignup && (
 <div className="mt-2.5 space-y-2">
 <div className="flex gap-1 h-1.5 w-full">
 {[1, 2, 3, 4].map((level) => {
 let colorClass = 'bg-zinc-200 dark:bg-zinc-800';
 if (password.length > 0) {
 if (passwordScore <= 1 && level === 1) colorClass = 'bg-red-500';
 else if (passwordScore === 2 && level <= 2) colorClass = 'bg-orange-500';
 else if (passwordScore === 3 && level <= 3) colorClass = 'bg-yellow-500';
 else if (passwordScore >= 4 && level <= 4) colorClass = 'bg-emerald-500';
 }
 
 return (
 <div 
 key={level} 
 className={`flex-1 rounded-full transition-all duration-300 ${colorClass}`}
 />
);
 })}
 </div>
 <div className="flex justify-between items-center text-[11px]">
 <p className="text-zinc-500 dark:text-zinc-400">
 Use 8+ chars with mix of letters, numbers & symbols.
 </p>
 {password.length > 0 && (
 <span className={`font-medium ${
 passwordScore <= 1 ? 'text-red-600 dark:text-red-400' :
 passwordScore === 2 ? 'text-orange-600 dark:text-orange-400' :
 passwordScore === 3 ? 'text-yellow-600 dark:text-yellow-400' :
 'text-emerald-600 dark:text-emerald-400'
 }`}>
 {passwordStrengthLabel}
 </span>
)}
 </div>
 </div>
)}
 </div>

 <button
 type="submit"
 disabled={isLoading || isGoogleLoading}
 className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
 >
 {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
 {isLoading ? submitLoadingLabel : submitLabel}
 </button>
 </form>
 </div>
);
 }

 // Modal mode: overlay on top of the current page
 if (mode === 'modal') {
 return (
 <div
 className="dark fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/55 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
 onClick={closeTo}
 >
 {CardContent}
 </div>
);
 }

 // Page mode: full page with blurred home page background
 return (
 <div
 className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative flex items-center justify-center p-4 lg:p-8 font-sans text-zinc-950 dark:text-zinc-50 selection:bg-blue-500/30 overflow-hidden"
 onClick={closeTo}
 >
 {/* Blurred Ambient Home Page Background */}
 <div className="hidden lg:block absolute inset-0 z-0 scale-[0.98] blur-[8px] opacity-60 dark:opacity-70 pointer-events-none origin-top -mt-10">
 <Navbar />
 <Hero />
 </div>

 {/* Card */}
 <div className="relative z-10 w-full flex justify-center">
 {CardContent}
 </div>
 </div>
);
}

export function AuthDialog(props: AuthDialogProps) {
 return (
 <Suspense fallback={<div className="flex items-center justify-center p-8 h-full"><Loader2 className="h-8 w-8 animate-spin text-zinc-500" /></div>}>
 <AuthDialogContent {...props} />
 </Suspense>
);
}
