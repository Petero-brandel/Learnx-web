import { Brain, Sparkles, TrendingUp, Award, Clock, Users } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const features = [
 {
 title: 'AI-Powered Learning',
 description: 'Courses designed around the latest AI tools — ChatGPT, Midjourney, Claude, and more.',
 icon: Brain,
 iconColor: 'text-blue-600 dark:text-blue-400',
 },
 {
 title: 'Practical Projects',
 description: 'Every course includes real-world projects you can add to your portfolio immediately.',
 icon: Sparkles,
 iconColor: 'text-violet-600 dark:text-violet-400',
 },
 {
 title: 'Career Growth',
 description: 'Gain skills that are in high demand — from prompt engineering to digital marketing strategy.',
 icon: TrendingUp,
 iconColor: 'text-cyan-600 dark:text-cyan-400',
 },
 {
 title: 'Verified Certificates',
 description: 'Earn industry-recognized certificates to share on LinkedIn and boost your resume.',
 icon: Award,
 iconColor: 'text-amber-600 dark:text-amber-400',
 },
 {
 title: 'Learn at Your Pace',
 description: 'Lifetime access to all purchased courses. No deadlines, no pressure — just progress.',
 icon: Clock,
 iconColor: 'text-emerald-600 dark:text-emerald-400',
 },
 {
 title: 'Active Community',
 description: 'Connect with fellow learners, share your work, and get feedback from instructors.',
 icon: Users,
 iconColor: 'text-rose-600 dark:text-rose-400',
 },
];

export function Features() {
 return (
 <section id="features" className="py-28 px-6 relative bg-transparent dark:bg-[#121212]">
 <div className="max-w-7xl mx-auto">
 {/* Section header */}
 <Reveal>
 <div className="text-center max-w-2xl mx-auto mb-20">
 <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
 Why Bluedemy
 </p>
 <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
 Everything you need to{' '}
 <span className="text-blue-600 dark:text-blue-400">level up</span>
 </h2>
 <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
 We combine cutting-edge AI curriculum with practical, hands-on learning
 to help you build real skills that matter.
 </p>
 </div>
 </Reveal>

 {/* Features grid */}
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {features.map((feature, idx) => (
 <Reveal key={idx} delay={idx * 100}>
 <div
 className="group h-full relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-sm hover:-translate-y-1"
 >
 {/* Icon */}
 <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 mb-5 group-hover:scale-110 transition-transform duration-300`}>
 <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
 </div>

 {/* Content */}
 <h3 className="text-base font-bold mb-2 text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
 </div>
 </Reveal>
))}
 </div>
 </div>
 </section>
);
}
