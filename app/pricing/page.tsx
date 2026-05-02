'use client';

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Check, Info } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Individual Course',
    description: 'Perfect if you want to learn a specific skill.',
    price: '₦20,000',
    duration: 'per course',
    popular: false,
    features: [
      'Lifetime access to the course',
      'All video lessons & materials',
      'Practical projects & exercises',
      'Verifiable digital certificate',
      'Access to course community',
    ],
    cta: 'Browse Courses',
    href: '/courses',
  },
  {
    name: 'LearnX Pro',
    description: 'Best for career switchers and dedicated learners.',
    price: '₦150,000',
    duration: 'per year',
    popular: true,
    features: [
      'Access to ALL current & future courses',
      'Priority 1-on-1 instructor feedback',
      'Exclusive weekly live Q&A sessions',
      'Advanced career & portfolio review',
      'Premium community access',
      'Downloadable resource vault',
    ],
    cta: 'Get Pro Access',
    href: '/signup?plan=pro',
  },
  {
    name: 'Enterprise',
    description: 'For teams looking to upskill their workforce.',
    price: 'Custom',
    duration: 'for teams of 5+',
    popular: false,
    features: [
      'Everything in LearnX Pro',
      'Dedicated success manager',
      'Team progress analytics dashboard',
      'Custom learning paths',
      'SSO & bulk onboarding',
      'Invoice billing available',
    ],
    cta: 'Contact Sales',
    href: 'mailto:enterprise@learnx.com',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
              Pricing
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Invest in your future
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Whether you want to master a single skill or unlock our entire library,
              we have a plan that fits your goals.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col p-8 rounded-3xl ${
                  plan.popular
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-105 z-10'
                    : 'bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.popular ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    <span className={`text-sm font-medium mb-1 ${plan.popular ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {plan.duration}
                    </span>
                  </div>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-indigo-400 dark:text-indigo-600' : 'text-indigo-600 dark:text-indigo-400'}`} />
                      <span className={plan.popular ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-600 dark:text-zinc-400'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ/Trust info */}
          <div className="max-w-2xl mx-auto mt-24 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
              <Info className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">14-Day Money-Back Guarantee</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              We stand by the quality of our courses. If you are not completely satisfied
              with your purchase, contact us within 14 days for a full refund.
            </p>
            <Link href="/faq" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Read our full FAQ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
