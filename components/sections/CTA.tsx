import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';

const avatars = [
  { src: '/images/avatars/dpstd6.jpeg', alt: 'Student 6' },
  { src: '/images/avatars/dpstd5.png', alt: 'Student 1' },
  { src: '/images/avatars/dpstd7.png', alt: 'Student 2' },
  { src: '/images/avatars/dpstd4.jpeg', alt: 'Student 3' },
  { src: '/images/avatars/dpstd2.png', alt: 'Student 4' },
  { src: '/images/avatars/dpstd1.png', alt: 'Student 5' },
];

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#DAEDEB]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #0c0e1a 0%, #141729 40%, #1a1f3a 100%)',
            }}
          >
            {/* Subtle glow overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16 p-10 md:p-14 lg:p-16">
              {/* Left Column */}
              <div className="flex-1 min-w-0">
                {/* Overlapping Avatars */}
                <div className="flex items-center -space-x-3 mb-8">
                  {avatars.map((avatar, i) => {
                    const isLast = i === avatars.length - 1;

                    return (
                      <div
                        key={i}
                        className="relative shrink-0 w-11 h-11 rounded-full ring-2 ring-[#0c0e1a] overflow-hidden"
                        style={{ zIndex: avatars.length - i }}
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.alt || ''}
                          fill
                          sizes="44px"
                          className={`object-cover transition-all duration-300 ${
                            isLast
                              ? 'brightness-75 scale-[1.03]'
                              : ''
                          }`}
                        />

                        {/* +N Overlay */}
                        {isLast && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <span className="text-white pl-2 text-sm font-bold tracking-wide">
                              +N
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight">
                  Learn practical digital skills{' '}
                  <br className="hidden sm:block" />
                  that help you grow faster{' '}
                  <br className="hidden sm:block" />
                  with <span className="text-white">Bluedemy</span>
                </h2>
              </div>

              {/* Right Column */}
              <div className="flex-shrink-0 w-full lg:w-[360px] flex flex-col gap-5">
                {/* Description */}
                <p className="text-[15px] leading-relaxed text-zinc-400">
                  Master in-demand digital skills with hands-on courses in AI,
                  content creation, marketing, and tech. Learn at your pace and
                  build skills you can actually use.
                </p>

                {/* CTA Button */}
                <Link
                  href="/courses"
                  className="group relative w-full inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
                  style={{
                    background:
                      'linear-gradient(135deg, #1557C0 0%, #1A73E8 50%, #4A90F7 100%)',
                  }}
                >
                  <span className="relative z-10">Get started</span>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'linear-gradient(135deg, #1252a8 0%, #1567d0 50%, #3d82f0 100%)',
                    }}
                  />
                </Link>

                {/* Secondary Link */}
                <Link
                  href="/about"
                  className="w-full inline-flex items-center justify-center py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200"
                >
                  Explore our learning paths
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}