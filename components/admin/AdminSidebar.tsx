'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Send, Bell, LogOut, Shield, X, Moon, Sun
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/admin/dashboard/students', icon: Users },
  { label: 'Courses', href: '/admin/dashboard/courses', icon: BookOpen },
  { label: 'Enrollments', href: '/admin/dashboard/enrollments', icon: GraduationCap },
  { label: 'Broadcast', href: '/admin/dashboard/broadcast', icon: Send },
  { label: 'Notifications', href: '/admin/dashboard/notifications', icon: Bell },
]

interface AdminSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { setTheme, theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  const currentTheme = theme === 'system' ? systemTheme : theme

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="w-full md:w-[260px] flex flex-col h-full">
      {/* Brand header */}
      <div className="flex items-center gap-3 pl-[16px] pr-4 h-16 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-500/15 shrink-0">
          <Shield className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="min-w-0 opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300">
          <p className="text-sm font-bold text-zinc-100 truncate">Bluedemy</p>
          <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">Admin Panel</p>
        </div>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="ml-auto md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group flex items-center gap-3 pl-[13px] pr-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                active ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className="truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">{item.label}</span>
            </Link>
          )
        })}

        {/* Unified Theme Toggle */}
        <button
          onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
          className="group flex items-center gap-3 pl-[13px] pr-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 w-full text-left mt-4"
        >
          {mounted ? (
            currentTheme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] shrink-0 transition-colors text-zinc-500 group-hover:text-zinc-300" />
            ) : (
              <Moon className="h-[18px] w-[18px] shrink-0 transition-colors text-zinc-500 group-hover:text-zinc-300" />
            )
          ) : (
            <div className="h-[18px] w-[18px] shrink-0" />
          )}
          <span className="truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">
            {mounted ? (currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Appearance'}
          </span>
        </button>
      </nav>

      {/* User info + Logout */}
      <div className="p-3 border-t border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-3 pl-[6px] pr-3 py-2 mb-2">
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt={user.full_name}
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-zinc-700"
            />
          ) : (
            <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center ring-2 ring-zinc-700">
              <span className="text-xs font-bold text-indigo-400">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1 opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-semibold text-zinc-200 truncate">{user?.full_name}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full pl-[13px] pr-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span className="truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">Log out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "group/sidebar hidden md:flex flex-col fixed top-0 left-0 h-screen bg-[#0f0f0f] border-r border-zinc-800/60 z-40 transition-all duration-300 overflow-hidden",
          "w-[68px] hover:w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0f0f0f] border-r border-zinc-800/60 overflow-hidden animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
