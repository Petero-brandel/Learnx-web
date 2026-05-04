'use client'

import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/dashboard'
import { Bell, BookOpen, Trophy, Megaphone, ShoppingCart, Info } from 'lucide-react'

interface AdminNotificationItemProps {
  notification: Notification
  onMarkRead: (id: number) => void
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  system: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  enrollment: { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  achievement: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  sale: { icon: ShoppingCart, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  broadcast: { icon: Megaphone, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AdminNotificationItem({ notification, onMarkRead }: AdminNotificationItemProps) {
  const config = typeConfig[notification.type] || typeConfig.system
  const Icon = config.icon

  return (
    <button
      onClick={() => !notification.is_read && onMarkRead(notification.id)}
      className={cn(
        "flex items-start gap-3 w-full p-4 rounded-xl text-left transition-all duration-200 border",
        notification.is_read
          ? "border-zinc-800/30 bg-zinc-900/20 opacity-60"
          : "border-zinc-800/60 bg-zinc-900/50 hover:bg-zinc-800/40 hover:border-zinc-700/60"
      )}
    >
      {/* Icon */}
      <div className={cn("flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center", config.bg)}>
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm truncate",
            notification.is_read
              ? "font-medium text-zinc-500"
              : "font-semibold text-zinc-200"
          )}>
            {notification.title}
          </p>
          {!notification.is_read && (
            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          )}
        </div>
        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
      </div>

      {/* Time */}
      <span className="text-[10px] text-zinc-600 flex-shrink-0 mt-0.5">
        {timeAgo(notification.created_at)}
      </span>
    </button>
  )
}
