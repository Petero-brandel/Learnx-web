'use client'

import { useState, useEffect } from 'react'
import {
 fetchNotifications, markNotificationRead, markAllNotificationsRead,
 type Notification
} from '@/lib/dashboard'
import AdminNotificationItem from '@/components/admin/AdminNotificationItem'
import { Bell, CheckCheck } from 'lucide-react'

export default function AdminNotificationsPage() {
 const [notifications, setNotifications] = useState<Notification[]>([])
 const [unreadCount, setUnreadCount] = useState(0)
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function load() {
 try {
 const data = await fetchNotifications()
 setNotifications(data.notifications)
 setUnreadCount(data.unread_count)
 } catch (err) {
 console.error('Failed to load notifications', err)
 } finally {
 setLoading(false)
 }
 }
 load()
 }, [])

 const handleMarkRead = async (id: number) => {
 try {
 await markNotificationRead(id)
 setNotifications(prev =>
 prev.map(n => n.id === id ? { ...n, is_read: true } : n)
)
 setUnreadCount(prev => Math.max(0, prev - 1))
 } catch (err) {
 console.error('Failed to mark notification as read', err)
 }
 }

 const handleMarkAllRead = async () => {
 try {
 await markAllNotificationsRead()
 setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
 setUnreadCount(0)
 } catch (err) {
 console.error('Failed to mark all as read', err)
 }
 }

 if (loading) {
 return (
 <div className="space-y-6 animate-pulse">
 <div className="flex items-center justify-between">
 <div className="h-7 w-40 bg-zinc-200 dark:bg-zinc-800/60 rounded" />
 <div className="h-8 w-28 bg-zinc-200 dark:bg-zinc-800/40 rounded-lg" />
 </div>
 {[1, 2, 3, 4, 5].map(i => (
 <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800/30 rounded-xl" />
))}
 </div>
)
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
 Notifications
 </h1>
 {unreadCount > 0 && (
 <p className="text-sm text-zinc-500 mt-0.5">
 {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
 </p>
)}
 </div>
 {unreadCount > 0 && (
 <button
 onClick={handleMarkAllRead}
 className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
 >
 <CheckCheck className="h-3.5 w-3.5" />
 Mark all read
 </button>
)}
 </div>

 {/* Notification list */}
 {notifications.length > 0 ? (
 <div className="space-y-2">
 {notifications.map(notif => (
 <AdminNotificationItem
 key={notif.id}
 notification={notif}
 onMarkRead={handleMarkRead}
 />
))}
 </div>
) : (
 <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
 <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
 <Bell className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
 </div>
 <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
 All clear!
 </h3>
 <p className="text-sm text-zinc-500 text-center">
 You have no notifications yet.
 </p>
 </div>
)}
 </div>
)
}
