'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, BookOpen, Star, Briefcase, Trophy, CheckCircle, PlayCircle, Users, Video, HelpCircle, FileText, Shield, CreditCard, ArrowRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/context/AuthContext'

// ─── Mega-menu content definitions ───
const megaMenus: Record<string, {
  heading: string
  description: string
  columns: {
    title: string
    items: { label: string; description: string; href: string; icon: React.ElementType }[]
  }[]
  cta?: { label: string; href: string; description: string }
}> = {
  Courses: {
    heading: 'Explore Courses',
    description: 'Master new skills with our expert-led courses across various domains.',
    columns: [
      {
        title: 'Top Categories',
        items: [
          { label: 'Prompt Engineering', description: 'Master AI communication and logic', href: '/courses/prompt-engineering', icon: BookOpen },
          { label: 'AI Content Creation', description: 'Generate high-quality copy, images, & video', href: '/courses/ai-content', icon: Star },
          { label: 'Digital Marketing', description: 'SEO, Ads, and social media growth', href: '/courses/digital-marketing', icon: Briefcase },
        ],
      },
      {
        title: 'Featured',
        items: [
          { label: 'AI Business Bootcamp', description: 'Automate your workflows with AI', href: '/courses/ai-bootcamp', icon: Trophy },
          { label: 'Pro Certifications', description: 'Get certified in AI tools and strategies', href: '/certifications', icon: CheckCircle },
          { label: 'Free Crash Courses', description: 'Start learning AI immediately for free', href: '/courses/free', icon: PlayCircle },
        ],
      },
    ],
    cta: { label: 'Browse catalog', href: '/courses', description: 'See all 500+ courses →' },
  },
  Resources: {
    heading: 'Learning Resources',
    description: 'Everything you need to succeed in your learning journey.',
    columns: [
      {
        title: 'Community',
        items: [
          { label: 'Student Forums', description: 'Connect with peers and instructors', href: '/forums', icon: Users },
          { label: 'Live Events', description: 'Webinars, Q&As, and workshops', href: '/events', icon: Video },
        ],
      },
      {
        title: 'Help & Docs',
        items: [
          { label: 'Help Center', description: 'Guides and FAQs for your platform experience', href: '/help', icon: HelpCircle },
          { label: 'Student Guides', description: 'Tips on how to study effectively', href: '/guides', icon: FileText },
        ],
      },
    ],
  },
  Pricing: {
    heading: 'Pricing Plans',
    description: 'Flexible options for individuals and teams.',
    columns: [
      {
        title: 'Plans',
        items: [
          { label: 'Pro Subscription', description: 'Access to all courses for a monthly fee', href: '/#pricing', icon: Star },
          { label: 'Team Training', description: 'Upskill your entire organization', href: '/#pricing', icon: Users },
          { label: 'Pay per Course', description: 'Buy lifetime access to individual courses', href: '/#pricing', icon: CreditCard },
        ],
      },
      {
        title: 'Why Bluedemy Pro',
        items: [
          { label: 'Certificates', description: 'Earn certificates to share on LinkedIn', href: '/#pricing', icon: Trophy },
          { label: 'Cancel Anytime', description: 'No lock-in contracts for subscriptions', href: '/#pricing', icon: Shield },
          { label: 'Priority Support', description: 'Get your questions answered faster', href: '/#pricing', icon: HelpCircle },
        ],
      },
    ],
    cta: { label: 'View all plans', href: '/#pricing', description: 'Compare features and pricing →' },
  },
  Company: {
    heading: 'About Bluedemy',
    description: 'Learn more about our mission, team, and policies.',
    columns: [
      {
        title: 'About Us',
        items: [
          { label: 'Our Story', description: 'Mission, vision, and team', href: '/about', icon: Users },
          { label: 'Contact Us', description: 'Get in touch with our team', href: '/contact', icon: HelpCircle },
        ],
      },
      {
        title: 'Legal & Help',
        items: [
          { label: 'FAQs', description: 'Frequently asked questions', href: '/faq', icon: HelpCircle },
          { label: 'Privacy Policy', description: 'How we handle your data', href: '/privacy', icon: Shield },
          { label: 'Terms of Service', description: 'Rules and guidelines', href: '/terms', icon: FileText },
        ],
      },
    ],
  },
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mega-menu on route change
  useEffect(() => {
    setActiveMenu(null)
    setIsOpen(false)
  }, [pathname])

  const handleMenuEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(key)
  }

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200)
  }

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const navItems = [
    { label: 'Courses', hasMenu: true },
    { label: 'Resources', hasMenu: true },
    { label: 'Pricing', hasMenu: true },
    { label: 'Company', hasMenu: true },
    { label: 'My Learning', href: user ? '/dashboard' : '/login' },
  ]

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500 border-b",
          scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-sm"
            : "bg-white/50 dark:bg-black/50 backdrop-blur-md border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative transition-transform duration-300 group-hover:scale-105">
                <span className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">Bluedemy</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex" ref={navRef}>
              {navItems.map((item) =>
                item.hasMenu ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(item.label)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button
                      className={cn(
                        "inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        activeMenu === item.label && "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/50"
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        activeMenu === item.label && "rotate-180"
                      )} />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                      item.label === 'Teach on Bluedemy'
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                        : cn(
                            "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                            pathname === item.href && "text-zinc-900 dark:text-zinc-100 font-semibold"
                          )
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Right Navigation */}
            <div className="hidden items-center gap-5 md:flex relative">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200 bg-zinc-100 dark:bg-zinc-900/80 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5">
                  <Search className="h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="bg-transparent border-none focus:outline-none text-sm w-48 lg:w-64 px-1 text-zinc-900 dark:text-zinc-100"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={() => {setIsSearchOpen(false); setSearchQuery('')}} className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 p-0.5 text-zinc-500">
                    <X className="h-3 w-3" />
                  </button>

                  {/* Search Results Dropdown Placeholder */}
                  {searchQuery && (
                    <div className="absolute top-full right-0 mt-4 w-[320px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2 mt-2">Results for "{searchQuery}"</div>
                      <div className="space-y-1">
                        <Link href="/courses/prompt-engineering" onClick={() => setIsSearchOpen(false)} className="block px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">Advanced Prompt Engineering</p>
                              <p className="text-xs text-zinc-500 truncate">AI & Logic</p>
                            </div>
                          </div>
                        </Link>
                        <Link href="/courses/ai-content" onClick={() => setIsSearchOpen(false)} className="block px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex-shrink-0 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Star className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">AI Content Masterclass</p>
                              <p className="text-xs text-zinc-500 truncate">Marketing</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                         <Link href={`/search?q=${searchQuery}`} onClick={() => setIsSearchOpen(false)} className="block px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg text-center transition-colors">
                           View all results for "{searchQuery}"
                         </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  aria-label="Search courses" 
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
              
              <ThemeToggle />
              
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden lg:block"></div>

              <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Log in
              </Link>
              <button
                onClick={() => router.push('/signup')}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ─── Mega-Menu Dropdown (90% width) ─── */}
        {activeMenu && megaMenus[activeMenu] && (
          <div
            className="absolute left-0 right-0 top-full"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleMenuLeave}
          >
            {/* Subtle gradient separator */}
            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <div className="mx-auto w-[90%] max-w-7xl py-8 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Header */}
                <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{megaMenus[activeMenu].heading}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{megaMenus[activeMenu].description}</p>
                </div>

                {/* Columns grid */}
                <div className="grid grid-cols-2 gap-10">
                  {megaMenus[activeMenu].columns.map((col, ci) => (
                    <div key={ci}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">{col.title}</p>
                      <div className="space-y-1">
                        {col.items.map((item, ii) => (
                          <Link
                            key={ii}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className={cn(
                              "group flex items-start gap-4 p-3 rounded-xl transition-all duration-200",
                              "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
                            )}
                          >
                            <div className={cn(
                              "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200",
                              "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:scale-110"
                            )}>
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {item.label}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-transparent group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200 mt-1 flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional CTA */}
                {megaMenus[activeMenu].cta && (
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Link
                      href={megaMenus[activeMenu].cta!.href}
                      onClick={() => setActiveMenu(null)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
                    >
                      {megaMenus[activeMenu].cta!.label}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Mobile Navigation Drawer ─── */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-zinc-900/30 dark:bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl md:hidden animate-in slide-in-from-right duration-300">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">Bluedemy</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            {/* Mobile nav items */}
            <div className="p-5 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
              {Object.entries(megaMenus).map(([key, menu]) => (
                <MobileAccordion key={key} label={key} menu={menu} onClose={() => setIsOpen(false)} />
              ))}
              <Link
                href={user ? '/dashboard' : '/login'}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors"
              >
                My Learning
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/teach"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors"
              >
                Teach on Bluedemy
              </Link>
            </div>

            {/* Mobile CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-3">
              <button
                onClick={() => { setIsOpen(false); router.push('/login') }}
                className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                Log in
              </button>
              <button
                onClick={() => { setIsOpen(false); router.push('/signup') }}
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                Sign up
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// ─── Mobile Accordion ───
function MobileAccordion({
  label,
  menu,
  onClose,
}: {
  label: string
  menu: (typeof megaMenus)[string]
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors",
          "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900",
          open && "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        )}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {menu.columns.flatMap(col => col.items).map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <item.icon className="h-4 w-4 opacity-70" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
