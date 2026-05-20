'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchEnrollments, toggleEnrollmentStatus, type AdminEnrollment } from '@/lib/admin'
import { GraduationCap, Search, ToggleLeft, ToggleRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDate(dateStr: string): string {
 return new Date(dateStr).toLocaleDateString('en-US', {
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 })
}

export default function EnrollmentsPage() {
 const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([])
 const [loading, setLoading] = useState(true)
 const [search, setSearch] = useState('')
 const [toggling, setToggling] = useState<number | null>(null)
 const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

 useEffect(() => {
 fetchEnrollments()
 .then(setEnrollments)
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [])

 const filtered = useMemo(() => {
 if (!search.trim()) return enrollments
 const q = search.toLowerCase()
 return enrollments.filter(
 (e) => e.student_email.toLowerCase().includes(q) || e.course_title.toLowerCase().includes(q)
)
 }, [enrollments, search])

 const handleToggle = async (enrollment: AdminEnrollment) => {
 setToggling(enrollment.id)
 setFeedback(null)
 try {
 const newStatus = !enrollment.is_active
 await toggleEnrollmentStatus({ enrollment_id: enrollment.id, is_active: newStatus })
 setEnrollments((prev) =>
 prev.map((e) => (e.id === enrollment.id ? { ...e, is_active: newStatus } : e))
)
 setFeedback({
 type: 'success',
 message: `Enrollment ${newStatus ? 'activated' : 'deactivated'} for ${enrollment.student_email}`,
 })
 } catch (err: any) {
 setFeedback({ type: 'error', message: err?.response?.data?.error || 'Failed to update enrollment' })
 } finally {
 setToggling(null)
 }
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Enrollment Management</h1>
 <p className="text-sm text-zinc-500 mt-1">View and manage all student enrollments across courses.</p>
 </div>

 {/* Feedback */}
 {feedback && (
 <div
 className={cn(
 "flex items-center gap-3 p-4 rounded-xl text-sm border animate-fade-up-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700/70 shadow-sm text-zinc-900 dark:text-zinc-100"
 )}
 >
 {feedback.type === 'success' ? (
 <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
 <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
 </div>
 ) : (
 <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
 <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
 </div>
 )}
 <span className="flex-1 font-medium">{feedback.message}</span>
 <button onClick={() => setFeedback(null)} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">
 Dismiss
 </button>
 </div>
 )}

 {/* Search bar */}
 <div className="relative max-w-md">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by student or course..."
 className="w-full rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all shadow-sm dark:shadow-none"
 />
 </div>

 {/* Table */}
 {loading ? (
 <div className="space-y-3 animate-pulse">
 {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
 <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg" />
))}
 </div>
) : filtered.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700/70 bg-zinc-50 dark:bg-zinc-900/20">
 <GraduationCap className="h-10 w-10 text-zinc-400 dark:text-zinc-700 mb-3" />
 <p className="text-sm text-zinc-500">{search ? 'No matching enrollments' : 'No enrollments found'}</p>
 </div>
) : (
 <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700/60">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-900/50">
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Student</th>
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Course</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Progress</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Enrolled</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</th>
 </tr>
 </thead>
 <tbody>
 {filtered.map((enrollment) => (
 <tr
 key={enrollment.id}
 className="border-b border-zinc-200 dark:border-zinc-700/30 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
 >
 <td className="px-4 py-3">
 <div className="flex items-center gap-2.5">
 <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
 <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
 {enrollment.student_email.charAt(0).toUpperCase()}
 </span>
 </div>
 <span className="text-zinc-900 dark:text-zinc-300 font-medium dark:font-normal truncate max-w-[180px]">{enrollment.student_email}</span>
 </div>
 </td>
 <td className="px-4 py-3 text-zinc-700 dark:text-zinc-400 truncate max-w-[180px]">{enrollment.course_title}</td>
 <td className="px-4 py-3 text-center">
 <div className="flex items-center justify-center gap-2">
 <div className="w-16 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800/60 overflow-hidden">
 <div
 className={cn(
"h-full rounded-full transition-all",
 enrollment.progress === 100
 ?"bg-emerald-400"
 : enrollment.progress > 50
 ?"bg-sky-400"
 :"bg-blue-400"
)}
 style={{ width: `${enrollment.progress}%` }}
 />
 </div>
 <span className="text-xs text-zinc-500 w-8 text-right">{enrollment.progress}%</span>
 </div>
 </td>
 <td className="px-4 py-3 text-center text-xs text-zinc-500 whitespace-nowrap">
 {formatDate(enrollment.enrolled_at)}
 </td>
 <td className="px-4 py-3 text-center">
 <span
 className={cn(
"inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold",
 enrollment.is_active
 ?"bg-emerald-500/10 text-emerald-400"
 :"bg-red-500/10 text-red-400"
)}
 >
 {enrollment.is_active ? 'Active' : 'Deactivated'}
 </span>
 </td>
 <td className="px-4 py-3 text-center">
 <button
 onClick={() => handleToggle(enrollment)}
 disabled={toggling === enrollment.id}
 className={cn(
"relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950",
 enrollment.is_active ?"bg-blue-600" :"bg-zinc-300 dark:bg-zinc-700",
 toggling === enrollment.id &&"opacity-50 cursor-not-allowed"
)}
 aria-label={enrollment.is_active ? 'Deactivate enrollment' : 'Activate enrollment'}
 >
 {toggling === enrollment.id ? (
 <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-white z-10" />
) : null}
 <span
 className={cn(
"pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
 enrollment.is_active ?"translate-x-4" :"translate-x-0",
 toggling === enrollment.id &&"opacity-0"
)}
 />
 </button>
 </td>
 </tr>
))}
 </tbody>
 </table>
 </div>
)}

 {/* Count */}
 {!loading && (
 <p className="text-xs text-zinc-600">
 Showing {filtered.length} of {enrollments.length} enrollment{enrollments.length !== 1 ? 's' : ''}
 </p>
)}
 </div>
)
}
