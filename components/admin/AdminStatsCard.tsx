import { cn } from '@/lib/utils'

interface AdminStatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
 color?: 'green' | 'blue' | 'purple' | 'amber'
 className?: string
}

const iconColorMap = {
  green: 'text-emerald-600 dark:text-emerald-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-blue-600 dark:text-blue-400',
  amber: 'text-amber-600 dark:text-amber-400',
}

export default function AdminStatsCard({ icon: Icon, label, value, sub, color = 'green', className }: AdminStatsCardProps) {
 const iconColor = iconColorMap[color]

 // Safely format the Naira symbol to prevent font overlapping issues
 const isNaira = typeof value === 'string' && value.includes('₦')
 const displayValue = isNaira ? value.replace('₦', '') : value

 return (
 <div
 className={cn(
 "relative p-4 rounded-[20px] border border-zinc-200 dark:border-zinc-800 transition-all duration-300",
 "bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm flex flex-col justify-between shrink-0 snap-start",
 "w-[150px] sm:w-auto", // fixed width on mobile for horizontal scroll, auto in grid
 className
 )}
 >
 <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800", iconColor)}>
 <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
 </div>
 
 <div className="mb-1.5 flex-1 flex flex-col justify-end">
 <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-baseline gap-0.5">
 {isNaira && <span className="text-sm font-sans text-zinc-400 dark:text-zinc-500 font-medium">₦</span>}
 {displayValue}
 </p>
 </div>

 <div>
 <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 leading-tight">
 {label}
 </p>
 {sub && (
 <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium truncate">
 {sub}
 </p>
 )}
 </div>
 </div>
 )
}
