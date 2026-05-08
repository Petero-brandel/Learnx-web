import { cn } from '@/lib/utils'

interface AdminStatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color?: 'green' | 'blue' | 'purple' | 'amber'
}

const iconColorMap = {
  green: 'text-emerald-600 dark:text-emerald-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-blue-600 dark:text-blue-400',
  amber: 'text-amber-600 dark:text-amber-400',
}

export default function AdminStatsCard({ icon: Icon, label, value, sub, color = 'green' }: AdminStatsCardProps) {
  const iconColor = iconColorMap[color]

  // Safely format the Naira symbol to prevent font overlapping issues
  const isNaira = typeof value === 'string' && value.includes('₦')
  const displayValue = isNaira ? value.replace('₦', '') : value

  return (
    <div
      className={cn(
        "relative overflow-hidden p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300",
        "bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <div className={cn("p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-baseline gap-0.5">
          {isNaira && <span className="text-xl font-sans text-zinc-400 dark:text-zinc-500 font-normal">₦</span>}
          {displayValue}
        </p>
        {sub && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 font-medium">
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}
