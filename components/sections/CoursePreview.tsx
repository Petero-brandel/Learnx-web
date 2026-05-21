'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Reveal } from '@/components/ui/Reveal';
import { api } from '@/lib/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

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
  const [mounted, setMounted] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    api
      .get('/courses/')
      .then((res) => {
        console.log('Fetched courses:', res.data);
        setCourses(res.data.slice(0, 8));
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Proper Swiper cleanup
  useEffect(() => {
    return () => {
      swiperRef.current?.destroy(true, true);
    };
  }, []);

  return (
    <section
      id="courses"
      className="bg-transparent py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-500">
                Popular Courses
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                Start learning today
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Prev Button */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-200 hover:border-zinc-400 hover:text-zinc-900 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
                aria-label="Previous courses"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-200 hover:border-zinc-400 hover:text-zinc-900 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white"
                aria-label="Next courses"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <Link
                href="/courses"
                className="group ml-3 hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 md:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[300px] flex-1 overflow-hidden rounded-2xl border border-zinc-100 bg-white animate-pulse dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-700" />

                <div className="space-y-3 p-6">
                  <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/50 py-20 text-center dark:border-zinc-700 dark:bg-white/5">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-300" />

            <p className="text-zinc-500 dark:text-zinc-400">
              No courses available yet. Check back soon!
            </p>
          </div>
        )}

        {/* Swiper */}
        {mounted && !loading && courses.length > 0 && (
          <div
            onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => swiperRef.current?.autoplay?.start()}
          >
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Autoplay, Navigation]}
              observer={true}
              observeParents={true}
              rewind={true}
              loop={false}
              speed={600}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3.15,
                  spaceBetween: 24,
                },
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="pb-4"
            >
              {courses.map((course) => {
                const lessonCount =
                  course.modules?.reduce(
                    (sum, module) =>
                      sum + (module.lessons?.length || 0),
                    0
                  ) || 0;

                const moduleCount =
                  course.modules?.length || 0;

                return (
                  <SwiperSlide key={course.id}>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                    >
                      {/* Thumbnail */}
                      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            priority={false}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                            <BookOpen className="h-10 w-10 text-zinc-300 dark:text-zinc-500" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 text-lg font-bold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white">
                          {course.title}
                        </h3>

                        <p className="mb-6 flex-1 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {course.description ||
                            'No description available.'}
                        </p>

                        {/* Meta */}
                        <div className="mb-4 flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5" />
                            {moduleCount} module
                            {moduleCount !== 1 ? 's' : ''}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {lessonCount} lesson
                            {lessonCount !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-700">
                          <span className="text-lg font-bold text-zinc-900 dark:text-white">
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            View all courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}