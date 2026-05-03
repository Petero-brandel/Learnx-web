'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Module, Lesson } from '@/lib/dashboard'
import { ChevronDown, PlayCircle, FileText, CheckCircle, BookOpen } from 'lucide-react'

interface ModuleAccordionProps {
  module: Module
  activeLesson: Lesson | null
  completedLessons: Set<number>
  onSelectLesson: (lesson: Lesson) => void
  defaultOpen?: boolean
}

const contentTypeIcons: Record<string, React.ElementType> = {
  video: PlayCircle,
  text: BookOpen,
  pdf: FileText,
  quiz: CheckCircle,
}

export default function ModuleAccordion({
  module,
  activeLesson,
  completedLessons,
  onSelectLesson,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const completedCount = module.lessons.filter(l => completedLessons.has(l.id)).length

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      {/* Module header */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-left transition-colors",
          "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
          open && "bg-zinc-50 dark:bg-zinc-900/30"
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {module.title}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {completedCount}/{module.lessons.length} lessons
          </p>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ml-2",
          open && "rotate-180"
        )} />
      </button>

      {/* Lessons list */}
      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {module.lessons.map((lesson) => {
            const isActive = activeLesson?.id === lesson.id
            const isCompleted = completedLessons.has(lesson.id)
            const Icon = contentTypeIcons[lesson.content_type] || BookOpen

            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-left transition-all duration-150",
                  "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                  "border-l-2",
                  isActive
                    ? "border-l-indigo-600 dark:border-l-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10"
                    : "border-l-transparent",
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                  isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                    : isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20"
                      : "bg-zinc-100 dark:bg-zinc-800"
                )}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    )} />
                  )}
                </div>

                {/* Title */}
                <span className={cn(
                  "text-sm truncate flex-1",
                  isActive
                    ? "font-semibold text-indigo-600 dark:text-indigo-400"
                    : isCompleted
                      ? "text-zinc-500 dark:text-zinc-400 line-through decoration-zinc-300 dark:decoration-zinc-600"
                      : "text-zinc-700 dark:text-zinc-300"
                )}>
                  {lesson.title}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
