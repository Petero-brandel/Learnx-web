import { Reveal } from '@/components/ui/Reveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function Stats() {
 const stats = [
 { value: '10,000+', label: 'Active Students' },
 { value: '25+', label: 'Expert-Led Courses' },
 { value: '95%', label: 'Completion Rate' },
 { value: '4.8/5', label: 'Average Rating' },
 ];

 return (
 <section className="py-20 px-6 bg-transparent dark:bg-[#181818]">
 <div className="max-w-7xl mx-auto">
 <Reveal>
 <div className="rounded-3xl bg-white dark:bg-zinc-800 p-12 md:p-16 border border-zinc-200 dark:border-zinc-700/50 shadow-xl shadow-zinc-200/50 dark:shadow-none">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
 {stats.map((stat, idx) => (
 <div key={idx} className="text-center">
 <AnimatedCounter value={stat.value} duration={2000} />
 <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium">
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
