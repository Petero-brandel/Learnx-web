'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchCourseDetail, fetchMyEnrollments, type CourseDetail } from '@/lib/dashboard';
import { checkoutCourse } from '@/lib/payments';
import Image from 'next/image';
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Clock, PlayCircle, CheckCircle, ArrowRight, BookOpen, Award, Layers, Loader2 } from 'lucide-react';

function formatPrice(price: number | string): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCourseDetail(slug)
      .then(data => setCourse(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
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
      if (course) {
        router.push(`/login?checkout=${course.id}`);
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

    if (!course) {
      alert("Course data not loaded yet. Please wait a moment.");
      return;
    }
    try {
      setIsCheckingOut(true);
      const res = await checkoutCourse(course.id);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="pt-16">
          <div className="flex items-center justify-center py-40">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error / not found state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="pt-16">
          <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
            <BookOpen className="h-12 w-12 text-zinc-400 mb-4" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Course not found</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">This course doesn&apos;t exist or hasn&apos;t been published yet.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
  const moduleCount = course.modules?.length || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-16">
        {/* ─── Hero Banner ─── */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-zinc-900 dark:bg-zinc-950">
          {course.thumbnail && (
            <Image 
              src={course.thumbnail} 
              alt={course.title} 
              fill 
              className="object-cover opacity-40 dark:opacity-30" 
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-zinc-900/40 dark:from-[#121212] dark:via-[#121212]/80 dark:to-[#121212]/50" />
          <div className="relative max-w-7xl mx-auto w-full z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
                {course.description || 'Start your learning journey with this course.'}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  {moduleCount} module{moduleCount !== 1 ? 's' : ''}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PlayCircle className="h-4 w-4" />
                  {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
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
              {course.description && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">About this course</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                    {course.description}
                  </p>
                </div>
              )}

              {/* Curriculum */}
              {moduleCount > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Course curriculum</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    {moduleCount} module{moduleCount !== 1 ? 's' : ''} · {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-3">
                    {course.modules.map((mod, i) => (
                      <div
                        key={mod.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{mod.title}</p>
                            <p className="text-xs text-zinc-500">
                              {mod.lessons?.length || 0} lesson{(mod.lessons?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <BookOpen className="h-4 w-4 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column — Purchase card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 shadow-lg">
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{formatPrice(course.price)}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">One-time payment · Lifetime access</p>

                <button
                  onClick={handleEnroll}
                  disabled={isCheckingOut}
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
                    {lessonCount} on-demand lessons
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    {moduleCount} structured modules
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
