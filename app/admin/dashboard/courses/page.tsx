'use client'

import { useState, useEffect } from 'react'
import { fetchAllCourses, updateCourse, type AdminCourse } from '@/lib/admin'
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'
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
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<number | null>(null)
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
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Course Management</h1>
          <p className="text-sm text-zinc-500 mt-1">
            View and manage all courses. {published.length} published, {drafts.length} draft{drafts.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Link
          href="/admin/dashboard/courses/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl text-sm animate-fade-up-sm",
            feedback.type === 'success'
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          )}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span className="flex-1">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Course list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-zinc-800/30 border border-zinc-800/60" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20">
          <BookOpen className="h-10 w-10 text-zinc-700 mb-3" />
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
                className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Thumbnail */}
                  {course.thumbnail && (
                    <div className="flex-shrink-0 w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-zinc-800/50">
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
                          <h3 className="text-sm font-semibold text-zinc-200 truncate">{course.title}</h3>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                              course.is_published
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            )}
                          >
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{course.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                          <span>{formatPrice(course.price)}</span>
                          <span>{moduleCount} module{moduleCount !== 1 ? 's' : ''}</span>
                          <span>{lessonCount} lesson{lessonCount !== 1 ? 's' : ''}</span>
                          <span>Created {formatDate(course.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </Link>
                    <button
                      onClick={() => handleTogglePublish(course)}
                      disabled={toggling === course.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        course.is_published
                          ? "text-amber-400 hover:bg-amber-500/10"
                          : "text-emerald-400 hover:bg-emerald-500/10",
                        toggling === course.id && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {toggling === course.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : course.is_published ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                      {course.is_published ? 'Unpublish' : 'Publish'}
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
