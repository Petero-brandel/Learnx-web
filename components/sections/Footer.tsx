import Link from 'next/link';

const footerLinks = {
 Courses: [
 { label: 'Prompt Engineering', href: '/courses/prompt-engineering' },
 { label: 'AI Content Creation', href: '/courses/ai-content' },
 { label: 'Digital Marketing', href: '/courses/digital-marketing' },
 { label: 'AI Business Bootcamp', href: '/courses/ai-bootcamp' },
 { label: 'Free Courses', href: '/courses/free' },
 ],
 Company: [
 { label: 'About Us', href: '/about' },
 { label: 'Contact', href: '/contact' },
 { label: 'Teach on Bluedemy', href: '/teach' },
 { label: 'Careers', href: '/careers' },
 ],
 Support: [
 { label: 'Help Center', href: '/help' },
 { label: 'FAQs', href: '/faq' },
 { label: 'Student Guides', href: '/guides' },
 ],
 Legal: [
 { label: 'Privacy Policy', href: '/privacy' },
 { label: 'Terms of Service', href: '/terms' },
 { label: 'Refund Policy', href: '/refund' },
 ],
};

export function Footer() {
 return (
 <footer className="border-t border-zinc-100 dark:border-zinc-800/60 bg-transparent dark:bg-[#0e0e0e]">
 <div className="max-w-7xl mx-auto px-6 py-16">
 {/* Footer grid */}
 <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
 {/* Brand column */}
 <div className="col-span-2 md:col-span-1">
 <Link href="/" className="inline-block mb-4">
 <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">Bluedemy</span>
 </Link>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
 Master the skills of the future with expert-led courses in AI, content creation, and digital marketing.
 </p>
 </div>

 {/* Link columns */}
 {Object.entries(footerLinks).map(([category, links]) => (
 <div key={category}>
 <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">{category}</h4>
 <ul className="space-y-3">
 {links.map((link) => (
 <li key={link.label}>
 <Link
 href={link.href}
 className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
 >
 {link.label}
 </Link>
 </li>
))}
 </ul>
 </div>
))}
 </div>

 {/* Bottom bar */}
 <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
 <p className="text-sm text-zinc-400 dark:text-zinc-500">
 © {new Date().getFullYear()} Bluedemy. All rights reserved.
 </p>
 <div className="flex gap-6 text-sm text-zinc-400 dark:text-zinc-500">
 <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy</Link>
 <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms</Link>
 <Link href="/faq" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">FAQs</Link>
 </div>
 </div>
 </div>
 </footer>
);
}
