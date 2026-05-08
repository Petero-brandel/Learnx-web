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
import { DollarSign, Users, BookOpen, TrendingUp, BarChart3, ShoppingCart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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
          fetchRevenueStats(),
          fetchUserStats(),
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
      }
    }
    loadData()
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (loading) {
    return <LoadingSkeleton />
  }

  // Generate the last 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const revenueMap = new Map((revenue?.revenue_over_time || []).map(d => [d.day, Number(d.total)]))
  const revenueChartData = last7Days.map(d => {
    const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: revenueMap.get(dayStr) || 0
    }
  })

  const signupsMap = new Map((userStats?.signups_over_time || []).map(d => [d.day, d.count]))
  const signupsChartData = last7Days.map(d => {
    const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: signupsMap.get(dayStr) || 0
    }
  })

  // Popular courses for bar visualization (Top 5 only)
  const popularCourses = (coursePerf?.popular_courses || []).slice(0, 5)

  // Revenue per course (Top 5 only)
  const revPerCourse = (revenue?.revenue_per_course || []).slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
          {getGreeting()}, {getFirstName(user?.full_name || '')}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">{today} &middot; Admin Dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(revenue?.revenue.all_time || 0)}
          sub={`₦${(revenue?.revenue.this_month || 0).toLocaleString()} this month`}
          color="green"
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
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Revenue (7 Days)</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Daily revenue trend</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 rounded-full px-3 py-1">
              <DollarSign className="h-3 w-3" />
              {formatCurrency(revenue?.revenue.this_month || 0)}
            </div>
          </div>
          <MiniChart data={revenueChartData} color="emerald" height={200} />
        </div>

        {/* Signups Chart */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">New Students (7 Days)</h3>
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
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Popular Courses</h3>
          </div>
          {popularCourses.length > 0 ? (
            <div className="flex-1 min-h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularCourses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#3f3f46" opacity={0.5} />
                  <XAxis 
                    dataKey="course_title" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    dy={10}
                    tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: '#e4e4e7',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: '#818cf8', fontWeight: 500 }}
                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                    formatter={(value: number) => [value, 'Enrollments']}
                  />
                  <Bar dataKey="total_enrollments" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {popularCourses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#818cf8" />
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
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Revenue Per Course</h3>
          </div>
          {revPerCourse.length > 0 ? (
            <div className="flex-1 min-h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revPerCourse} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#3f3f46" opacity={0.5} />
                  <XAxis 
                    dataKey="course_title" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    dy={10}
                    tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                    tickFormatter={(value) => `₦${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: '#e4e4e7',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: '#34d399', fontWeight: 500 }}
                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {revPerCourse.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#34d399" />
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
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingCart className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Recent Orders</h3>
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
        <div className="h-8 w-56 bg-zinc-800/60 rounded-lg" />
        <div className="h-4 w-36 bg-zinc-800/40 rounded mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/30">
            <div className="h-11 w-11 rounded-xl bg-zinc-800/60" />
            <div>
              <div className="h-7 w-16 bg-zinc-800/60 rounded" />
              <div className="h-3 w-24 bg-zinc-800/40 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
            <div className="h-5 w-40 bg-zinc-800/60 rounded mb-4" />
            <div className="h-48 bg-zinc-800/30 rounded-xl" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
        <div className="h-5 w-32 bg-zinc-800/60 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-zinc-800/30 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
