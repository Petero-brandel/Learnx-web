import { cn } from '@/lib/utils'

interface AdminStatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
 color?: 'green' | 'blue' | 'slate' | 'amber'
 className?: string
}

const solidStyles = {
  green: {
    card: 'bg-emerald-600 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-700',
    iconBg: 'bg-emerald-500/30 border-emerald-400/20',
    iconColor: 'text-white',
    value: 'text-white',
    label: 'text-emerald-100',
    sub: 'text-emerald-200/70',
    naira: 'text-emerald-200/80',
  },
  blue: {
    card: 'bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-700',
    iconBg: 'bg-blue-500/30 border-blue-400/20',
    iconColor: 'text-white',
    value: 'text-white',
    label: 'text-blue-100',
    sub: 'text-blue-200/70',
    naira: 'text-blue-200/80',
  },
  slate: {
    card: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/70',
    iconBg: 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-700/70',
    iconColor: 'text-slate-600 dark:text-slate-400',
    value: 'text-zinc-900 dark:text-zinc-100',
    label: 'text-zinc-600 dark:text-zinc-400',
    sub: 'text-zinc-400 dark:text-zinc-500',
    naira: 'text-zinc-400 dark:text-zinc-500',
  },
  amber: {
    card: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/70',
    iconBg: 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-700/70',
    iconColor: 'text-amber-600 dark:text-amber-400',
    value: 'text-zinc-900 dark:text-zinc-100',
    label: 'text-zinc-600 dark:text-zinc-400',
    sub: 'text-zinc-400 dark:text-zinc-500',
    naira: 'text-zinc-400 dark:text-zinc-500',
  },
}

export default function AdminStatsCard({ icon: Icon, label, value, sub, color = 'green', className }: AdminStatsCardProps) {
 const style = solidStyles[color]

 // Safely format the Naira symbol to prevent font overlapping issues
 const isNaira = typeof value === 'string' && value.includes('₦')
 const displayValue = isNaira ? value.replace('₦', '') : value

 return (
 <div
 className={cn(
 "relative p-4 rounded-[20px] border transition-all duration-300",
 "hover:shadow-md flex flex-col justify-between shrink-0 snap-start",
 "w-[150px] sm:w-auto",
 style.card,
 className
 )}
 >
 <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-4 border", style.iconBg, style.iconColor)}>
 <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
 </div>
 
 <div className="mb-1.5 flex-1 flex flex-col justify-end">
 <p className={cn("text-2xl font-bold tracking-tight flex items-baseline gap-0.5", style.value)}>
 {isNaira && <span className={cn("text-sm font-sans font-medium", style.naira)}>₦</span>}
 {displayValue}
 </p>
 </div>

 <div>
 <p className={cn("text-[13px] font-medium leading-tight", style.label)}>
 {label}
 </p>
 {sub && (
 <p className={cn("text-[11px] mt-0.5 font-medium truncate", style.sub)}>
 {sub}
 </p>
 )}
 </div>
 </div>
 )
}
