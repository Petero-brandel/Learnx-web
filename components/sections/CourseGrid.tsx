'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Placeholder course data (replace with API later) ───
const allCourses = [
  {
    id: 'prompt-engineering',
    title: 'Mastering Prompt Engineering',
    category: 'AI & Logic',
    description: 'Learn to craft prompts that get exactly the output you need from any AI model.',
    price: '₦25,000',
    rating: 4.9,
    students: 1240,
    duration: '8 weeks',
    lessons: 42,
    badge: 'Bestseller',
    image: '/images/courses/course-1.jpg',
  },
  {
    id: 'ai-content',
    title: 'AI Content Creation Masterclass',
    category: 'Content & Marketing',
    description: 'Generate blog posts, ad copy, social media content, and visuals using AI tools.',
    price: '₦20,000',
    rating: 4.8,
    students: 980,
    duration: '6 weeks',
    lessons: 36,
    badge: 'Popular',
    image: '/images/courses/course-2.jpg',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    category: 'Growth & Strategy',
    description: 'From SEO to paid ads — master the strategies that drive real business results.',
    price: '₦30,000',
    rating: 4.7,
    students: 1560,
    duration: '10 weeks',
    lessons: 58,
    badge: 'New',
    image: '/images/courses/course-3.jpg',
  },
  {
    id: 'ai-bootcamp',
    title: 'AI Business Bootcamp',
    category: 'AI & Automation',
    description: 'Automate your workflows, build AI-powered tools, and scale your business.',
    price: '₦45,000',
    rating: 4.9,
    students: 640,
    duration: '12 weeks',
    lessons: 64,
    badge: 'Premium',
    image: '/images/courses/course-1.jpg',
  },
  {
    id: 'social-media-growth',
    title: 'Social Media Growth Hacking',
    category: 'Growth & Strategy',
    description: 'Grow your audience organically on Instagram, TikTok, Twitter, and LinkedIn.',
    price: '₦15,000',
    rating: 4.6,
    students: 2100,
    duration: '4 weeks',
    lessons: 24,
    badge: null,
    image: '/images/courses/course-2.jpg',
  },
  {
    id: 'chatgpt-mastery',
    title: 'ChatGPT for Professionals',
    category: 'AI & Logic',
    description: 'Use ChatGPT to 10x your productivity in writing, research, coding, and analysis.',
    price: '₦18,000',
    rating: 4.8,
    students: 1820,
    duration: '5 weeks',
    lessons: 30,
    badge: 'Trending',
    image: '/images/courses/course-3.jpg',
  },
];

const categories = ['All', 'AI & Logic', 'Content & Marketing', 'Growth & Strategy', 'AI & Automation'];

export function CourseGrid() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="px-6 pb-28">
      <div className="max-w-7xl mx-auto">
        {/* ─── Filters ─── */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
            <Filter className="h-4 w-4 text-zinc-400 flex-shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                  activeCategory === cat
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent'
                    : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Results count ─── */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* ─── Course grid ─── */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group flex flex-col rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 overflow-hidden hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  {course.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-white/90 dark:bg-black/60 text-zinc-900 dark:text-white backdrop-blur-sm shadow-sm">
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                    {course.category}
                  </p>
                  <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 flex-1">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      {course.rating}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.students.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{course.price}</span>
                    <span className="text-xs text-zinc-400">{course.lessons} lessons</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 dark:text-zinc-500 text-lg mb-2">No courses found</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
