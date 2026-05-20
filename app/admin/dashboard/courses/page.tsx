'use client'

import { useState, useEffect } from 'react'
import { fetchAllCourses, updateCourse, deleteCourse, type AdminCourse } from '@/lib/admin'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Pencil, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

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
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [pendingDelete, setPendingDelete] = useState<null | { id: number; slug: string; title: string }>(null)

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
 prev.map((c) => (c.id === course.id ? { ...c, is_published: !course.is_published } : c))
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

 const executeDeleteCourse = async () => {
    if (!pendingDelete) return
    const { id, slug, title } = pendingDelete
    setConfirmOpen(false)
    setDeleting(id)
    try {
      await deleteCourse(slug)
      setCourses((prev) => prev.filter((c) => c.id !== id))
      setFeedback({ type: 'success', message: `"${title}" deleted successfully` })
    } catch (err) {
      setFeedback({ type: 'error', message: `Failed to delete "${title}"` })
    } finally {
      setDeleting(null)
      setPendingDelete(null)
    }
  }

 const published = courses.filter((c) => c.is_published)
 const drafts = courses.filter((c) => !c.is_published)

 return (
 <div className="space-y-6">
		<ConfirmDialog
			open={confirmOpen}
			title={`Delete Course`}
			description={pendingDelete ? `Are you sure you want to delete "${pendingDelete.title}"? This will permanently remove all modules and lessons.` : undefined}
			confirmLabel="Delete"
			cancelLabel="Cancel"
			loading={deleting !== null}
			onConfirm={executeDeleteCourse}
			onCancel={() => { setConfirmOpen(false); setPendingDelete(null) }}
		/>
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

 {/* Course list */}
 {loading ? (
 <div className="space-y-4 animate-pulse">
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/60" />
))}
 </div>
) : courses.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700/70 bg-zinc-50 dark:bg-zinc-900/20">
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
 className="group rounded-[20px] border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/30 p-4 sm:p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors shadow-sm dark:shadow-none"
 >
 <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 h-full">
 {/* Thumbnail */}
 {course.thumbnail && (
 <div className="flex-shrink-0 w-full sm:w-40 h-40 sm:h-28 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
 <img
 src={course.thumbnail}
 alt={course.title}
 className="w-full h-full object-cover"
 />
 </div>
 )}

 {/* Info & Actions */}
 <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
 <div>
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0 flex-1">
 <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
 <h3 className="text-base sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{course.title}</h3>
 <span
 className={cn(
 "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase shrink-0",
 course.is_published
 ?"bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
 :"bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
 )}
 >
 {course.is_published ? 'Published' : 'Draft'}
 </span>
 </div>
 <p className="text-sm sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-3">
 {course.description || 'No description provided.'}
 </p>
 
 {/* Stats container */}
 <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
 <div className="flex items-center gap-1.5">
 <span className="text-zinc-900 dark:text-zinc-100 font-bold">{formatPrice(course.price)}</span>
 </div>
 <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
 <div className="flex items-center gap-1.5">
 <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
 <span>{moduleCount} module{moduleCount !== 1 ? 's' : ''}</span>
 </div>
 <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
 <div className="flex items-center gap-1.5">
 <Eye className="h-3.5 w-3.5 text-zinc-400" />
 <span>{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</span>
 </div>
 <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
 <span>{formatDate(course.created_at)}</span>
 </div>
 </div>

 {/* Desktop Actions */}
 <div className="hidden sm:flex items-center gap-2 shrink-0 ml-4">
 <button
 onClick={() => handleTogglePublish(course)}
 disabled={toggling === course.id}
 className={cn(
 "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40",
 course.is_published ?"bg-emerald-500" :"bg-zinc-300 dark:bg-zinc-700",
 toggling === course.id &&"opacity-50 cursor-not-allowed"
 )}
 title={course.is_published ? 'Unpublish' : 'Publish'}
 >
 {toggling === course.id && (
 <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-white z-10" />
 )}
 <span
 className={cn(
 "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
 course.is_published ?"translate-x-4" :"translate-x-0",
 toggling === course.id &&"opacity-0"
 )}
 />
 </button>

 <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

 <button
 onClick={() => router.push(`/admin/dashboard/courses/${course.slug}/edit`)}
 className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"
 title="Edit course"
 >
 <Pencil className="h-4 w-4" />
 </button>

 <button
 onClick={() => {
 setPendingDelete({ id: course.id, slug: course.slug, title: course.title })
 setConfirmOpen(true)
 }}
 disabled={deleting === course.id}
 className={cn(
 "p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all",
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
 </div>
 </div>
 </div>

 {/* Mobile Actions Footer */}
 <div className="sm:hidden mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <button
 onClick={() => handleTogglePublish(course)}
 disabled={toggling === course.id}
 className={cn(
 "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40",
 course.is_published ?"bg-emerald-500" :"bg-zinc-300 dark:bg-zinc-700",
 toggling === course.id &&"opacity-50 cursor-not-allowed"
 )}
 >
 {toggling === course.id && (
 <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-white z-10" />
 )}
 <span
 className={cn(
 "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
 course.is_published ?"translate-x-4" :"translate-x-0",
 toggling === course.id &&"opacity-0"
 )}
 />
 </button>
 <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
 {course.is_published ? 'Visible' : 'Hidden'}
 </span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={() => router.push(`/admin/dashboard/courses/${course.slug}/edit`)}
 className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
 >
 <Pencil className="h-4 w-4" />
 </button>
 <button
 onClick={() => {
 setPendingDelete({ id: course.id, slug: course.slug, title: course.title })
 setConfirmOpen(true)
 }}
 disabled={deleting === course.id}
 className={cn(
 "p-2 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors",
 deleting === course.id ?"opacity-50 cursor-not-allowed" :""
 )}
 >
 {deleting === course.id ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <Trash2 className="h-4 w-4" />
 )}
 </button>
 </div>
 </div>
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
