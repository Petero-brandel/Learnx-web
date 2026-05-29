'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { SiYoutube, SiTiktok } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

interface Course {
  id: number;
  title: string;
  slug: string;
}

type FooterLink = { label: string; href: string; disabled?: boolean };

export function Footer() {
  const [topCourses, setTopCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function getTopCourses() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://learnx-app.fly.dev/api/';
        const res = await fetch(`${API_URL}courses/`);
        if (!res.ok) return;
        const data = await res.json();
        const coursesArray = Array.isArray(data) ? data : data.results;
        if (Array.isArray(coursesArray)) {
          setTopCourses(coursesArray.slice(0, 4));
        }
      } catch (e) {
        // silently fail
      }
    }
    getTopCourses();
  }, []);

  const footerLinks: Record<string, FooterLink[]> = {
    Courses: [
      ...topCourses.map((course) => ({ label: course.title, href: `/courses/${course.slug}` })),
      { label: 'Free Courses', href: '/courses?filter=free' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/about' },
      { label: 'Blog', href: '#', disabled: true },
    ],
    Support: [
      { label: 'Help Center', href: '/faq' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Student Guides', href: '#', disabled: true },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className="border-t border-zinc-800 bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo href="/" size="sm" variant="dark" src="/bluedemy-logo.png" />
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
                    {link.disabled ? (
                      <div className="relative group inline-flex">
                        <span className="text-sm text-zinc-600 cursor-not-allowed block max-w-[220px] sm:max-w-[180px] md:max-w-[220px] truncate overflow-hidden whitespace-nowrap">
                          {link.label}
                        </span>
                        <div className="absolute left-0 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-zinc-800 text-xs text-zinc-200 rounded whitespace-nowrap pointer-events-none z-10">
                          Coming soon
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors block max-w-[220px] sm:max-w-[180px] md:max-w-[220px] truncate overflow-hidden whitespace-nowrap"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Bluedemy. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/faq" className="hover:text-zinc-300 transition-colors">FAQs</Link>
            <span className="hidden md:inline text-zinc-700">|</span>

            <div className="flex items-center gap-2">
              <a
                href="https://www.tiktok.com/@bluedemy.org?_r=1&_t=ZS-96loZUWCH0k"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/70 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                aria-label="Bluedemy TikTok"
                title="TikTok"
              >
                <SiTiktok size={16} />
              </a>
              <a
                href="https://youtube.com/@bluedemy.org-elearning?si=HATHBNSUI_x_6O-s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/70 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                aria-label="Bluedemy YouTube"
                title="YouTube"
              >
                <SiYoutube size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/bluedemy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/70 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                aria-label="Bluedemy LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
