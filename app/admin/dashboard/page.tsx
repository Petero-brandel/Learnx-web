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

  // Popular courses for bar visualization
  const popularCourses = coursePerf?.popular_courses || []
  const maxEnrollments = Math.max(...popularCourses.map(c => c.total_enrollments), 1)

  // Revenue per course
  const revPerCourse = revenue?.revenue_per_course || []
  const maxRevCourse = Math.max(...revPerCourse.map(c => Number(c.total)), 1)

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
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Popular Courses</h3>
          </div>
          {popularCourses.length > 0 ? (
            <div className="space-y-3">
              {popularCourses.map((course, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-medium truncate max-w-[70%]">{course.course_title}</span>
                    <span className="text-zinc-500">{course.total_enrollments} enrolled</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
                      style={{ width: `${(course.total_enrollments / maxEnrollments) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-600 text-center py-8">No enrollment data yet</p>
          )}
        </div>

        {/* Revenue Per Course */}
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Revenue Per Course</h3>
          </div>
          {revPerCourse.length > 0 ? (
            <div className="space-y-3">
              {revPerCourse.map((course, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-medium truncate max-w-[60%]">{course.course_title}</span>
                    <span className="text-emerald-400 font-semibold">
                      ₦{Number(course.total).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${(Number(course.total) / maxRevCourse) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-600 text-center py-8">No revenue data yet</p>
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
