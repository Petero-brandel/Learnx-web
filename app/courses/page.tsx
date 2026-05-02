import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CourseGrid } from "@/components/sections/CourseGrid";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-24">
        {/* Page header */}
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
              Course Catalog
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Explore all courses
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Browse our collection of expert-led courses in Prompt Engineering, AI Content Creation, Digital Marketing, and more.
            </p>
          </div>
        </section>

        <CourseGrid />
      </main>
      <Footer />
    </div>
  );
}
