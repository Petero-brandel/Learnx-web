import Link from 'next/link';
import Logo from '@/components/ui/Logo';

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
 { label: 'Blog', href: '/blog' },
 ],
 Support: [
 { label: 'Help Center', href: '/faq' },
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
 <footer className="border-t border-zinc-800 bg-[#0a0a0a]">
 <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
 {/* Footer grid */}
 <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
 {/* Brand column */}
 <div className="col-span-2 md:col-span-1">
  <div className="mb-4">
  <Logo href="/" size="sm" variant="dark" />
  </div>
 <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
 Master the skills of the future with expert-led courses in AI, content creation, and digital marketing and many more.
 </p>
 </div>

 {/* Link columns */}
 {Object.entries(footerLinks).map(([category, links]) => (
 <div key={category}>
 <h4 className="text-sm font-bold text-zinc-100 mb-4">{category}</h4>
 <ul className="space-y-3">
 {links.map((link) => (
 <li key={link.label}>
 <Link
 href={link.href}
 className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
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
 <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
 <p className="text-sm text-zinc-500">
 © {new Date().getFullYear()} Bluedemy. All rights reserved.
 </p>
 <div className="flex gap-6 text-sm text-zinc-500">
 <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
 <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
 <Link href="/faq" className="hover:text-zinc-300 transition-colors">FAQs</Link>
 </div>
 </div>
 </div>
 </footer>
 );
}
