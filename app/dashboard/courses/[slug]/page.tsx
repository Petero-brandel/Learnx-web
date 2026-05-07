'use client'

import { useState, useEffect, useMemo, use } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  fetchCourseDetail, fetchMyEnrollments, markLessonComplete,
  type CourseDetail, type Lesson, type Enrollment
} from '@/lib/dashboard'
import LessonPlayer from '@/components/dashboard/LessonPlayer'
import ModuleAccordion from '@/components/dashboard/ModuleAccordion'
import ProgressRing from '@/components/dashboard/ProgressRing'
import BottomSheet from '@/components/dashboard/BottomSheet'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Check,
  ListOrdered, Loader2
} from 'lucide-react'

const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || ''

export default function CoursePlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuth()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  // Flatten all lessons in order
  const allLessons = useMemo(() => {
    if (!course) return []
    return course.modules.flatMap(m => m.lessons)
  }, [course])

  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  useEffect(() => {
    async function load() {
      try {
        const [courseData, enrollments] = await Promise.all([
          fetchCourseDetail(slug),
          fetchMyEnrollments(),
        ])
        setCourse(courseData)

        // ── Enrollment check: only allow enrolled students ──
        const myEnrollment = enrollments.find(e => e.course_slug === slug)
        if (myEnrollment) {
          setEnrollment(myEnrollment)
          setProgress(myEnrollment.progress_percentage)

          // Set first lesson as active only if enrolled
          const firstLesson = courseData.modules[0]?.lessons[0]
          if (firstLesson) setActiveLesson(firstLesson)
        }
        // If no enrollment found, enrollment stays null → access denied screen
      } catch (err) {
        console.error('Failed to load course', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const handleMarkComplete = async () => {
    if (!activeLesson || marking || !enrollment) return
    setMarking(true)
    try {
      const result = await markLessonComplete(activeLesson.id)
      setCompletedLessons(prev => new Set([...prev, activeLesson.id]))
      setProgress(result.progress_percentage)

      // Auto-advance to next lesson
      if (nextLesson) {
        setTimeout(() => setActiveLesson(nextLesson), 600)
      }
    } catch (err) {
      console.error('Failed to mark lesson complete', err)
    } finally {
      setMarking(false)
    }
  }

  if (loading) return <CoursePlayerSkeleton />

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-zinc-500">Course not found.</p>
        <Link href="/dashboard" className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // ── ACCESS DENIED: User is not enrolled in this course ──
  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v.01M12 9v3m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 text-center">
          Not Enrolled
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-6">
          You don&apos;t have access to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{course.title}</span>. Purchase this course to unlock all lessons.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Course Details
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // ── DEACTIVATED: Enrollment is deactivated ──
  if (enrollment.is_active === false) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="h-16 w-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 text-center">
          Enrollment Deactivated
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-6">
          Your access to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{course.title}</span> has been deactivated. Please contact support to resolve this issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:support@bluedemy.com?subject=Deactivated Enrollment for Course"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Contact Support
          </a>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 md:-my-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 md:px-8 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate flex-1">
          {course.title}
        </h1>

        {/* Mobile modules button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-full transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
        >
          <ListOrdered className="h-3.5 w-3.5" />
          Modules
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* Left panel — lesson content */}
        <div className="flex-1 flex flex-col">
          {/* Video / content */}
          <div className="p-4 md:p-6">
            {activeLesson && (
              <LessonPlayer
                lesson={activeLesson}
                bunnyLibraryId={BUNNY_LIBRARY_ID}
                onQuizPassed={() => {
                  setCompletedLessons(prev => new Set([...prev, activeLesson.id]))
                  // Refetch enrollment to get updated progress
                  fetchMyEnrollments().then(enrollments => {
                    const updated = enrollments.find(e => e.course_slug === slug)
                    if (updated) setProgress(updated.progress_percentage)
                  })
                }}
              />
            )}
          </div>

          {/* Lesson info */}
          {activeLesson && (
            <div className="px-4 md:px-6 pb-4">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {activeLesson.title}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                {activeLesson.content_type}
              </span>
            </div>
          )}

          {/* Spacer pushes controls to bottom */}
          <div className="flex-1" />

          {/* Sticky bottom controls */}
          <div className="sticky bottom-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-4 md:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Previous */}
              <button
                onClick={() => prevLesson && setActiveLesson(prevLesson)}
                disabled={!prevLesson}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  prevLesson
                    ? "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    : "text-zinc-300 dark:text-zinc-700 bg-zinc-50 dark:bg-zinc-900 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Mark Complete — hidden for quiz lessons (quizzes auto-complete on pass) */}
              {activeLesson && activeLesson.content_type !== 'quiz' && !completedLessons.has(activeLesson.id) ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-60 active:scale-95"
                >
                  {marking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {marking ? 'Saving...' : 'Mark Complete'}
                </button>
              ) : activeLesson && completedLessons.has(activeLesson.id) ? (
                <div className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  Completed
                </div>
              ) : null}

              {/* Next */}
              <button
                onClick={() => nextLesson && setActiveLesson(nextLesson)}
                disabled={!nextLesson}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  nextLesson
                    ? "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    : "text-zinc-300 dark:text-zinc-700 bg-zinc-50 dark:bg-zinc-900 cursor-not-allowed"
                )}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel — course sidebar (desktop only) */}
        <aside className="hidden md:flex flex-col w-80 lg:w-96 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          {/* Progress header */}
          <div className="flex items-center gap-4 p-5 border-b border-zinc-200 dark:border-zinc-800">
            <ProgressRing percentage={progress} size={64} strokeWidth={5} />
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Course Progress</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {completedLessons.size} of {allLessons.length} lessons
              </p>
            </div>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {course.modules.map((module, i) => (
              <ModuleAccordion
                key={module.id}
                module={module}
                activeLesson={activeLesson}
                completedLessons={completedLessons}
                onSelectLesson={setActiveLesson}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </aside>
      </div>

      {/* Mobile bottom sheet for modules */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={`Modules · ${progress}% complete`}
      >
        <div className="space-y-3">
          {course.modules.map((module, i) => (
            <ModuleAccordion
              key={module.id}
              module={module}
              activeLesson={activeLesson}
              completedLessons={completedLessons}
              onSelectLesson={(lesson) => {
                setActiveLesson(lesson)
                setSheetOpen(false)
              }}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────
function CoursePlayerSkeleton() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 md:-my-8 animate-pulse">
      <div className="flex items-center gap-3 px-4 md:px-8 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded flex-1" />
      </div>
      <div className="flex">
        <div className="flex-1 p-4 md:p-6">
          <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="mt-4 space-y-2">
            <div className="h-6 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
          </div>
        </div>
        <aside className="hidden md:block w-80 lg:w-96 border-l border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
            </div>
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl mb-3" />
          ))}
        </aside>
      </div>
    </div>
  )
}
