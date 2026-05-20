'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

interface MobileHeaderProps {
 onMenuOpen: () => void
}

export default function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
 return (
 <header className="fixed top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700/60 md:hidden">
    <div className="flex h-16 items-center justify-between px-4">
            {/* Logo */}
             <Logo href="/" size="lg" variant="auto" src="/bluedemy-logo.png" className="h-16 w-auto" />

 {/* Hamburger menu */}
 <button
 onClick={onMenuOpen}
 className="p-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
 aria-label="Open menu"
 >
 <Menu className="h-5 w-5" />
 </button>
 </div>
 </header>
)
}
