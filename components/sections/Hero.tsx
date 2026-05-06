import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <section className="relative pt-28 pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Premium gradient overlay for light mode */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-[#0a0a0a] dark:via-[#111111] dark:to-[#0a0a0a]" />
      
      {/* Subtle accent lights for visual interest */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 -z-10 animate-pulse" />
      <div className="absolute -bottom-40 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 -z-10 animate-pulse" />

      {/* Headline */}
      <Reveal delay={100}>
        <h1 className="max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05] relative z-10">
          <span className="text-slate-900 dark:text-white">
            Learn to build with
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            AI & Digital Skills
          </span>
        </h1>
      </Reveal>

      {/* Subheading */}
      <Reveal delay={200}>
        <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-zinc-400 mb-12 leading-relaxed relative z-10">
          Master Prompt Engineering, AI Content Creation, and Digital Marketing 
          with hands-on courses built by industry practitioners.
        </p>
      </Reveal>

      {/* CTAs */}
      <Reveal delay={300}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16 relative z-10">
          <Link
            href="/courses"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            Browse Courses
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/courses/free"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white font-semibold text-base hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-300"
          >
            <Play className="h-4 w-4 text-indigo-500" />
            Watch Free Lesson
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
