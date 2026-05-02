import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mb-6">Welcome to LearnX. These terms and conditions outline the rules and regulations for the use of LearnX's Website and Platform.</p>
          
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">By accessing this website we assume you accept these terms and conditions. Do not continue to use LearnX if you do not agree to take all of the terms and conditions stated on this page.</p>
          
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">2. License to Use</h2>
          <p className="mb-6">Unless otherwise stated, LearnX and/or its licensors own the intellectual property rights for all material on LearnX. All intellectual property rights are reserved. You may access this from LearnX for your own personal use subjected to restrictions set in these terms and conditions.</p>
          <ul className="list-disc pl-6 mb-6">
            <li>You must not republish material from LearnX.</li>
            <li>You must not sell, rent or sub-license material from LearnX.</li>
            <li>You must not reproduce, duplicate or copy material from LearnX.</li>
            <li>You must not redistribute content from LearnX.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-6">When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
