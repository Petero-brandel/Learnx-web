'use client';

import { useState } from 'react';
import Navbar from"@/components/layout/Navbar";
import { Footer } from"@/components/sections/Footer";
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
 {
 question: 'How do I access my courses after purchase?',
 answer: 'Once you complete your purchase, you can access your courses immediately from your learning dashboard. Just log in to your account and click on"My Courses". All course materials, videos, and resources will be available for instant streaming or download.',
 },
 {
 question: 'Are the courses self-paced?',
 answer: 'Yes! All of our courses are self-paced, meaning you can start and finish them whenever it fits your schedule. You also get lifetime access to the materials, so you can revisit lessons at any time.',
 },
 {
 question: 'Do I receive a certificate?',
 answer: 'Absolutely. Upon successfully completing a course and any required assessments, you will receive a verifiable digital certificate that you can add to your LinkedIn profile, share on social media, or include in your resume.',
 },
 {
 question: 'What is your refund policy?',
 answer: 'We offer a 14-day money-back guarantee on all our individual courses. If you are not satisfied with the content, simply contact our support team within 14 days of purchase for a full refund — no questions asked.',
 },
 {
 question: 'Can I access courses on mobile?',
 answer: 'Yes, Bluedemy is fully responsive and works beautifully on all devices. You can learn on your laptop, tablet, or phone. We are also developing a dedicated mobile app with offline access for an even better experience.',
 },
 {
 question: 'Do you offer team or enterprise plans?',
 answer: 'Yes! We offer special pricing for teams of 5 or more. Our enterprise plans include admin dashboards, progress tracking, custom learning paths, and dedicated support. Contact our sales team at enterprise@bluedemy.com for a custom quote.',
 },
 {
 question: 'How are the courses structured?',
 answer: 'Each course is divided into modules, and each module contains bite-sized video lessons (typically 5-15 minutes), practical exercises, quizzes, and a hands-on project. This structure ensures you learn by doing, not just watching.',
 },
 {
 question: 'Can I preview a course before buying?',
 answer: 'Definitely! Every course has free preview lessons so you can get a feel for the instructor\'s teaching style and the quality of content before committing. We also offer several completely free crash courses to get you started.',
 },
];

function AccordionItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
 return (
 <div className="border-b border-zinc-100 dark:border-zinc-800/60">
 <button
 onClick={onToggle}
 className="flex w-full items-center justify-between py-6 text-left group"
 >
 <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 pr-8 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
 {faq.question}
 </h3>
 <ChevronDown
 className={cn(
"h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 flex-shrink-0",
 isOpen &&"rotate-180 text-blue-600 dark:text-blue-400"
)}
 />
 </button>
 <div
 className={cn(
"grid transition-all duration-300 ease-in-out",
 isOpen ?"grid-rows-[1fr] opacity-100 pb-6" :"grid-rows-[0fr] opacity-0"
)}
 >
 <div className="overflow-hidden">
 <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
 {faq.answer}
 </p>
 </div>
 </div>
 </div>
);
}

export default function FAQPage() {
 const [openIndex, setOpenIndex] = useState<number | null>(0);

 return (
 <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-blue-500/30">
 <Navbar />
 <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
 <div className="max-w-3xl mx-auto">
 {/* Page header */}
 <div className="text-center mb-16">
 <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
 Support
 </p>
 <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
 Frequently Asked Questions
 </h1>
 <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
 Everything you need to know about Bluedemy. Can&apos;t find what you&apos;re looking for?{' '}
 <a href="mailto:support@bluedemy.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
 Contact our team
 </a>.
 </p>
 </div>

 {/* FAQ Accordion */}
 <div className="border-t border-zinc-100 dark:border-zinc-800/60">
 {faqs.map((faq, index) => (
 <AccordionItem
 key={index}
 faq={faq}
 isOpen={openIndex === index}
 onToggle={() => setOpenIndex(openIndex === index ? null : index)}
 />
))}
 </div>

 {/* Bottom CTA */}
 <div className="mt-16 text-center p-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/60">
 <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
 <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
 Our support team is here to help you every step of the way.
 </p>
 <a
 href="mailto:support@bluedemy.com"
 className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-sm hover:opacity-90 transition-opacity"
 >
 Contact Support
 </a>
 </div>
 </div>
 </main>
 <Footer />
 </div>
);
}
