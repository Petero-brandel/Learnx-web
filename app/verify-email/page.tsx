'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

function VerifyEmailContent() {
 const searchParams = useSearchParams();
 const token = searchParams.get('token');
 const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
 const [message, setMessage] = useState('');

 useEffect(() => {
 if (!token) {
 setStatus('error');
 setMessage('Invalid or missing verification token.');
 return;
 }

 const verify = async () => {
 try {
 const response = await api.post('/auth/verify-email/', { token });
 setStatus('success');
 setMessage(response.data.message || 'Email verified successfully!');
 } catch (err: any) {
 setStatus('error');
 setMessage(err.response?.data?.error || 'Failed to verify email. The link may have expired.');
 }
 };

 verify();
 }, [token]);

 return (
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/70 bg-white/95 dark:bg-zinc-900/85 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10 text-center">
 {status === 'loading' && (
 <div className="py-8">
 <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-6" />
 <h2 className="text-2xl font-bold tracking-tight mb-3">Verifying Email...</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
 Please wait while we verify your account securely.
 </p>
 </div>
)}

 {status === 'success' && (
 <div className="py-4">
 <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
 <CheckCircle2 className="h-8 w-8" />
 </div>
 <h2 className="text-2xl font-bold tracking-tight mb-3">Email Verified!</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
 {message}
 </p>
 <Link
 href="/login"
 className="flex w-full justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
 >
 Log in to continue
 </Link>
 </div>
)}

 {status === 'error' && (
 <div className="py-4">
 <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
 <XCircle className="h-8 w-8" />
 </div>
 <h2 className="text-2xl font-bold tracking-tight mb-3">Verification Failed</h2>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
 {message}
 </p>
 <Link
 href="/"
 className="flex w-full justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800"
 >
 Return to home
 </Link>
 </div>
)}
 </div>
);
}

export default function VerifyEmailPage() {
 return (
 <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 relative flex items-center justify-center p-4 lg:p-8 font-sans text-zinc-950 dark:text-zinc-50 selection:bg-blue-500/30 overflow-hidden">
 <Suspense fallback={
 <div className="w-full max-w-[480px] relative z-10 rounded-[28px] border border-zinc-200/80 dark:border-zinc-700/60 bg-white/95 dark:bg-zinc-900 shadow-[0_30px_120px_rgba(0,0,0,0.24)] p-6 sm:p-10 text-center">
 <div className="py-8">
 <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
 </div>
 </div>
 }>
 <VerifyEmailContent />
 </Suspense>
 </div>
);
}
