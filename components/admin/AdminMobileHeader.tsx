'use client'

import { Menu } from 'lucide-react'

interface AdminMobileHeaderProps {
  onMenuOpen: () => void
}

export default function AdminMobileHeader({ onMenuOpen }: AdminMobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/60 md:hidden">
      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Bluedemy</span>
      <button
        onClick={onMenuOpen}
        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>
  )
}
