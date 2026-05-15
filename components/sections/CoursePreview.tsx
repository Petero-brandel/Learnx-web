'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { api } from '@/lib/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

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
 const swiperRef = useRef<SwiperType | null>(null);

 useEffect(() => {
 api.get('/courses/')
  .then(res => {
   console.log("Fetched courses:", res.data);
   setCourses(res.data.slice(0, 8));
  })
  .catch((err) => {
   console.error("Failed to fetch courses:", err);
  })
  .finally(() => setLoading(false));
 }, []);

 return (
 <section id="courses" className="py-28 px-4 sm:px-6 lg:px-8 bg-transparent">
     <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Section header */}
  <Reveal>
   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
   <div>
    <p className="text-sm font-semibold uppercase tracking-widest text-blue-500 mb-4">
    Popular Courses
    </p>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
    Start learning today
    </h2>
   </div>

   <div className="flex items-center gap-3">
    {/* Navigation arrows */}
    <button
    onClick={() => swiperRef.current?.slidePrev()}
    className="h-10 w-10 rounded-full border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-200 disabled:opacity-40"
    aria-label="Previous courses"
    >
    <ChevronLeft className="h-5 w-5" />
    </button>
    <button
    onClick={() => swiperRef.current?.slideNext()}
    className="h-10 w-10 rounded-full border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-200 disabled:opacity-40"
    aria-label="Next courses"
    >
    <ChevronRight className="h-5 w-5" />
    </button>

    <Link
    href="/courses"
    className="group hidden md:inline-flex items-center gap-2 ml-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
    >
    View all
    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Link>
   </div>
   </div>
  </Reveal>

  {/* Loading skeleton */}
    {loading && (
     <div className="flex gap-6 overflow-hidden">
     {[1, 2, 3].map((i) => (
        <div key={i} className="min-w-[300px] flex-1 rounded-2xl border border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden animate-pulse">
        <div className="h-48 bg-zinc-200 dark:bg-zinc-700" />
        <div className="p-6 space-y-3">
         <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
         <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
         <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
         <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        </div>
     ))}
     </div>
    )}

  {/* No courses state */}
   {!loading && courses.length === 0 && (
    <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-white/5">
    <BookOpen className="h-10 w-10 text-zinc-400 dark:text-zinc-300 mx-auto mb-3" />
    <p className="text-zinc-500 dark:text-zinc-400">No courses available yet. Check back soon!</p>
    </div>
   )}

  {/* Swiper carousel */}
  {!loading && courses.length > 0 && (
   <div
   onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
   onMouseLeave={() => swiperRef.current?.autoplay?.start()}
   >
   <Swiper
    onSwiper={(swiper) => { swiperRef.current = swiper; }}
    modules={[Autoplay, Navigation]}
    spaceBetween={20}
    slidesPerView={1}
    breakpoints={{
    640: { slidesPerView: 2.2, spaceBetween: 20 },
    1024: { slidesPerView: 3.15, spaceBetween: 24 },
    }}
    autoplay={{
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    }}
    loop={courses.length > 3}
    speed={600}
    className="pb-4"
   >
    {courses.map((course) => {
    const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
    const moduleCount = course.modules?.length || 0;

    return (
   <SwiperSlide key={course.id}>
   <Link
    href={`/courses/${course.slug}`}
    className="group flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300"
   >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
      {course.thumbnail ? (
       <Image
       src={course.thumbnail}
       alt={course.title}
       fill
       className="object-cover transition-transform duration-500 group-hover:scale-105"
       sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
       />
      ) : (
       <div className="flex items-center justify-center h-full w-full bg-zinc-100">
       <BookOpen className="h-10 w-10 text-zinc-300" />
       </div>
      )}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
      <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
       {course.title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1 line-clamp-2">
       {course.description || 'No description available.'}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-400 mb-4">
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
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700">
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

  {/* Mobile "View all" link */}
  <div className="mt-8 text-center md:hidden">
   <Link
   href="/courses"
   className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
   >
   View all courses
   <ArrowRight className="h-4 w-4" />
   </Link>
  </div>
  </div>
 </section>
 );
}
