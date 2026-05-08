import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  color?: 'pink' | 'blue' | 'gold'
}

const iconColorMap = {
  pink: 'text-blue-600 dark:text-blue-400',
  blue: 'text-sky-600 dark:text-sky-400',
  gold: 'text-amber-600 dark:text-amber-400',
}

export default function StatsCard({ icon: Icon, label, value, color = 'pink' }: StatsCardProps) {
  const iconColor = iconColorMap[color]

  return (
    <div
      className={cn(
        "relative overflow-hidden p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300",
        "bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm",
        "min-w-[200px] snap-start shrink-0 md:shrink md:min-w-0"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <div className={cn("p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</p>
      </div>
    </div>
  )
}
