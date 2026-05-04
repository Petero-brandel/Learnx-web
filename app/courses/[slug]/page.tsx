'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchCourseDetail, fetchMyEnrollments } from '@/lib/dashboard';
import { checkoutCourse } from '@/lib/payments';
import Image from 'next/image';
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Star, Clock, Users, PlayCircle, CheckCircle, ArrowRight, BookOpen, Award } from 'lucide-react';

// ─── Placeholder course data (replace with API) ───
const coursesData: Record<string, {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  image?: string;
  gradient: string;
  instructor: { name: string; title: string; avatar: string };
  highlights: string[];
  modules: { title: string; lessons: number; duration: string }[];
}> = {
  'prompt-engineering': {
    title: 'Mastering Prompt Engineering',
    category: 'AI & Logic',
    description: 'Learn to craft prompts that get exactly the output you need from any AI model.',
    longDescription: 'This comprehensive course takes you from beginner to expert in prompt engineering. You will learn how to communicate effectively with AI models like ChatGPT, Claude, and Gemini to produce precise, high-quality outputs for any use case — writing, coding, analysis, and creative work.',
    price: '₦25,000',
    rating: 4.9,
    students: 1240,
    duration: '8 weeks',
    lessons: 42,
    image: '/images/courses/course-1.jpg',
    gradient: 'bg-indigo-600',
    instructor: { name: 'David Adekunle', title: 'AI Specialist & Educator', avatar: 'D' },
    highlights: [
      'Understand how LLMs process and interpret prompts',
      'Master zero-shot, few-shot, and chain-of-thought prompting',
      'Build reusable prompt templates for real-world tasks',
      'Automate workflows using AI agents and tools',
      'Earn a verified LearnX certificate',
    ],
    modules: [
      { title: 'Foundations of Prompt Engineering', lessons: 6, duration: '1.5 hrs' },
      { title: 'Advanced Prompting Techniques', lessons: 8, duration: '2 hrs' },
      { title: 'Prompting for Content & Copy', lessons: 7, duration: '1.5 hrs' },
      { title: 'Prompting for Code & Analysis', lessons: 7, duration: '2 hrs' },
      { title: 'Building AI Workflows', lessons: 8, duration: '2.5 hrs' },
      { title: 'Final Project & Certification', lessons: 6, duration: '3 hrs' },
    ],
  },
  'ai-content': {
    title: 'AI Content Creation Masterclass',
    category: 'Content & Marketing',
    description: 'Generate blog posts, ad copy, social media content, and visuals using AI tools.',
    longDescription: 'Learn to leverage AI tools to produce professional-grade content at scale. This course covers writing, image generation, video scripting, and social media strategy — all powered by AI. Perfect for freelancers, marketers, and business owners.',
    price: '₦20,000',
    rating: 4.8,
    students: 980,
    duration: '6 weeks',
    lessons: 36,
    image: '/images/courses/course-2.jpg',
    gradient: 'from-violet-500 to-purple-600',
    instructor: { name: 'Funmi Oladipo', title: 'Content Strategist', avatar: 'F' },
    highlights: [
      'Create blog posts and articles 10x faster with AI',
      'Generate social media content calendars automatically',
      'Use Midjourney and DALL·E for visual content',
      'Write high-converting ad copy and email sequences',
      'Build a personal brand with consistent AI-assisted content',
    ],
    modules: [
      { title: 'Introduction to AI Content', lessons: 5, duration: '1 hr' },
      { title: 'AI Writing Tools Deep Dive', lessons: 7, duration: '2 hrs' },
      { title: 'Visual Content with AI', lessons: 6, duration: '1.5 hrs' },
      { title: 'Social Media Automation', lessons: 8, duration: '2 hrs' },
      { title: 'Ad Copy & Email Marketing', lessons: 6, duration: '1.5 hrs' },
      { title: 'Portfolio Project', lessons: 4, duration: '2 hrs' },
    ],
  },
  'digital-marketing': {
    title: 'Digital Marketing Mastery',
    category: 'Growth & Strategy',
    description: 'From SEO to paid ads — master the strategies that drive real business results.',
    longDescription: 'A complete digital marketing program covering SEO, Google Ads, Meta Ads, email marketing, analytics, and conversion optimization. Built for entrepreneurs, marketers, and anyone looking to grow a business online.',
    price: '₦30,000',
    rating: 4.7,
    students: 1560,
    duration: '10 weeks',
    lessons: 58,
    image: '/images/courses/course-3.jpg',
    gradient: 'from-cyan-500 to-blue-600',
    instructor: { name: 'Chidi Nwachukwu', title: 'Growth Marketing Lead', avatar: 'C' },
    highlights: [
      'Master SEO fundamentals and advanced strategies',
      'Run profitable Google and Meta ad campaigns',
      'Build email funnels that convert',
      'Analyze data with Google Analytics 4',
      'Create a full digital marketing plan for any business',
    ],
    modules: [
      { title: 'Digital Marketing Foundations', lessons: 8, duration: '2 hrs' },
      { title: 'Search Engine Optimization', lessons: 10, duration: '3 hrs' },
      { title: 'Paid Advertising Mastery', lessons: 12, duration: '3.5 hrs' },
      { title: 'Email Marketing & Funnels', lessons: 8, duration: '2 hrs' },
      { title: 'Analytics & Optimization', lessons: 10, duration: '2.5 hrs' },
      { title: 'Capstone Project', lessons: 10, duration: '4 hrs' },
    ],
  },
  'ai-bootcamp': {
    title: 'AI Business Bootcamp',
    category: 'Business & AI',
    description: 'Transform your business operations and scale faster using AI automation and tools.',
    longDescription: 'This intensive bootcamp is designed for founders, managers, and operators who want to integrate AI into their daily business processes. Learn to automate customer support, streamline operations, and use data-driven AI for decision making.',
    price: '₦50,000',
    rating: 4.9,
    students: 520,
    duration: '4 weeks',
    lessons: 28,
    gradient: 'from-amber-500 to-orange-600',
    instructor: { name: 'David Adekunle', title: 'AI Specialist & Educator', avatar: 'D' },
    highlights: [
      'Automate repetitive business tasks with AI agents',
      'Deploy AI chatbots for customer service',
      'Optimize financial and operational data analysis',
      'Build custom internal tools using low-code + AI',
      'Develop an AI integration roadmap for your team',
    ],
    modules: [
      { title: 'AI for Business Strategy', lessons: 4, duration: '1.5 hrs' },
      { title: 'Automating Operations', lessons: 6, duration: '2 hrs' },
      { title: 'AI Customer Support Systems', lessons: 6, duration: '2.5 hrs' },
      { title: 'Data Analysis & Insights', lessons: 8, duration: '3 hrs' },
      { title: 'Final Business Implementation', lessons: 4, duration: '2 hrs' },
    ],
  },
  'social-media-growth': {
    title: 'Social Media Growth Hacks',
    category: 'Marketing',
    description: 'Master algorithms and organic growth strategies across TikTok, Instagram, and LinkedIn.',
    longDescription: 'Stop guessing what works on social media. This course breaks down the algorithms of major platforms and gives you a step-by-step blueprint for rapid, organic audience growth and monetization.',
    price: '₦15,000',
    rating: 4.6,
    students: 2100,
    duration: '5 weeks',
    lessons: 32,
    gradient: 'from-rose-500 to-pink-600',
    instructor: { name: 'Chioma E.', title: 'Viral Strategist', avatar: 'C' },
    highlights: [
      'Deconstruct the TikTok and Reels algorithms',
      'Write viral hooks and format short-form videos',
      'Build a loyal community on Instagram and Twitter',
      'Monetize a small audience effectively',
      'Use analytics to double down on winning content',
    ],
    modules: [
      { title: 'Understanding Algorithms', lessons: 5, duration: '1 hr' },
      { title: 'Short-Form Video Mastery', lessons: 8, duration: '2.5 hrs' },
      { title: 'Community Building Strategies', lessons: 6, duration: '1.5 hrs' },
      { title: 'Monetization Tactics', lessons: 7, duration: '2 hrs' },
      { title: 'Scaling Your Audience', lessons: 6, duration: '1.5 hrs' },
    ],
  },
  'chatgpt-mastery': {
    title: 'ChatGPT Complete Mastery',
    category: 'AI & Logic',
    description: 'From basics to advanced applications — become a ChatGPT power user in one weekend.',
    longDescription: 'This crash course covers everything you need to know about ChatGPT. Whether you are using it for personal productivity, coding, writing, or analysis, you will learn the hidden features and techniques to get the most out of the tool.',
    price: '₦10,000',
    rating: 4.8,
    students: 3400,
    duration: '2 weeks',
    lessons: 18,
    image: '/images/courses/course-3.jpg',
    gradient: 'from-emerald-500 to-teal-600',
    instructor: { name: 'David Adekunle', title: 'AI Specialist & Educator', avatar: 'D' },
    highlights: [
      'Master custom instructions and system prompts',
      'Build custom GPTs for specific tasks',
      'Use Advanced Data Analysis for spreadsheets',
      'Integrate ChatGPT with external tools via plugins',
      'Boost personal productivity by 50%',
    ],
    modules: [
      { title: 'ChatGPT Fundamentals', lessons: 4, duration: '1 hr' },
      { title: 'Advanced Use Cases', lessons: 5, duration: '1.5 hrs' },
      { title: 'Data Analysis & Coding', lessons: 5, duration: '1.5 hrs' },
      { title: 'Building Custom GPTs', lessons: 4, duration: '1 hr' },
    ],
  },
};

// Fallback for unknown slugs
const fallbackCourse = coursesData['prompt-engineering'];

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = coursesData[slug] || fallbackCourse;
  
  const [courseId, setCourseId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCourseDetail(slug)
      .then(data => setCourseId(data.id))
      .catch(err => console.error("Failed to fetch course detail from backend", err));
  }, [slug]);

  // Check if user is already enrolled in this course
  useEffect(() => {
    if (!user) return;
    fetchMyEnrollments()
      .then(enrollments => {
        const enrolled = enrollments.some(e => e.course_slug === slug);
        setIsEnrolled(enrolled);
      })
      .catch(err => console.error("Failed to check enrollment status", err));
  }, [user, slug]);

  const handleEnroll = async () => {
    if (!user) {
      if (courseId) {
        router.push(`/login?checkout=${courseId}`);
      } else {
        router.push('/login');
      }
      return;
    }

    // If already enrolled, redirect to the learning page
    if (isEnrolled) {
      router.push(`/dashboard/courses/${slug}`);
      return;
    }

    if (!courseId) {
      alert("Course ID not loaded yet. Please wait a moment.");
      return;
    }
    try {
      setIsCheckingOut(true);
      const res = await checkoutCourse(courseId);
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Checkout failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-16">
        {/* ─── Hero Banner ─── */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
          <Image 
            src={course.image || '/images/courses/course-1.jpg'} 
            alt={course.title} 
            fill 
            className="object-cover opacity-40 dark:opacity-30" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-zinc-900/40 dark:from-[#121212] dark:via-[#121212]/80 dark:to-[#121212]/50" />
          <div className="relative max-w-7xl mx-auto w-full z-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-4">
                {course.category}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
                {course.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">{course.rating}</span> rating
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {course.students.toLocaleString()} students
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PlayCircle className="h-4 w-4" />
                  {course.lessons} lessons
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Content Grid ─── */}
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
            {/* Left column — Details */}
            <div className="lg:col-span-2 space-y-16">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About this course</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                  {course.longDescription}
                </p>
              </div>

              {/* What you'll learn */}
              <div>
                <h2 className="text-2xl font-bold mb-6">What you&apos;ll learn</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Course curriculum</h2>
                <div className="space-y-3">
                  {course.modules.map((mod, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{mod.title}</p>
                          <p className="text-xs text-zinc-500">{mod.lessons} lessons · {mod.duration}</p>
                        </div>
                      </div>
                      <BookOpen className="h-4 w-4 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Your instructor</h2>
                <div className="flex items-center gap-4 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20">
                  <div className={`h-14 w-14 rounded-full ${course.gradient} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                    {course.instructor.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{course.instructor.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{course.instructor.title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — Purchase card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 shadow-lg">
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{course.price}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">One-time payment · Lifetime access</p>

                <button
                  onClick={handleEnroll}
                  disabled={isCheckingOut || (!isEnrolled && !courseId)}
                  className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-base hover:opacity-90 disabled:opacity-50 transition-opacity mb-4"
                >
                  {isCheckingOut ? 'Processing...' : (isEnrolled ? 'Continue Learning' : 'Enroll Now')}
                  {!isCheckingOut && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </button>

                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mb-8">
                  14-day money-back guarantee
                </p>

                <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <PlayCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    {course.lessons} on-demand video lessons
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    {course.duration} of content
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    Downloadable resources
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
