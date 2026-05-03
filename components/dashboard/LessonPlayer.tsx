'use client'

import type { Lesson } from '@/lib/dashboard'
import { FileText, Download } from 'lucide-react'

interface LessonPlayerProps {
  lesson: Lesson
  bunnyLibraryId: string
}

export default function LessonPlayer({ lesson, bunnyLibraryId }: LessonPlayerProps) {
  if (lesson.content_type === 'video' && lesson.video_id) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${lesson.video_id}?autoplay=false&preload=true&responsive=true`}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (lesson.content_type === 'text' && lesson.text_content) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 md:p-8">
          <div
            className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.text_content }}
          />
        </div>
      </div>
    )
  }

  if (lesson.content_type === 'pdf' && lesson.file_url) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            PDF Resource
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 text-center">
            Download this lesson&apos;s resource file to continue.
          </p>
          <a
            href={lesson.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </div>
    )
  }

  // Quiz placeholder or unknown type
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This content type is not yet supported.
        </p>
      </div>
    </div>
  )
}
