import { Suspense } from 'react';
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CourseGrid } from "@/components/sections/CourseGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalog | Bluedemy",
  description: "Browse our collection of expert-led courses in Prompt Engineering, AI Content Creation, Digital Marketing, and more.",
  alternates: {
    canonical: "/courses",
  },
};

export default function CoursesPage() {
 return (
 <div className="min-h-screen bg-white font-sans text-zinc-950 selection:bg-blue-500/30">
 <Navbar />
 <main className="pt-24">
 {/* Page header */}
 <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
 <div className="max-w-7xl mx-auto">
 <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-4">
 Course Catalog
 </p>
 <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
 Explore all courses
 </h1>
 <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
 Browse our collection of expert-led courses in Prompt Engineering, AI Content Creation, Digital Marketing, and more.
 </p>
 </div>
 </section>

 <Suspense fallback={<div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
 <CourseGrid />
 </Suspense>
 </main>
 <Footer />
 </div>
);
}
