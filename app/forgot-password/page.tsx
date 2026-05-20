'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
 const [email, setEmail] = useState('');
 const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
 const [errorMessage, setErrorMessage] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!email.trim()) return;

 setStatus('loading');
 setErrorMessage('');

 try {
 await api.post('/auth/password-reset/', { email });
 setStatus('success');
 } catch (err: any) {
 setStatus('error');
 setErrorMessage(err.response?.data?.error || err.response?.data?.email?.[0] || 'Failed to request password reset. Please try again.');
 }
 };

 return (
 <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative flex items-center justify-center p-4 lg:p-8 font-sans text-zinc-950 dark:text-zinc-50 selection:bg-blue-500/30 overflow-hidden">
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/60 bg-white/95 dark:bg-zinc-900 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10">
 
 {status === 'success' ? (
 <div className="text-center py-4">
 <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
 <Mail className="h-8 w-8" />
 </div>
 
 <h2 className="text-2xl font-bold tracking-tight mb-3">Check your inbox</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
 If <span className="font-medium text-zinc-900 dark:text-zinc-100">{email}</span> is registered, you will receive a password reset link shortly.
 </p>
 
 <Link 
 href="/login" 
 className="flex w-full justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
 >
 Return to login
 </Link>
 </div>
) : (
 <>
 <Link href="/login" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6 group">
 <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
 Back to login
 </Link>

 <h1 className="text-2xl font-bold tracking-tight mb-2">Reset your password</h1>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
 Enter your email address and we'll send you a link to securely reset your password.
 </p>

 {status === 'error' && (
 <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3 py-2.5 text-xs font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
 <AlertCircle className="h-4 w-4 flex-none" />
 <p>{errorMessage}</p>
 </div>
)}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
 Email address
 </label>
 <input
 id="email"
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="name@example.com"
 autoComplete="email"
 className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900 px-3.5 py-3 text-sm outline-none transition-all placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 />
 </div>

 <button
 type="submit"
 disabled={status === 'loading' || !email.trim()}
 className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
 >
 {status === 'loading' ? (
 <Loader2 className="h-4 w-4 animate-spin" />
) : (
 <CheckCircle2 className="h-4 w-4" />
)}
 Send reset link
 </button>
 </form>
 </>
)}
 </div>
 </div>
);
}
