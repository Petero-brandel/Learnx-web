import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative pt-32 pb-28 min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-realistic.png"
          alt="AI and Digital Skills Workspace"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 z-10" />
      </div>

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Headline */}
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight lg:leading-[1.1]">
              <span className="text-white block sm:inline">
                Learn the skills that{' '}
              </span>
              <span className="text-blue-500">
                actually get you hired.
              </span>
            </h1>
          </Reveal>

          {/* Subheading */}
          <Reveal delay={200}>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed max-w-2xl">
              Stop guessing what to learn. Whether you're starting from scratch or leveling up, Bluedemy offers practical, hands-on courses in Tech, Business, and AI to help you land your dream job.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/courses"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-600/30"
              >
                Browse Courses
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/courses?filter=free"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-600 bg-black/40 backdrop-blur-sm text-zinc-200 font-semibold text-base hover:bg-zinc-800 transition-all duration-300"
              >
                <Play className="h-4 w-4 text-blue-400" />
                Watch Free Courses
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
