'use client'

import { useTheme } from 'next-themes'
import {
 Area,
 AreaChart,
 ResponsiveContainer,
 Tooltip,
 XAxis,
 CartesianGrid,
} from 'recharts'

interface MiniChartProps {
 data: { label: string; value: number }[]
 color?: 'emerald' | 'sky' | 'slate' | 'amber' | 'zinc'
 height?: number
}

const colorMap = {
 emerald: { stroke: '#34d399', fill: '#34d399', lightStroke: '#10b981' },
 sky: { stroke: '#38bdf8', fill: '#38bdf8', lightStroke: '#0ea5e9' },
 slate: { stroke: '#94a3b8', fill: '#94a3b8', lightStroke: '#64748b' },
 amber: { stroke: '#fbbf24', fill: '#fbbf24', lightStroke: '#f59e0b' },
 zinc: { stroke: '#e4e4e7', fill: '#e4e4e7', lightStroke: '#18181b' },
}

export default function MiniChart({ data, color = 'emerald', height = 200 }: MiniChartProps) {
 const { resolvedTheme } = useTheme()
 const isDark = resolvedTheme === 'dark'

 if (!data || data.length === 0) {
 return (
 <div className="flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-700/40" style={{ height }}>
 <p className="text-xs text-zinc-500 dark:text-zinc-600">No data available</p>
 </div>
)
 }

 const activeColor = colorMap[color]
 const strokeColor = isDark ? activeColor.stroke : activeColor.lightStroke

 return (
 <div style={{ width: '100%', height }}>
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
 <defs>
 <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
 <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ?"#3f3f46" :"#e4e4e7"} opacity={0.5} />
 <XAxis 
 dataKey="label" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fill: isDark ? '#a1a1aa' : '#71717a', fontSize: 12 }} 
 dy={10}
 minTickGap={20}
 />
 <Tooltip 
 contentStyle={{ 
 backgroundColor: isDark ? '#18181b' : '#ffffff', 
 borderColor: isDark ? '#27272a' : '#e4e4e7',
 borderRadius: '12px',
 fontSize: '13px',
 color: isDark ? '#e4e4e7' : '#18181b',
 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
 }}
 itemStyle={{ color: strokeColor, fontWeight: 500 }}
 labelStyle={{ color: isDark ? '#a1a1aa' : '#71717a', marginBottom: '4px' }}
 cursor={{ stroke: isDark ? '#52525b' : '#d4d4d8', strokeWidth: 1, strokeDasharray: '4 4' }}
 formatter={(value: any) => [value, 'Total']}
 />
 <Area
 type="monotone"
 dataKey="value"
 stroke={strokeColor}
 strokeWidth={2.5}
 fillOpacity={1}
 fill={`url(#color-${color})`}
 activeDot={{ r: 5, fill: strokeColor, stroke: isDark ? '#18181b' : '#ffffff', strokeWidth: 2 }}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
)
}
