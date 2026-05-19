import Navbar from"@/components/layout/Navbar";
import { Footer } from"@/components/sections/Footer";
import Image from"next/image";

const values = [
 {
 title: 'Practical First',
 description: 'Every course is built around real-world projects and exercises, not just theory.',
 gradient: 'bg-blue-600',
 },
 {
 title: 'Always Current',
 description: 'Our curriculum is updated continuously to reflect the latest tools and industry trends.',
 gradient: ' ',
 },
 {
 title: 'Learn by Doing',
 description: 'Hands-on projects in every module ensure you can apply skills immediately.',
 gradient: ' ',
 },
 {
 title: 'Community Driven',
 description: 'Join a thriving community of learners, mentors, and industry professionals.',
 gradient: ' ',
 },
];

const stats = [
 { value: '10,000+', label: 'Active Students' },
 { value: '25+', label: 'Expert-Led Courses' },
 { value: '95%', label: 'Completion Rate' },
 { value: '50+', label: 'Industry Partners' },
];

const team = [
 {
 name: 'David Adekunle',
 role: 'Founder & Lead Instructor',
 image: '/images/avatars/avatar-1.png',
 bio: 'Designs the hands-on learning paths that help students ship real projects fast.',
 },
 {
 name: 'Funmi Oladipo',
 role: 'Head of Content',
 image: '/images/avatars/avatar-2.png',
 bio: 'Leads curriculum quality and ensures every lesson is practical, clear, and current.',
 },
];

export default function AboutPage() {
 return (
 <div className="min-h-screen bg-white dark:bg-[#121212] font-sans text-zinc-950 dark:text-zinc-50 selection:bg-blue-500/30">
 <Navbar />
 <main>
 {/* ─── Hero ─── */}
 <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
 <div className="max-w-4xl mx-auto text-center">
 <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
 Our Story
 </p>
 <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
 Building the future of{' '}
 <span className="text-blue-600 dark:text-blue-400">
 digital education
 </span>
 </h1>
 <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
 Bluedemy was founded with a singular mission: to make cutting-edge AI and digital
 skills accessible to everyone, regardless of background or experience level.
 </p>
 </div>
 </section>

 {/* ─── Stats Bar ─── */}
 <section className="px-4 sm:px-6 lg:px-8 pb-20">
 <div className="max-w-5xl mx-auto rounded-3xl bg-zinc-900 dark:bg-zinc-800 p-10 md:p-14 border border-zinc-700/50">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {stats.map((stat, idx) => (
 <div key={idx} className="text-center">
 <p className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-1">
 {stat.value}
 </p>
 <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
 </div>
))}
 </div>
 </div>
 </section>

 {/* ─── Mission & Vision ─── */}
 <section className="px-4 sm:px-6 lg:px-8 pb-28">
 <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
 <div className="p-10 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20">
 <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
 <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
 To empower individuals and businesses with practical, industry-relevant skills
 in AI, content creation, and digital marketing bridging the gap between
 traditional education and the rapidly evolving digital landscape.
 </p>
 </div>
 <div className="p-10 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20">
 <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
 <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
 A world where anyone with ambition can access world-class education in
 emerging technologies, build real skills through practice, and unlock
 career opportunities previously reserved for a privileged few.
 </p>
 </div>
 </div>
 </section>

 {/* ─── Our Values ─── */}
 <section className="px-4 sm:px-6 lg:px-8 pb-28">
 <div className="max-w-5xl mx-auto">
 <div className="text-center max-w-2xl mx-auto mb-16">
 <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
 Our Values
 </p>
 <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
 What drives everything we do
 </h2>
 </div>
 <div className="grid sm:grid-cols-2 gap-6">
 {values.map((value, idx) => (
 <div
 key={idx}
 className="group p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1"
 >
 <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">{value.title}</h3>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{value.description}</p>
 </div>
))}
 </div>
 </div>
 </section>

 {/* ─── Team ─── */}
 <section className="px-4 sm:px-6 lg:px-8 pb-28">
 <div className="max-w-4xl mx-auto">
 <div className="text-center max-w-2xl mx-auto mb-16">
 <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
 The Team
 </p>
 <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
 Meet the people behind Bluedemy
 </h2>
 </div>
 <div className="grid sm:grid-cols-2 gap-5">
 {team.map((member, idx) => (
 <div
 key={idx}
 className="group max-w-sm mx-auto w-full overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 hover:shadow-xl hover:shadow-zinc-900/10 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
 >
 <div className="relative aspect-[5/4] w-full overflow-hidden">
 <Image
 src={member.image}
 alt={member.name}
 fill
 sizes="(max-width: 640px) 90vw, (max-width: 1024px) 42vw, 360px"
 className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
 />
 <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
 </div>
 <div className="p-6 text-left">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
 <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">{member.role}</p>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">{member.bio}</p>
 </div>
 </div>
))}
 </div>
 </div>
 </section>
 </main>
 <Footer />
 </div>
);
}
