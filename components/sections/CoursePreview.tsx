'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { api } from '@/lib/api';

interface PublicCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  thumbnail: string | null;
  is_published: boolean;
  created_at: string;
  modules: {
    id: number;
    title: string;
    lessons: { id: number }[];
  }[];
}

function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function CoursePreview() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/')
      .then(res => setCourses(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="courses" className="py-28 px-6 bg-zinc-50/50 dark:bg-[#181818]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
                Popular Courses
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Start learning today
              </h2>
            </div>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View all courses
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 overflow-hidden animate-pulse">
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No courses state */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30">
            <BookOpen className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
            <p className="text-zinc-500 dark:text-zinc-400">No courses available yet. Check back soon!</p>
          </div>
        )}

        {/* Course cards */}
        {!loading && courses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, idx) => {
              const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
              const moduleCount = course.modules?.length || 0;

              return (
                <Reveal key={course.id} delay={idx * 100}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="group flex flex-col h-full rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 overflow-hidden hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Card thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                      {course.thumbnail ? (
                        <Image 
                          src={course.thumbnail} 
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                          <BookOpen className="h-10 w-10 text-indigo-400/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1 line-clamp-2">
                        {course.description || 'No description available.'}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 mb-4">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5" />
                          {moduleCount} module{moduleCount !== 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          {formatPrice(course.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
