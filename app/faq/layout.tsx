import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Bluedemy',
  description: 'Everything you need to know about Bluedemy. Find answers to common questions about courses, pricing, certificates, and more.',
  alternates: {
    canonical: '/faq',
  },
};

const faqs = [
 {
 question: 'How do I access my courses after purchase?',
 answer: 'Once you complete your purchase, you can access your courses immediately from your learning dashboard. Just log in to your account and click on "My Courses". All course materials, videos, and resources will be available for instant streaming or download.',
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
 answer: 'We offer a 14-day money-back guarantee on all our individual courses. If you are not satisfied with the content, simply contact our support team within 14 days of purchase for a full refund no questions asked.',
 },
 {
 question: 'Can I access courses on mobile?',
 answer: 'Yes, Bluedemy is fully responsive and works beautifully on all devices. You can learn on your laptop, tablet, or phone. We are also developing a dedicated mobile app with offline access for an even better experience.',
 },
 {
 question: 'Do you offer team or enterprise plans?',
 answer: 'Yes! We offer special pricing for teams of 5 or more. Our enterprise plans include admin dashboards, progress tracking, custom learning paths, and dedicated support. Contact our sales team at enterprise@bluedemy.org for a custom quote.',
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
