import { Brain, Sparkles, TrendingUp, Award, Clock, Users } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const features = [
  {
    title: 'AI-Powered Learning',
    description: 'Courses designed around the latest AI tools — ChatGPT, Midjourney, Claude, and more.',
    icon: Brain,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/30',
  },
  {
    title: 'Practical Projects',
    description: 'Every course includes real-world projects you can add to your portfolio immediately.',
    icon: Sparkles,
    iconColor: 'text-violet-600 dark:text-violet-400',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-950/30',
  },
  {
    title: 'Career Growth',
    description: 'Gain skills that are in high demand — from prompt engineering to digital marketing strategy.',
    icon: TrendingUp,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/30',
  },
  {
    title: 'Verified Certificates',
    description: 'Earn industry-recognized certificates to share on LinkedIn and boost your resume.',
    icon: Award,
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
  },
  {
    title: 'Learn at Your Pace',
    description: 'Lifetime access to all purchased courses. No deadlines, no pressure — just progress.',
    icon: Clock,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
  },
  {
    title: 'Active Community',
    description: 'Connect with fellow learners, share your work, and get feedback from instructors.',
    icon: Users,
    iconColor: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/30',
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 px-6 relative bg-zinc-50 dark:bg-[#121212]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
              Why Bluedemy
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Everything you need to{' '}
              <span className="text-indigo-600 dark:text-indigo-400">level up</span>
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
                className="group h-full relative p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-black/20 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgLight} ${feature.bgDark} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
