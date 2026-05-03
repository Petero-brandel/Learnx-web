import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  color?: 'pink' | 'blue' | 'gold'
}

const colorMap = {
  pink: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-900/30',
  },
  blue: {
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    icon: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-100 dark:border-sky-900/30',
  },
  gold: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/30',
  },
}

export default function StatsCard({ icon: Icon, label, value, color = 'pink' }: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300",
        "bg-white dark:bg-zinc-900/50 hover:shadow-md",
        colors.border,
        "min-w-[200px] snap-start shrink-0 md:shrink md:min-w-0"
      )}
    >
      <div className={cn("flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center", colors.bg)}>
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
