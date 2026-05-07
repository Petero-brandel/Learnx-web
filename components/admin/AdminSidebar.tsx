'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Send, Bell,
  ChevronLeft, ChevronRight, LogOut, Shield, X
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
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 border-b border-zinc-800/60 shrink-0",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-500/15 shrink-0">
          <Shield className="h-5 w-5 text-indigo-400" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-100 truncate">Bluedemy</p>
            <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-wider">Admin Panel</p>
          </div>
        )}
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="ml-auto md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                active
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                active ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden md:block px-3 py-2 border-t border-zinc-800/60">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User info + Logout */}
      <div className={cn(
        "px-3 py-3 border-t border-zinc-800/60 shrink-0",
        collapsed && "px-2"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user.full_name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-zinc-700"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center ring-2 ring-zinc-700">
                <span className="text-xs font-bold text-indigo-400">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-200 truncate">{user?.full_name}</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Log out' : undefined}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed top-0 left-0 h-screen bg-[#0f0f0f] border-r border-zinc-800/60 z-40 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]"
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
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0f0f0f] border-r border-zinc-800/60 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
