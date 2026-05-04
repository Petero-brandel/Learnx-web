import { cn } from '@/lib/utils'

interface AdminStatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color?: 'green' | 'blue' | 'purple' | 'amber'
}

const colorMap = {
  green: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/5',
  },
  blue: {
    bg: 'bg-sky-500/10',
    icon: 'text-sky-400',
    border: 'border-sky-500/20',
    glow: 'shadow-sky-500/5',
  },
  purple: {
    bg: 'bg-indigo-500/10',
    icon: 'text-indigo-400',
    border: 'border-indigo-500/20',
    glow: 'shadow-indigo-500/5',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/5',
  },
}

export default function AdminStatsCard({ icon: Icon, label, value, sub, color = 'green' }: AdminStatsCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300",
        "bg-zinc-900/50 hover:bg-zinc-900/80 hover:shadow-lg",
        colors.border,
        colors.glow
      )}
    >
      <div className={cn("flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center", colors.bg)}>
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-zinc-100 tracking-tight truncate">{value}</p>
        <p className="text-xs font-medium text-zinc-500 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
