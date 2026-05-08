'use client'

import { useState } from 'react'
import type { RecentOrder } from '@/lib/admin'
import { ChevronDown } from 'lucide-react'

interface RecentOrdersTableProps {
 orders: RecentOrder[]
}

function formatCurrency(amount: number): string {
 return new Intl.NumberFormat('en-NG', {
 style: 'currency',
 currency: 'NGN',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0,
 }).format(amount)
}

function formatDate(dateStr: string): string {
 return new Date(dateStr).toLocaleDateString('en-US', {
 month: 'short',
 day: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 })
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
 const [visibleCount, setVisibleCount] = useState(10)

 if (orders.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/10">
 <p className="text-sm text-zinc-500">No orders yet</p>
 </div>
)
 }

 const visibleOrders = orders.slice(0, visibleCount)
 const hasMore = visibleCount < orders.length

 const handleShowMore = () => {
 setVisibleCount(prev => prev + 10)
 }

 return (
 <div className="flex flex-col space-y-4">
 <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800/60">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/50">
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Student</th>
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Course</th>
 <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
 <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
 </tr>
 </thead>
 <tbody>
 {visibleOrders.map((order) => (
 <tr
 key={order.id}
 className="border-b border-zinc-200 dark:border-zinc-800/30 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
 >
 <td className="px-4 py-3">
 <div className="flex items-center gap-2.5">
 <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
 <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
 {order.student.charAt(0).toUpperCase()}
 </span>
 </div>
 <span className="text-zinc-900 dark:text-zinc-300 font-medium dark:font-normal truncate max-w-[180px]">{order.student}</span>
 </div>
 </td>
 <td className="px-4 py-3 text-zinc-700 dark:text-zinc-400 truncate max-w-[200px]">{order.course}</td>
 <td className="px-4 py-3 text-right">
 <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(order.amount)}</span>
 </td>
 <td className="px-4 py-3 text-right text-zinc-500 text-xs whitespace-nowrap">{formatDate(order.date)}</td>
 </tr>
))}
 </tbody>
 </table>
 </div>
 
 {hasMore && (
 <div className="flex justify-center pt-2">
 <button 
 onClick={handleShowMore}
 className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none"
 >
 Show More
 <ChevronDown className="h-4 w-4" />
 </button>
 </div>
)}
 </div>
)
}
