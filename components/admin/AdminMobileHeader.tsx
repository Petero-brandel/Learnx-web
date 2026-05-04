'use client'

import { Shield, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface AdminMobileHeaderProps {
  onMenuOpen: () => void
}

export default function AdminMobileHeader({ onMenuOpen }: AdminMobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-zinc-800/60 md:hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-500/15">
            <Shield className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-zinc-100">LearnX</span>
            <span className="ml-1.5 text-[9px] font-semibold text-indigo-400 uppercase tracking-wider">Admin</span>
          </div>
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}
