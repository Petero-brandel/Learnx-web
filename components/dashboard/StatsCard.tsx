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
 "relative p-4 rounded-[20px] border border-zinc-200 dark:border-zinc-800 transition-all duration-300",
 "bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm flex flex-col justify-between shrink-0 snap-start",
 "min-w-[140px] w-[140px] md:w-auto md:min-w-0"
 )}
 >
 <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800", iconColor)}>
 <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
 </div>
 
 <div className="mb-1.5 flex-1 flex flex-col justify-end">
 <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</p>
 </div>

 <div>
 <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 leading-tight">
 {label}
 </p>
 </div>
 </div>
 )
}
