import Navbar from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { CoursePreview } from "@/components/sections/CoursePreview";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bluedemy | Master AI & Digital Skills",
  description: "Join Bluedemy to master AI, Content Creation, and Digital Marketing with expert-led practical courses designed to accelerate your career.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
 return (
 <div className="min-h-screen font-sans">
 <Navbar />
 <main>
 <Hero />
 {/* <Stats /> */}
 <Features />
 <CoursePreview />
 <Testimonials />
 <CTA />
 </main>
 <Footer />
 </div>
);
}
