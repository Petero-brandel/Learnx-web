'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
 LayoutDashboard, Users, BookOpen, GraduationCap, Send, Bell, LogOut, Shield, X, Moon, Sun
} from 'lucide-react'

const navItems = [
 { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
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
 <div className="flex items-center gap-3 pl-[16px] pr-4 h-16 border-b border-zinc-200 dark:border-zinc-700/60 shrink-0">
 <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-500/15 shrink-0">
 <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
 </div>
 <div className="flex flex-col items-start justify-center min-w-0 flex-1 opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300">
 <p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">Admin Panel</p>
 </div>
 {/* Mobile close */}
 <button
 onClick={onMobileClose}
 className="ml-auto md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50 transition-colors"
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
 "group flex items-center gap-3 pl-[13px] pr-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
 active
 ?"bg-blue-600 text-white shadow-md dark:bg-blue-500"
 :"text-zinc-800 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/50"
)}
 >
 <item.icon className={cn(
 "h-[18px] w-[18px] shrink-0 transition-colors",
 active ?"text-white" :"text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"
)} />
 <span className="truncate opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">{item.label}</span>
 </Link>
)
 })}

 {/* Unified Theme Toggle */}
 <button
 onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
 className="group flex items-center gap-3 pl-[13px] pr-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-zinc-800 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/50 w-full text-left mt-4"
 >
 {mounted ? (
 currentTheme === 'dark' ? (
 <Sun className="h-[18px] w-[18px] shrink-0 transition-colors text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white" />
) : (
 <Moon className="h-[18px] w-[18px] shrink-0 transition-colors text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white" />
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
 <div className="p-3 border-t border-zinc-200 dark:border-zinc-700/60 shrink-0">
 <div className="flex items-center gap-3 pl-[6px] pr-3 py-2 mb-2">
 {user?.profile_photo ? (
 <img
 src={user.profile_photo}
 alt={user.full_name}
 className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
 />
) : (
 <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
 <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
 {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
 </span>
 </div>
)}
 <div className="min-w-0 flex-1 opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-300">
 <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 truncate">{user?.full_name}</p>
 <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate">{user?.email}</p>
 </div>
 </div>
 <button
 onClick={logout}
 className="flex items-center gap-3 w-full pl-[13px] pr-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
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
"group/sidebar hidden md:flex flex-col fixed top-0 left-0 h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700/60 z-40 transition-all duration-300 overflow-hidden",
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
 className="absolute inset-0 bg-zinc-950/55"
 onClick={onMobileClose}
 />
 {/* Drawer */}
 <aside className="absolute right-0 top-0 bottom-0 w-[280px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-700/60 overflow-hidden animate-in slide-in-from-right duration-300">
 {sidebarContent}
 </aside>
 </div>
)}
 </>
)
}
