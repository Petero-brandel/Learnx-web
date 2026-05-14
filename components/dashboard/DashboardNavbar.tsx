'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { fetchNotifications, type Notification as NotifType } from '@/lib/dashboard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import {
 LayoutDashboard, BookOpen, Bell, Award, ChevronDown,
 ArrowRight, Settings, LogOut, Search, ExternalLink
} from 'lucide-react'

// ─── Mega-menu content for dashboard nav ───
const dashboardMenus: Record<string, {
 heading: string
 description: string
 items: { label: string; description: string; href: string; icon: React.ElementType }[]
 cta?: { label: string; href: string }
}> = {
 'My Courses': {
 heading: 'Your Learning',
 description: 'Continue where you left off.',
 items: [
 { label: 'All Enrolled Courses', description: 'View all courses you\'re enrolled in', href: '/dashboard', icon: BookOpen },
 { label: 'Browse Catalog', description: 'Discover new courses to learn', href: '/courses', icon: Search },
 ],
 cta: { label: 'View all courses', href: '/dashboard' },
 },
}

export default function DashboardNavbar() {
 const { user, logout } = useAuth()
 const pathname = usePathname()
 const [activeMenu, setActiveMenu] = useState<string | null>(null)
 const [avatarOpen, setAvatarOpen] = useState(false)
 const [unreadCount, setUnreadCount] = useState(0)
 const [recentNotifs, setRecentNotifs] = useState<NotifType[]>([])
 const [notifHover, setNotifHover] = useState(false)
 const timeoutRef = useRef<NodeJS.Timeout | null>(null)
 const avatarTimeoutRef = useRef<NodeJS.Timeout | null>(null)
 const notifTimeoutRef = useRef<NodeJS.Timeout | null>(null)

 // Fetch unread notification count + recent notifications
 useEffect(() => {
 fetchNotifications()
 .then(data => {
 setUnreadCount(data.unread_count)
 setRecentNotifs(data.notifications?.slice(0, 4) || [])
 })
 .catch(() => {})
 }, [pathname])

 const handleMenuEnter = (key: string) => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current)
 setNotifHover(false)
 setActiveMenu(key)
 }

 const handleMenuLeave = () => {
 timeoutRef.current = setTimeout(() => setActiveMenu(null), 200)
 }

 const handleDropdownEnter = () => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current)
 }

 const handleAvatarEnter = () => {
 if (avatarTimeoutRef.current) clearTimeout(avatarTimeoutRef.current)
 setNotifHover(false)
 setActiveMenu(null)
 setAvatarOpen(true)
 }

 const handleAvatarLeave = () => {
 avatarTimeoutRef.current = setTimeout(() => setAvatarOpen(false), 200)
 }

 const handleNotifEnter = () => {
 if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current)
 setActiveMenu(null)
 setAvatarOpen(false)
 setNotifHover(true)
 }

 const handleNotifLeave = () => {
 notifTimeoutRef.current = setTimeout(() => setNotifHover(false), 200)
 }

 const navItems = [
 { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
 { label: 'My Courses', hasMenu: true, icon: BookOpen },
 { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: unreadCount, hasNotifDropdown: true },
 { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
 ]

 return (
 <nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800 shadow-sm hidden md:block">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="flex h-16 items-center justify-between">
 {/* Logo */}
 <Logo href="/" size="sm" variant="auto" />

 {/* Center navigation */}
 <div className="flex items-center gap-1">
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
"inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
"text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 activeMenu === item.label &&"text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/50"
)}
 >
 <item.icon className="h-4 w-4" />
 {item.label}
 <ChevronDown className={cn(
"h-3.5 w-3.5 transition-transform duration-200",
 activeMenu === item.label &&"rotate-180"
)} />
 </button>
 </div>
) : item.hasNotifDropdown ? (
 /* Notifications — hover triggers the full-width mega-menu */
 <div
 key={item.label}
 className="relative"
 onMouseEnter={handleNotifEnter}
 onMouseLeave={handleNotifLeave}
 >
 <Link
 href={item.href!}
 className={cn(
"inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative",
"text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 (pathname === item.href || notifHover) &&"text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/50"
)}
 >
 <item.icon className="h-4 w-4" />
 {item.label}
 {item.badge && item.badge > 0 ? (
 <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
 {item.badge > 99 ? '99+' : item.badge}
 </span>
) : null}
 </Link>
 </div>
) : (
 <Link
 key={item.label}
 href={item.href!}
 className={cn(
"inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative",
"text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 pathname === item.href &&"text-zinc-900 dark:text-zinc-100 font-semibold bg-zinc-50 dark:bg-zinc-800/30"
)}
 >
 <item.icon className="h-4 w-4" />
 {item.label}
 </Link>
)
)}
 </div>

 {/* Right side */}
 <div className="flex items-center gap-4">
 <ThemeToggle />

 <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

 {/* Avatar dropdown */}
 <div
 className="relative"
 onMouseEnter={handleAvatarEnter}
 onMouseLeave={handleAvatarLeave}
 >
 <button className="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
 {user?.profile_photo ? (
 <img
 src={user.profile_photo}
 alt={user.full_name}
 className="h-8 w-8 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
 />
) : (
 <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
 <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
 {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
 </span>
 </div>
)}
 <ChevronDown className={cn(
"h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
 avatarOpen &&"rotate-180"
)} />
 </button>

 {/* Avatar dropdown panel */}
 {avatarOpen && (
 <div
 className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in- duration-200 z-50"
 onMouseEnter={handleAvatarEnter}
 onMouseLeave={handleAvatarLeave}
 >
 {/* User info */}
 <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
 <div className="flex items-center gap-3">
 {user?.profile_photo ? (
 <img
 src={user.profile_photo}
 alt={user.full_name}
 className="h-10 w-10 rounded-full object-cover"
 />
) : (
 <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
 <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
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

 {/* Menu items */}
 <div className="p-2 space-y-0.5">
 <Link
 href="/dashboard/settings"
 onClick={() => setAvatarOpen(false)}
 className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors"
 >
 <Settings className="h-4 w-4 text-zinc-400" />
 Settings
 </Link>
 <Link
 href="/courses"
 onClick={() => setAvatarOpen(false)}
 className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors"
 >
 <ExternalLink className="h-4 w-4 text-zinc-400" />
 Browse Courses
 </Link>
 </div>

 {/* Logout */}
 <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
 <button
 onClick={() => { setAvatarOpen(false); logout(); }}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
 >
 <LogOut className="h-4 w-4" />
 Log out
 </button>
 </div>
 </div>
)}
 </div>
 </div>
 </div>
 </div>

 {/* ─── Mega-Menu Dropdown ─── */}
 {activeMenu && dashboardMenus[activeMenu] && (
 <div
 className="absolute left-0 right-0 top-full"
 onMouseEnter={handleDropdownEnter}
 onMouseLeave={handleMenuLeave}
 >
 <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
 <div className="bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl">
 <div className="mx-auto w-[90%] max-w-7xl py-6 animate-in fade-in slide-in- duration-300">
 <div className="mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
 {dashboardMenus[activeMenu].heading}
 </h3>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
 {dashboardMenus[activeMenu].description}
 </p>
 </div>

 <div className="space-y-1">
 {dashboardMenus[activeMenu].items.map((item, i) => (
 <Link
 key={i}
 href={item.href}
 onClick={() => setActiveMenu(null)}
 className="group flex items-start gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
 >
 <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:scale-110">
 <item.icon className="h-5 w-5" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
 {item.label}
 </p>
 <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
 {item.description}
 </p>
 </div>
 <ArrowRight className="h-4 w-4 text-transparent group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200 mt-1 flex-shrink-0" />
 </Link>
))}
 </div>

 {dashboardMenus[activeMenu].cta && (
 <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
 <Link
 href={dashboardMenus[activeMenu].cta!.href}
 onClick={() => setActiveMenu(null)}
 className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
 >
 {dashboardMenus[activeMenu].cta!.label}
 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
)}
 </div>
 </div>
 </div>
)}

 {/* ─── Notifications Full-Width Dropdown ─── */}
 {notifHover && (
 <div
 className="absolute left-0 right-0 top-full"
 onMouseEnter={handleNotifEnter}
 onMouseLeave={handleNotifLeave}
 >
 <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
 <div className="bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl">
 <div className="mx-auto w-[90%] max-w-7xl py-6 animate-in fade-in slide-in- duration-300">
 <div className="mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
 <div>
 <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Stay up to date with your learning progress.</p>
 </div>
 {unreadCount > 0 && (
 <span className="text-xs font-bold bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full px-3 py-1">
 {unreadCount} unread
 </span>
)}
 </div>

 {recentNotifs.length > 0 ? (
 <div className="space-y-1">
 {recentNotifs.map((notif) => (
 <div
 key={notif.id}
 className={cn(
"group flex items-start gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
 !notif.is_read &&"bg-blue-50/30 dark:bg-blue-500/5"
)}
 >
 <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
 <Bell className="h-5 w-5" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
 {notif.title}
 </p>
 {!notif.is_read && (
 <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500" />
)}
 </div>
 <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
 {notif.message}
 </p>
 </div>
 <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0 mt-1">
 {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
 </span>
 </div>
))}
 </div>
) : (
 <div className="py-8 text-center">
 <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
 <Bell className="h-6 w-6 text-zinc-400" />
 </div>
 <p className="text-sm text-zinc-500 dark:text-zinc-400">No notifications yet</p>
 </div>
)}

 <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
 <Link
 href="/dashboard/notifications"
 onClick={() => setNotifHover(false)}
 className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
 >
 View all notifications
 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 </div>
 </div>
 </div>
)}
 </nav>
)
}
