'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import type { Enrollment } from '@/lib/dashboard'

interface CourseCardProps {
  enrollment: Enrollment
}

export default function CourseCard({ enrollment }: CourseCardProps) {
  const isComplete = enrollment.progress_percentage === 100

  return (
    <Link
      href={`/dashboard/courses/${enrollment.course_slug}`}
      className={cn(
        "group block rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98]",
        enrollment.is_active === false && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {enrollment.course_thumbnail ? (
          <img
            src={enrollment.course_thumbnail}
            alt={enrollment.course_title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <span className="text-4xl font-bold text-zinc-300 dark:text-zinc-600">
              {enrollment.course_title.charAt(0)}
            </span>
          </div>
        )}

        {/* Completion badge */}
        {enrollment.is_active === false ? (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500/90 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
            <AlertCircle className="h-3.5 w-3.5" />
            Deactivated
          </div>
        ) : isComplete && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
            <CheckCircle className="h-3.5 w-3.5" />
            Completed
          </div>
        )}


      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {enrollment.course_title}
        </h3>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Progress</span>
            <span className={cn(
              "text-[11px] font-bold",
              isComplete ? "text-emerald-600 dark:text-emerald-400" : "dark:text-zinc-400"
            )}
              style={{ color: isComplete ? undefined : 'var(--color-learning-progress)' }}>
              {enrollment.progress_percentage}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isComplete
                  ? "bg-emerald-500"
                  : "bg-zinc-600"
              )}
              style={{
                width: `${enrollment.progress_percentage}%`,
                backgroundColor: isComplete ? undefined : 'var(--color-learning-progress)'
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-xs font-semibold flex items-center gap-1 transition-colors",
            isComplete
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
          )}>
            {isComplete ? 'Review Course' : 'Continue Learning'}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
