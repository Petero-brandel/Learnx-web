'use client'

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
  color?: 'emerald' | 'sky' | 'indigo' | 'amber'
  height?: number
}

const colorMap = {
  emerald: { stroke: '#34d399', fill: '#34d399' },
  sky: { stroke: '#38bdf8', fill: '#38bdf8' },
  indigo: { stroke: '#a78bfa', fill: '#a78bfa' },
  amber: { stroke: '#fbbf24', fill: '#fbbf24' },
}

export default function MiniChart({ data, color = 'emerald', height = 200 }: MiniChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-zinc-800/20 border border-zinc-800/40" style={{ height }}>
        <p className="text-xs text-zinc-600">No data available</p>
      </div>
    )
  }

  const activeColor = colorMap[color]

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={activeColor.fill} stopOpacity={0.2} />
              <stop offset="95%" stopColor={activeColor.fill} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#3f3f46" opacity={0.5} />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#a1a1aa', fontSize: 12 }} 
            dy={10}
            minTickGap={20}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#18181b', 
              borderColor: '#27272a',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#e4e4e7',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: activeColor.stroke, fontWeight: 500 }}
            labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(value: number) => [value, 'Total']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={activeColor.stroke}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#color-${color})`}
            activeDot={{ r: 5, fill: activeColor.stroke, stroke: '#18181b', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
