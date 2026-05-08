'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth()
 const router = useRouter()

 useEffect(() => {
 if (!loading) {
 if (!user) {
 router.push('/login')
 } else if (!user.is_staff && !user.is_superuser) {
 // Authenticated but not admin — send to student dashboard
 router.push('/dashboard')
 }
 }
 }, [user, loading, router])

 if (loading) {
 return (
 <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#0a0a0a] z-50">
 <div className="flex flex-col items-center gap-4">
 <div className="relative">
 <div className="h-12 w-12 rounded-full border-[3px] border-zinc-200 dark:border-zinc-800" />
 <div className="absolute inset-0 h-12 w-12 rounded-full border-[3px] border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" />
 </div>
 <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
 Loading admin panel...
 </span>
 </div>
 </div>
)
 }

 if (!user || (!user.is_staff && !user.is_superuser)) return null

 return <>{children}</>
}
