'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { fetchNotifications } from '@/lib/dashboard'
import { Bell, Menu } from 'lucide-react'

interface MobileHeaderProps {
  onMenuOpen: () => void
}

export default function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
      .then(data => setUnreadCount(data.unread_count))
      .catch(() => {})
  }, [pathname])

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">LearnX</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar / Menu toggle */}
          <button
            onClick={onMenuOpen}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user.full_name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <Menu className="h-4 w-4 text-zinc-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
