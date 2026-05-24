'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Layers, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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

export function CourseGrid() {
  const searchParams = useSearchParams();
  const defaultFilter = searchParams.get('filter') === 'free' ? 'free' : 'all';

  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>(defaultFilter as any);

 useEffect(() => {
 api.get('/courses/')
 .then(res => setCourses(res.data))
 .catch(() => {})
 .finally(() => setLoading(false));
 }, []);

 const filtered = courses.filter((course) => {
 const searchLower = search.toLowerCase();
 const matchesSearch =
 course.title.toLowerCase().includes(searchLower) ||
 (course.description || '').toLowerCase().includes(searchLower) ||
 (searchLower === 'free' && Number(course.price) === 0);

 let matchesFilter = true;
 if (filter === 'free') matchesFilter = Number(course.price) === 0;
 if (filter === 'paid') matchesFilter = Number(course.price) > 0;

 return matchesSearch && matchesFilter;
 });

 return (
 <section className="px-4 sm:px-6 lg:px-8 pb-28">
 <div className="max-w-7xl mx-auto">
 {/* ─── Search ─── */}
 <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
 <div className="relative w-full md:w-80">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
 <input
 type="text"
 placeholder="Search courses..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
 />
 </div>
 
 <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
 {(['all', 'free', 'paid'] as const).map((f) => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={cn(
 "px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors",
 filter === f 
 ? "bg-zinc-900 text-white" 
 : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
 )}
 >
 {f === 'all' ? 'All Courses' : `${f} Courses`}
 </button>
 ))}
 </div>
 </div>

 {/* ─── Results count ─── */}
 {!loading && (
 <p className="text-sm text-zinc-500 mb-6">
 Showing <span className="font-semibold text-zinc-900">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
 </p>
)}

 {/* ─── Loading ─── */}
 {loading && (
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {[1, 2, 3, 4, 5, 6].map((i) => (
 <div key={i} className="rounded-2xl border border-zinc-100 bg-white overflow-hidden animate-pulse">
 <div className="h-44 bg-zinc-200" />
 <div className="p-6 space-y-3">
 <div className="h-5 w-3/4 bg-zinc-200 rounded" />
 <div className="h-3 w-full bg-zinc-200 rounded" />
 <div className="h-3 w-2/3 bg-zinc-200 rounded" />
 <div className="h-8 w-24 bg-zinc-200 rounded mt-4" />
 </div>
 </div>
))}
 </div>
)}

 {/* ─── Course grid ─── */}
 {!loading && filtered.length > 0 && (
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {filtered.map((course) => {
 const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
 const moduleCount = course.modules?.length || 0;

 return (
 <Link
 key={course.id}
 href={`/courses/${course.slug}`}
 className="group flex flex-col rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:shadow-sm hover:border-zinc-300 transition-all duration-300"
 >
 {/* Thumbnail */}
 <div className="relative h-44 w-full overflow-hidden flex items-center justify-center bg-zinc-100">
 {course.thumbnail ? (
 <Image 
 src={course.thumbnail} 
 alt={course.title}
 fill
 className="object-cover transition-transform duration-500 group-hover:scale-105"
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
 <h3 className="text-lg font-bold mb-2 text-zinc-900 group-hover:text-blue-600 transition-colors">
 {course.title}
 </h3>
 <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-1 line-clamp-2">
 {course.description || 'No description available.'}
 </p>

 {/* Meta */}
 <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
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
 <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
 <span className="text-lg font-bold text-zinc-900">
 {Number(course.price) === 0 ? 'Free' : formatPrice(course.price)}
 </span>
 </div>
 </div>
 </Link>
);
 })}
 </div>
)}

 {/* ─── Empty state ─── */}
 {!loading && filtered.length === 0 && (
 <div className="text-center py-20">
 <BookOpen className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
 <p className="text-zinc-400 text-lg mb-2">No courses found</p>
 <p className="text-zinc-400 text-sm">
 {search ? 'Try adjusting your search.' : 'No courses are published yet. Check back soon!'}
 </p>
 </div>
)}
 </div>
 </section>
);
}
