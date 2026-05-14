'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

interface MobileHeaderProps {
 onMenuOpen: () => void
}

export default function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
 return (
 <header className="fixed top-0 z-50 w-full bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800 md:hidden">
 <div className="flex h-14 items-center justify-between px-4">
            {/* Logo */}
            <Logo href="/" size="xs" variant="auto" />

 {/* Hamburger menu */}
 <button
 onClick={onMenuOpen}
 className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
 aria-label="Open menu"
 >
 <Menu className="h-5 w-5" />
 </button>
 </div>
 </header>
)
}
