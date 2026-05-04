'use client'

import { cn } from '@/lib/utils'

interface MiniChartProps {
  data: { label: string; value: number }[]
  color?: 'emerald' | 'sky' | 'indigo' | 'amber'
  height?: number
}

const gradientColors = {
  emerald: { stroke: '#34d399', fill: 'rgba(52, 211, 153, 0.1)', fillEnd: 'rgba(52, 211, 153, 0)' },
  sky: { stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', fillEnd: 'rgba(56, 189, 248, 0)' },
  indigo: { stroke: '#a78bfa', fill: 'rgba(167, 139, 250, 0.1)', fillEnd: 'rgba(167, 139, 250, 0)' },
  amber: { stroke: '#fbbf24', fill: 'rgba(251, 191, 36, 0.1)', fillEnd: 'rgba(251, 191, 36, 0)' },
}

export default function MiniChart({ data, color = 'emerald', height = 200 }: MiniChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-zinc-800/20 border border-zinc-800/40" style={{ height }}>
        <p className="text-xs text-zinc-600">No data available</p>
      </div>
    )
  }

  const colors = gradientColors[color]
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const padding = { top: 20, right: 16, bottom: 30, left: 12 }
  const svgWidth = 800
  const svgHeight = height
  const chartWidth = svgWidth - padding.left - padding.right
  const chartHeight = svgHeight - padding.top - padding.bottom

  // Generate data points
  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth,
    y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
    label: d.label,
    value: d.value,
  }))

  // Create smooth curve path
  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      const cpx1 = prev.x + (p.x - prev.x) / 3
      const cpx2 = p.x - (p.x - prev.x) / 3
      return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`
    })
    .join(' ')

  // Area fill path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  // X-axis labels (show max ~6)
  const labelInterval = Math.max(1, Math.floor(data.length / 6))
  const gradientId = `chart-gradient-${color}`

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.fill} />
            <stop offset="100%" stopColor={colors.fillEnd} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padding.top + chartHeight - frac * chartHeight
          return (
            <line
              key={frac}
              x1={padding.left}
              y1={y}
              x2={svgWidth - padding.right}
              y2={y}
              stroke="rgba(63, 63, 70, 0.3)"
              strokeDasharray="4 4"
            />
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={colors.stroke}
            opacity={i === points.length - 1 ? 1 : 0.4}
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % labelInterval !== 0 && i !== data.length - 1) return null
          const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth
          return (
            <text
              key={i}
              x={x}
              y={svgHeight - 6}
              textAnchor="middle"
              className="fill-zinc-600 text-[22px]"
            >
              {d.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
