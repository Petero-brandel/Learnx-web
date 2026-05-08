'use client'

import { useState, useEffect } from 'react'
import { fetchAllCourses, updateCourse, deleteCourse, type AdminCourse } from '@/lib/admin'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Pencil, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

function formatDate(dateStr: string): string {
 return new Date(dateStr).toLocaleDateString('en-US', {
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 })
}

function formatPrice(price: string | number): string {
 return new Intl.NumberFormat('en-NG', {
 style: 'currency',
 currency: 'NGN',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0,
 }).format(Number(price))
}

export default function AdminCoursesPage() {
 const router = useRouter()
 const [courses, setCourses] = useState<AdminCourse[]>([])
 const [loading, setLoading] = useState(true)
 const [toggling, setToggling] = useState<number | null>(null)
 const [deleting, setDeleting] = useState<number | null>(null)
 const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

 useEffect(() => {
 fetchAllCourses()
 .then(setCourses)
 .catch(() => {})
 .finally(() => setLoading(false))
 }, [])

 const handleTogglePublish = async (course: AdminCourse) => {
 setToggling(course.id)
 setFeedback(null)
 try {
 const updated = await updateCourse(course.slug, { is_published: !course.is_published })
 setCourses((prev) =>
 prev.map((c) => (c.id === course.id ? { ...c, is_published: !c.is_published } : c))
)
 setFeedback({
 type: 'success',
 message: `"${course.title}" ${!course.is_published ? 'published' : 'unpublished'} successfully`,
 })
 } catch (err: any) {
 setFeedback({ type: 'error', message: err?.response?.data?.error || 'Failed to update course' })
 } finally {
 setToggling(null)
 }
 }

 const published = courses.filter((c) => c.is_published)
 const drafts = courses.filter((c) => !c.is_published)

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Course Management</h1>
 <p className="text-sm text-zinc-500 mt-1">
 View and manage all courses. {published.length} published, {drafts.length} draft{drafts.length !== 1 ? 's' : ''}.
 </p>
 </div>
 <Link
 href="/admin/dashboard/courses/new"
 className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
 >
 <Plus className="h-4 w-4" />
 Create Course
 </Link>
 </div>

 {/* Feedback */}
 {feedback && (
 <div
 className={cn(
 "flex items-center gap-3 p-4 rounded-xl text-sm border animate-fade-up-sm bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
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

 {/* Course list */}
 {loading ? (
 <div className="space-y-4 animate-pulse">
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800/60" />
))}
 </div>
) : courses.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
 <BookOpen className="h-10 w-10 text-zinc-400 dark:text-zinc-700 mb-3" />
 <p className="text-sm text-zinc-500">No courses created yet</p>
 </div>
) : (
 <div className="space-y-3">
 {courses.map((course) => {
 const moduleCount = course.modules?.length || 0
 const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0

 return (
 <div
 key={course.id}
 className="group rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm dark:shadow-none"
 >
 <div className="flex flex-col sm:flex-row sm:items-center gap-4">
 {/* Thumbnail */}
 {course.thumbnail && (
 <div className="flex-shrink-0 w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
 <img
 src={course.thumbnail}
 alt={course.title}
 className="w-full h-full object-cover"
 />
 </div>
)}

 {/* Info */}
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 truncate">{course.title}</h3>
 <span
 className={cn(
"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
 course.is_published
 ?"bg-emerald-500/10 text-emerald-400"
 :"bg-amber-500/10 text-amber-400"
)}
 >
 {course.is_published ? 'Published' : 'Draft'}
 </span>
 </div>
 <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{course.description || 'No description'}</p>
 <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 dark:text-zinc-600">
 <span>{formatPrice(course.price)}</span>
 <span>{moduleCount} module{moduleCount !== 1 ? 's' : ''}</span>
 <span>{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</span>
 <span>Created {formatDate(course.created_at)}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-3 shrink-0">
 {/* Edit */}
 <button
 onClick={() => router.push(`/admin/dashboard/courses/${course.slug}/edit`)}
 className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"
 title="Edit course"
 >
 <Pencil className="h-4 w-4" />
 </button>

 {/* Delete */}
 <button
 onClick={async () => {
 if (!confirm(`Are you sure you want to delete"${course.title}"? This will permanently remove all modules and lessons.`)) return
 setDeleting(course.id)
 try {
 await deleteCourse(course.slug)
 setCourses((prev) => prev.filter((c) => c.id !== course.id))
 setFeedback({ type: 'success', message: `"${course.title}" deleted successfully` })
 } catch {
 setFeedback({ type: 'error', message: `Failed to delete"${course.title}"` })
 } finally {
 setDeleting(null)
 }
 }}
 disabled={deleting === course.id}
 className={cn(
"p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all",
 deleting === course.id ?"opacity-50 cursor-not-allowed" :"opacity-0 group-hover:opacity-100"
)}
 title="Delete course"
 >
 {deleting === course.id ? (
 <Loader2 className="h-4 w-4 animate-spin" />
) : (
 <Trash2 className="h-4 w-4" />
)}
 </button>

 {/* Publish toggle */}
 <button
 onClick={() => handleTogglePublish(course)}
 disabled={toggling === course.id}
 className={cn(
"relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950",
 course.is_published ?"bg-emerald-500" :"bg-zinc-300 dark:bg-zinc-700",
 toggling === course.id &&"opacity-50 cursor-not-allowed"
)}
 title={course.is_published ? 'Unpublish course' : 'Publish course'}
 >
 {toggling === course.id ? (
 <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-white z-10" />
) : null}
 <span
 className={cn(
"pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
 course.is_published ?"translate-x-4" :"translate-x-0",
 toggling === course.id &&"opacity-0"
)}
 />
 </button>
 </div>
 </div>
 </div>
)
 })}
 </div>
)}
 </div>
)
}
