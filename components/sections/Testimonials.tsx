import { Star } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const testimonials = [
  {
    name: 'Adaeze O.',
    role: 'Freelance Copywriter',
    content: 'The Prompt Engineering course completely transformed how I work. I now deliver 3x faster using AI tools I learned here.',
    rating: 5,
    avatar: 'A',
    gradient: 'bg-indigo-500',
  },
  {
    name: 'Tunde B.',
    role: 'Digital Marketer',
    content: 'Bluedemy gave me the practical digital marketing skills that no university course ever did. My client base has doubled.',
    rating: 5,
    avatar: 'T',
    gradient: 'bg-violet-500',
  },
  {
    name: 'Chioma E.',
    role: 'Content Creator',
    content: 'The AI Content Creation course is a game-changer. I went from struggling with ideas to producing high-quality content daily.',
    rating: 5,
    avatar: 'C',
    gradient: 'bg-cyan-500',
  },
];

export function Testimonials() {
  return (
    <section className="py-28 px-6 bg-white dark:bg-[#121212]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
              Student Stories
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Loved by learners
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Hear from real students who have transformed their careers with Bluedemy.
            </p>
          </div>
        </Reveal>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Reveal key={idx} delay={idx * 100}>
              <div
                className="h-full p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-black/20 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8 text-base">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{testimonial.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
