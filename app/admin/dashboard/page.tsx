'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
 fetchRevenueStats, fetchUserStats, fetchCoursePerformance, fetchRecentActivity,
 type RevenueStats, type UserStats, type CoursePerformance, type RecentOrder
} from '@/lib/admin'
import AdminStatsCard from '@/components/admin/AdminStatsCard'
import MiniChart from '@/components/admin/MiniChart'
import RecentOrdersTable from '@/components/admin/RecentOrdersTable'
import { Users, BookOpen, TrendingUp, BarChart3, ShoppingCart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from 'next-themes'

function NairaSign(props: React.SVGProps<SVGSVGElement>) {
 return (
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 {...props}
 >
 <path d="M6 4v16" />
 <path d="M6 4l12 16" />
 <path d="M18 4v16" />
 <path d="M4 10h16" />
 <path d="M4 14h16" />
 </svg>
 )
}

function getGreeting(): string {
 const hour = new Date().getHours()
 if (hour < 12) return 'Good morning'
 if (hour < 17) return 'Good afternoon'
 return 'Good evening'
}

function getFirstName(fullName: string): string {
 return fullName?.split(' ')[0] || 'Admin'
}

function formatCurrency(amount: number): string {
 if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`
 if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(1)}K`
 return `₦${amount.toLocaleString()}`
}

export default function AdminDashboardPage() {
 const { user, loading: authLoading } = useAuth()
 const router = useRouter()
 const [revenue, setRevenue] = useState<RevenueStats | null>(null)
 const [userStats, setUserStats] = useState<UserStats | null>(null)
 const [coursePerf, setCoursePerf] = useState<CoursePerformance | null>(null)
 const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
 const [loading, setLoading] = useState(true)
 const [period, setPeriod] = useState('7d')
 const [isPeriodLoading, setIsPeriodLoading] = useState(false)
 const { resolvedTheme } = useTheme()
 const isDark = resolvedTheme === 'dark'

 // Redirect to login if not authenticated or not admin
 useEffect(() => {
 if (!authLoading) {
 if (!user || (!user.is_staff && !user.is_superuser)) {
 router.push('/login')
 }
 }
 }, [user, authLoading, router])

 useEffect(() => {
 async function loadData() {
 try {
 const [revData, userData, courseData, activityData] = await Promise.all([
 fetchRevenueStats(period),
 fetchUserStats(period),
 fetchCoursePerformance(),
 fetchRecentActivity(),
 ])
 setRevenue(revData)
 setUserStats(userData)
 setCoursePerf(courseData)
 setRecentOrders(activityData.recent_orders)
 } catch (err) {
 console.error('Failed to load admin dashboard data', err)
 } finally {
 setLoading(false)
 setIsPeriodLoading(false)
 }
 }
 setIsPeriodLoading(true)
 loadData()
 }, [period])

 const today = new Date().toLocaleDateString('en-US', {
 weekday: 'long',
 year: 'numeric',
 month: 'long',
 day: 'numeric',
 })

 if (loading) {
 return <LoadingSkeleton />
 }

 const getPeriodLabel = () => {
 if (period === '7d') return '7 Days'
 if (period === '14d') return '14 Days'
 if (period === '30d') return '30 Days'
 return '1 Year'
 }

 const getChartDateArray = () => {
 if (period === '1y') {
 return Array.from({ length: 12 }, (_, i) => {
 const d = new Date()
 d.setMonth(d.getMonth() - (11 - i))
 return d
 })
 }
 const days = period === '7d' ? 7 : period === '14d' ? 14 : 30
 return Array.from({ length: days }, (_, i) => {
 const d = new Date()
 d.setDate(d.getDate() - ((days - 1) - i))
 return d
 })
 }

 const chartDates = getChartDateArray()

 const formatKey = (d: Date) => {
 if (period === '1y') {
 return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
 }
 return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
 }

 const formatLabel = (d: Date) => {
 if (period === '1y') {
 return d.toLocaleDateString('en-US', { month: 'short' })
 }
 return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
 }

 const revenueMap = new Map((revenue?.revenue_over_time || []).map(d => [d.day, Number(d.total)]))
 const revenueChartData = chartDates.map(d => ({
 label: formatLabel(d),
 value: revenueMap.get(formatKey(d)) || 0
 }))

 const signupsMap = new Map((userStats?.signups_over_time || []).map(d => [d.day, d.count]))
 const signupsChartData = chartDates.map(d => ({
 label: formatLabel(d),
 value: signupsMap.get(formatKey(d)) || 0
 }))

 // Popular courses for bar visualization (Top 5 only)
 const popularCourses = (coursePerf?.popular_courses || []).slice(0, 5)

 // Revenue per course (Top 5 only)
 const revPerCourse = (revenue?.revenue_per_course || []).slice(0, 5)

 return (
 <div className="space-y-8">
 {/* Welcome header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
 {getGreeting()}, {getFirstName(user?.full_name || '')}
 </h1>
 <p className="text-sm text-zinc-500 mt-1">{today} &middot; Admin Dashboard</p>
 </div>
 
 <div className="flex items-center gap-2">
 <select 
 value={period}
 onChange={(e) => setPeriod(e.target.value)}
 disabled={isPeriodLoading}
 className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm dark:shadow-none disabled:opacity-50"
 >
 <option value="7d">Last 7 Days</option>
 <option value="14d">Last 14 Days</option>
 <option value="30d">Last 30 Days</option>
 <option value="1y">Last 1 Year</option>
 </select>
 </div>
 </div>

 {/* KPI Cards */}
 <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:pb-0">
 <AdminStatsCard
 icon={NairaSign}
 label="Total Revenue"
 value={formatCurrency(revenue?.revenue.all_time || 0)}
 sub={`₦${(revenue?.revenue.this_month || 0).toLocaleString()} this month`}
 color="green"
 className="first:ml-4 sm:first:ml-0"
 />
 <AdminStatsCard
 icon={Users}
 label="Total Students"
 value={userStats?.total_students || 0}
 color="blue"
 />
 <AdminStatsCard
 icon={BookOpen}
 label="Active Courses"
 value={popularCourses.length}
 color="purple"
 />
 <AdminStatsCard
 icon={TrendingUp}
 label="Avg Completion"
 value={`${coursePerf?.average_completion_rate || 0}%`}
 color="amber"
 />
 </div>

 {/* Charts row */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Revenue Chart */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 shadow-sm dark:shadow-none">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Revenue ({getPeriodLabel()})</h3>
 <p className="text-xs text-zinc-500 mt-0.5">Daily revenue trend</p>
 </div>
 <div className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1">
 <NairaSign className="h-3 w-3" />
 {formatCurrency(revenue?.revenue.this_month || 0)}
 </div>
 </div>
 <MiniChart data={revenueChartData} color="zinc" height={200} />
 </div>

 {/* Signups Chart */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 shadow-sm dark:shadow-none">
 <div className="flex items-center justify-between mb-4">
 <div>
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">New Students ({getPeriodLabel()})</h3>
 <p className="text-xs text-zinc-500 mt-0.5">Daily signups trend</p>
 </div>
 <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium bg-sky-500/10 rounded-full px-3 py-1">
 <Users className="h-3 w-3" />
 {userStats?.total_students || 0} total
 </div>
 </div>
 <MiniChart data={signupsChartData} color="sky" height={200} />
 </div>
 </div>

 {/* Popular courses + Revenue per course */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Popular Courses */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 flex flex-col shadow-sm dark:shadow-none">
 <div className="flex items-center gap-2 mb-5">
 <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Popular Courses</h3>
 </div>
 {popularCourses.length > 0 ? (
 <div className="flex-1 min-h-[250px] w-full mt-2">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={popularCourses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ?"#3f3f46" :"#e4e4e7"} opacity={0.5} />
 <XAxis 
 dataKey="course_title" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
 dy={10}
 tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
 />
 <YAxis 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
 allowDecimals={false}
 />
 <Tooltip 
 cursor={{ fill: isDark ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
 contentStyle={{ 
 backgroundColor: isDark ? '#18181b' : '#ffffff', 
 borderColor: isDark ? '#27272a' : '#e4e4e7',
 borderRadius: '12px',
 fontSize: '13px',
 color: isDark ? '#e4e4e7' : '#18181b',
 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
 }}
 itemStyle={{ color: isDark ? '#818cf8' : '#6366f1', fontWeight: 500 }}
 labelStyle={{ color: isDark ? '#a1a1aa' : '#71717a', marginBottom: '4px' }}
 formatter={(value: any) => [value, 'Enrollments']}
 />
 <Bar dataKey="total_enrollments" radius={[4, 4, 0, 0]} maxBarSize={40}>
 {popularCourses.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={isDark ?"#818cf8" :"#6366f1"} />
))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
) : (
 <div className="flex-1 flex items-center justify-center">
 <p className="text-xs text-zinc-600">No enrollment data yet</p>
 </div>
)}
 </div>

 {/* Revenue Per Course */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 flex flex-col shadow-sm dark:shadow-none">
 <div className="flex items-center gap-2 mb-5">
 <NairaSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Revenue Per Course</h3>
 </div>
 {revPerCourse.length > 0 ? (
 <div className="flex-1 min-h-[250px] w-full mt-2">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={revPerCourse} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ?"#3f3f46" :"#e4e4e7"} opacity={0.5} />
 <XAxis 
 dataKey="course_title" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
 dy={10}
 tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
 />
 <YAxis 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 11 }}
 tickFormatter={(value) => `₦${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
 />
 <Tooltip 
 cursor={{ fill: isDark ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
 contentStyle={{ 
 backgroundColor: isDark ? '#18181b' : '#ffffff', 
 borderColor: isDark ? '#27272a' : '#e4e4e7',
 borderRadius: '12px',
 fontSize: '13px',
 color: isDark ? '#e4e4e7' : '#18181b',
 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
 }}
 itemStyle={{ color: isDark ? '#34d399' : '#10b981', fontWeight: 500 }}
 labelStyle={{ color: isDark ? '#a1a1aa' : '#71717a', marginBottom: '4px' }}
 formatter={(value: any) => [`₦${Number(value || 0).toLocaleString()}`, 'Revenue']}
 />
 <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
 {revPerCourse.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={isDark ?"#34d399" :"#10b981"} />
))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
) : (
 <div className="flex-1 flex items-center justify-center">
 <p className="text-xs text-zinc-600">No revenue data yet</p>
 </div>
)}
 </div>
 </div>

 {/* Recent Orders */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 shadow-sm dark:shadow-none">
 <div className="flex items-center gap-2 mb-5">
 <ShoppingCart className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Recent Orders</h3>
 </div>
 <RecentOrdersTable orders={recentOrders} />
 </div>
 </div>
)
}

// ─── Skeleton ─────────────────────────────────────────────
function LoadingSkeleton() {
 return (
 <div className="space-y-8 animate-pulse">
 <div>
 <div className="h-8 w-56 bg-zinc-200 dark:bg-zinc-800/60 rounded-lg" />
 <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800/40 rounded mt-2" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {[1, 2, 3, 4].map((i) => (
 <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30">
 <div className="h-11 w-11 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
 <div>
 <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-800/60 rounded" />
 <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800/40 rounded mt-2" />
 </div>
 </div>
))}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {[1, 2].map((i) => (
 <div key={i} className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6">
 <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800/60 rounded mb-4" />
 <div className="h-48 bg-zinc-100 dark:bg-zinc-800/30 rounded-xl" />
 </div>
))}
 </div>
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6">
 <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800/60 rounded mb-4" />
 <div className="space-y-3">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="h-10 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg" />
))}
 </div>
 </div>
 </div>
)
}
