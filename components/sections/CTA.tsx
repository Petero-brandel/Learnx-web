import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export function CTA() {
  return (
    <section className="py-28 px-6 bg-transparent dark:bg-[#181818]">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 isolate">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[#1A73E8]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" aria-hidden="true" />

            <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to master the future?
            </h2>
            <p className="relative z-10 text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of students building real skills in AI, content creation,
              and digital marketing. Start your first course today — for free.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courses"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-semibold text-base hover:shadow-lg hover:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Learning Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
