import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  return (
    <section className="relative pt-28 pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden bg-[#00000">

      {/* Headline */}
      <Reveal delay={100}>
        <h1 className="max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
          <span className="text-black dark:text-white">
            Learn to build with
          </span>
          <br />
          <span className="text-[#1A73E8]">
            AI & Digital Skills
          </span>
        </h1>
      </Reveal>

      {/* Subheading */}
      <Reveal delay={200}>
        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
          Master Prompt Engineering, AI Content Creation, and Digital Marketing 
          with hands-on courses built by industry practitioners.
        </p>
      </Reveal>

      {/* CTAs */}
      <Reveal delay={300}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/courses"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-semibold text-base hover:shadow-lg hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
          >
            Browse Courses
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/courses/free"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-white font-semibold text-base hover:bg-zinc-900 transition-all duration-300"
          >
            <Play className="h-4 w-4 text-indigo-500" />
            Watch Free Lesson
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
