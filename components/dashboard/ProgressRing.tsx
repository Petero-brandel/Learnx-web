'use client'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export default function ProgressRing({ percentage, size = 80, strokeWidth = 6 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference
  const isComplete = percentage === 100

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-200 dark:text-zinc-800"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={isComplete ? "text-emerald-500" : "dark:text-zinc-400"}
          style={{ 
            color: isComplete ? undefined : 'var(--color-learning-progress)',
            transition: 'stroke-dashoffset 0.7s ease-out'
          }}
        />
      </svg>
      {/* Percentage text */}
      <span className={`absolute text-sm font-bold ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {percentage}%
      </span>
    </div>
  )
}
