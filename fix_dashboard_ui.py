import os

path = '/home/kaielix/PROJECTS-WEB/LearnX/learnx-web/learnx/app/admin/dashboard/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# 1. State changes
state_old = """  const [coursePerf, setCoursePerf] = useState<CoursePerformance | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)"""

state_new = """  const [coursePerf, setCoursePerf] = useState<CoursePerformance | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [isPeriodLoading, setIsPeriodLoading] = useState(false)"""
content = content.replace(state_old, state_new)

# 2. UseEffect changes
effect_old = """  useEffect(() => {
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
  }, [])"""

effect_new = """  useEffect(() => {
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
  }, [period])"""
content = content.replace(effect_old, effect_new)

# 3. Chart Generation logic
chart_old = """  // Generate the last 7 days array
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
  })"""

chart_new = """  const getPeriodLabel = () => {
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
  }))"""
content = content.replace(chart_old, chart_new)

# 4. Header UI
header_old = """  {/* Welcome header */}
  <div>
  <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
  {getGreeting()}, {getFirstName(user?.full_name || '')}
  </h1>
  <p className="text-sm text-zinc-500 mt-1">{today} &middot; Admin Dashboard</p>
  </div>"""

header_new = """  {/* Welcome header */}
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
  </div>"""
content = content.replace(header_old, header_new)

# 5. Chart Titles
content = content.replace('Revenue (7 Days)', 'Revenue ({getPeriodLabel()})')
content = content.replace('New Students (7 Days)', 'New Students ({getPeriodLabel()})')

with open(path, 'w') as f:
    f.write(content)
print("Done frontend UI")
