'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { fetchMyEnrollments, fetchNotifications, fetchMyCertificates } from '@/lib/dashboard'
import { verifyPayment } from '@/lib/payments'
import type { Enrollment, Notification } from '@/lib/dashboard'
import StatsCard from '@/components/dashboard/StatsCard'
import CourseCard from '@/components/dashboard/CourseCard'
import { BookOpen, TrendingUp, Award, Bell, ArrowRight, Search } from 'lucide-react'

function getGreeting(): string {
 const hour = new Date().getHours()
 if (hour < 12) return 'Good morning'
 if (hour < 17) return 'Good afternoon'
 return 'Good evening'
}

function getFirstName(fullName: string): string {
 return fullName?.split(' ')[0] || 'there'
}

export default function DashboardPage() {
 return (
 <Suspense fallback={<DashboardSkeleton />}>
 <DashboardContent />
 </Suspense>
)
}

function DashboardContent() {
 const { user, loading: authLoading } = useAuth()
 const router = useRouter()
 const searchParams = useSearchParams()
 const [enrollments, setEnrollments] = useState<Enrollment[]>([])
 const [notifications, setNotifications] = useState<Notification[]>([])
 const [certificateCount, setCertificateCount] = useState(0)
 const [loading, setLoading] = useState(true)
 const [verifying, setVerifying] = useState(false)

 // Redirect to login if not authenticated
 useEffect(() => {
 if (!authLoading && !user) {
 router.push('/login')
 }
 }, [user, authLoading, router])

 useEffect(() => {
 async function initDashboard() {
 // Check for payment verification reference
 const reference = searchParams.get('reference')
 if (reference) {
 setVerifying(true)
 try {
 await verifyPayment(reference)
 // Clean URL
 router.replace('/dashboard')
 } catch (err) {
 console.error('Payment verification failed', err)
 alert('Failed to verify payment automatically. Please contact support.')
 router.replace('/dashboard')
 }
 // Return early. The router.replace will strip the reference from the URL
 // and trigger a re-render. The second pass will fetch the updated enrollments.
 return
 }

 try {
 const [enrollData, notifData, certData] = await Promise.all([
 fetchMyEnrollments(),
 fetchNotifications(),
 fetchMyCertificates(),
 ])
 setEnrollments(enrollData)
 setNotifications(notifData.notifications.slice(0, 3))
 setCertificateCount(certData.length)
 } catch (err) {
 console.error('Failed to load dashboard data', err)
 } finally {
 setVerifying(false) // Clear verifying state if carried over from previous render
 setLoading(false)
 }
 }
 initDashboard()
 }, [searchParams, router])

 const avgProgress = enrollments.length > 0
 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length)
 : 0

 const today = new Date().toLocaleDateString('en-US', {
 weekday: 'long',
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 })

 if (loading || verifying) {
 return (
 <div className="space-y-4">
 {verifying && (
 <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-blue-700 dark:text-blue-300">
 <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
 <span className="font-medium text-sm">Verifying your purchase securely...</span>
 </div>
)}
 <DashboardSkeleton />
 </div>
)
 }

 return (
 <div className="space-y-8">
 {/* Welcome header */}
 <div>
 <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
 {getGreeting()}, {getFirstName(user?.full_name || '')}
 </h1>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{today}</p>
 </div>

 {/* Stats row horizontal scroll on mobile, grid on desktop */}
 <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
 <StatsCard
 icon={BookOpen}
 label="Enrolled Courses"
 value={enrollments.length}
 color="pink"
 className="first:ml-4 md:first:ml-0"
 />
 <StatsCard
 icon={TrendingUp}
 label="Average Progress"
 value={`${avgProgress}%`}
 color="blue"
 />
 <StatsCard
 icon={Award}
 label="Certificates Earned"
 value={certificateCount}
 color="gold"
 />
 </div>

 {/* My Courses */}
 <section>
 <div className="flex items-center justify-between mb-5">
 <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">My Courses</h2>
 {enrollments.length > 0 && (
 <Link
 href="/courses"
 className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
 >
 Browse more
 <ArrowRight className="h-3.5 w-3.5" />
 </Link>
)}
 </div>

 {enrollments.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
 {enrollments.map((enrollment) => (
 <CourseCard key={enrollment.enrollment_id} enrollment={enrollment} />
))}
 </div>
) : (
 /* Empty state */
 <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700/70 bg-zinc-50/50 dark:bg-zinc-900/20">
 <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
 <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
 </div>
 <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
 No courses yet
 </h3>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-5">
 Start your learning journey by exploring our course catalog.
 </p>
 <Link
 href="/courses"
 className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
 >
 Browse Courses
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
)}
 </section>
 </div>
)
}

// --- Skeleton Loader -------------------------------------
function DashboardSkeleton() {
 return (
 <div className="space-y-8 animate-pulse">
 {/* Welcome skeleton */}
 <div>
 <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
 <div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800/50 rounded mt-2" />
 </div>

 {/* Stats skeleton */}
 <div className="flex gap-3 overflow-hidden md:grid md:grid-cols-3">
 {[1, 2, 3].map((i) => (
 <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700/70 min-w-[200px]">
 <div className="h-11 w-11 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
 <div>
 <div className="h-7 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800/50 rounded mt-2" />
 </div>
 </div>
))}
 </div>

 {/* Course cards skeleton */}
 <div>
 <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-5" />
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="rounded-2xl border border-zinc-100 dark:border-zinc-700/70 overflow-hidden">
 <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
 <div className="p-4 space-y-3">
 <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full" />
 <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
 </div>
 </div>
))}
 </div>
 </div>
 </div>
)
}
