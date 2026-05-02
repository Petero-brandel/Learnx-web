import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const courses = [
  {
    title: 'Mastering Prompt Engineering',
    category: 'AI & Logic',
    description: 'Learn to craft prompts that get exactly the output you need from any AI model.',
    price: '₦25,000',
    rating: 4.9,
    students: 1240,
    duration: '8 weeks',
    badge: 'Bestseller',
    image: '/images/courses/course-1.jpg',
  },
  {
    title: 'AI Content Creation',
    category: 'Marketing',
    description: 'Generate blog posts, ad copy, social media content, and visuals using AI tools.',
    price: '₦20,000',
    rating: 4.8,
    students: 980,
    duration: '6 weeks',
    badge: 'Popular',
    image: '/images/courses/course-2.jpg',
  },
  {
    title: 'Digital Marketing Mastery',
    category: 'Growth',
    description: 'From SEO to paid ads — master the strategies that drive real business results.',
    price: '₦30,000',
    rating: 4.7,
    students: 1560,
    duration: '10 weeks',
    badge: 'New',
    image: '/images/courses/course-3.jpg',
  },
];

export function CoursePreview() {
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

        {/* Course cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <Reveal key={idx} delay={idx * 100}>
              <Link
                href="/courses"
                className="group flex flex-col h-full rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 overflow-hidden hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card thumbnail */}
                <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-white/90 dark:bg-black/60 text-zinc-900 dark:text-white backdrop-blur-sm shadow-sm">
                    {course.badge}
                  </span>
                </div>

                {/* Card body */}
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
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{course.price}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
