'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, EyeOff, Eye, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

function ResetPasswordContent() {
 const searchParams = useSearchParams();
 const uid = searchParams.get('uid');
 const token = searchParams.get('token');

 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 
 const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
 const [errorMessage, setErrorMessage] = useState('');
 const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setFieldErrors({});
 setErrorMessage('');
 
 if (!uid || !token) {
 setErrorMessage('Invalid or missing reset token.');
 return;
 }

 if (password !== confirmPassword) {
 setFieldErrors({ confirm: 'Passwords do not match.' });
 return;
 }

 if (passwordScore < 2) {
 setFieldErrors({ password: 'Password is too weak.' });
 return;
 }

 setStatus('loading');

 try {
 await api.post('/auth/password-reset/confirm/', { 
 uidb64: uid, 
 token, 
 new_password: password 
 });
 setStatus('success');
 } catch (err: any) {
 setStatus('error');
 setErrorMessage(err.response?.data?.error || err.response?.data?.new_password?.[0] || 'Failed to reset password. The link may have expired.');
 }
 };

 if (!uid || !token) {
 return (
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/70 bg-white/95 dark:bg-zinc-900/85 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10 text-center">
 <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
 <AlertCircle className="h-8 w-8" />
 </div>
 <h2 className="text-2xl font-bold tracking-tight mb-3">Invalid Link</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
 This password reset link is invalid or missing required parameters.
 </p>
 <Link href="/forgot-password" className="flex w-full justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
 Request new link
 </Link>
 </div>
);
 }

 if (status === 'success') {
 return (
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/70 bg-white/95 dark:bg-zinc-900/85 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10 text-center">
 <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
 <ShieldCheck className="h-8 w-8" />
 </div>
 <h2 className="text-2xl font-bold tracking-tight mb-3">Password updated</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
 Your password has been successfully reset. You can now use your new password to log in.
 </p>
 <Link href="/login" className="flex w-full justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
 Log in
 </Link>
 </div>
);
 }

 return (
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/70 bg-white/95 dark:bg-zinc-900/85 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10">
 <h1 className="text-2xl font-bold tracking-tight mb-2">Create new password</h1>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
 Please enter and confirm your new password below.
 </p>

 {status === 'error' && (
 <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3 py-2.5 text-xs font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
 <AlertCircle className="h-5 w-5 flex-none" />
 <p>{errorMessage}</p>
 </div>
)}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label htmlFor="auth-password" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
 New Password
 </label>
 <div className="relative">
 <input
 id="auth-password"
 type={showPassword ? 'text' : 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Create a strong password"
 className={`w-full rounded-2xl border bg-white dark:bg-zinc-900 px-3.5 py-3 pr-10 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
 />
 <button
 type="button"
 onClick={() => setShowPassword((v) => !v)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
 >
 {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
 </button>
 </div>
 {fieldErrors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fieldErrors.password}</p>}
 
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
 return <div key={level} className={`flex-1 rounded-full transition-all duration-300 ${colorClass}`} />;
 })}
 </div>
 <div className="flex justify-between items-center text-[11px]">
 <p className="text-zinc-500 dark:text-zinc-400">Use 8+ chars with mix of letters, numbers & symbols.</p>
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
 </div>

 <div>
 <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
 Confirm Password
 </label>
 <input
 id="confirm-password"
 type={showPassword ? 'text' : 'password'}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder="Repeat new password"
 className={`w-full rounded-2xl border bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 ${fieldErrors.confirm ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-700/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`}
 />
 {fieldErrors.confirm && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fieldErrors.confirm}</p>}
 </div>

 <button
 type="submit"
 disabled={status === 'loading' || !password || !confirmPassword}
 className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
 >
 {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
 Reset Password
 </button>
 </form>
 </div>
);
}

export default function ResetPasswordPage() {
 return (
 <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative flex items-center justify-center p-4 lg:p-8 font-sans text-zinc-950 dark:text-zinc-50 selection:bg-blue-500/30 overflow-hidden">
 <Suspense fallback={
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/60 bg-white/95 dark:bg-zinc-900 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10 text-center">
 <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
 </div>
 }>
 <ResetPasswordContent />
 </Suspense>
 </div>
);
}
