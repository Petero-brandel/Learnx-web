'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { fetchNotifications } from '@/lib/dashboard'
import { cn } from '@/lib/utils'
import {
  X, LayoutDashboard, BookOpen, Bell, Award,
  Settings, LogOut, ExternalLink
} from 'lucide-react'

interface DashboardDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function DashboardDrawer({ isOpen, onClose }: DashboardDrawerProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
        .then(data => setUnreadCount(data.unread_count))
        .catch(() => {})
    }
  }, [isOpen])

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname])

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: unreadCount },
    { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-zinc-900/30 dark:bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl md:hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <Link href="/" onClick={onClose}>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">LearnX</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* User profile card */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user.full_name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-800"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center ring-2 ring-indigo-200 dark:ring-indigo-800">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user?.full_name}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-280px)]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                pathname === item.href && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </Link>
          ))}

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-3" />

          <Link
            href="/courses"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            Browse Courses
          </Link>
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <button
            onClick={() => { onClose(); logout(); }}
            className="flex items-center justify-center gap-2 w-full bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-400 rounded-xl py-3 font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
