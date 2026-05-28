import { Reveal } from '@/components/ui/Reveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function Stats() {
  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '100+', label: 'Expert-Led Courses' },
    { value: '95%', label: 'Completion Rate' },
    { value: '4.8/5', label: 'Average Rating' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="rounded-3xl bg-zinc-50 p-12 md:p-16 border border-zinc-200 shadow-xl shadow-zinc-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <AnimatedCounter value={stat.value} duration={2000} />
                  <p className="text-sm md:text-base text-zinc-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
