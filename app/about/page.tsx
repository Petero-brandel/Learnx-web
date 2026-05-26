import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Bluedemy",
  description: "Learn about the story of Bluedemy, an innovative online e-learning platform dedicated to equipping young Africans with digital skills and AI literacy. Meet our team, including CEO Coach Izu and CFO Uwana Essien.",
};

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
    name: 'Chukwuemeka Izuchukwu Emmanuel (Coach Izu)',
    role: 'Co-Founder & CEO',
    image: '/izudp.jpeg',
    bio: [
      "Chukwuemeka Izuchukwu Emmanuel, popularly known as Coach Izu, is a dynamic AI Educator and Digital Skills Trainer passionate about empowering the next generation of African digital entrepreneurs. With 2 to 3 years of hands-on experience in digital marketing, social media strategy, content creation, and AI education, he has built a reputation as one of the most relatable and results-driven voices in Nigeria's growing online skills space.",
      "Coach Izu specializes in breaking down complex AI tools and digital marketing strategies into simple, actionable knowledge that university students and young graduates can immediately apply to generate real income online. His teaching approach is deeply practical, built not on theory alone but on lived experience running successful digital campaigns and building paying student communities from the ground up.",
      "From growing a loyal and engaged personal brand audience to hosting live training sessions that convert complete beginners into confident digital earners, Coach Izu has demonstrated a rare ability to meet young Africans exactly where they are and move them toward where they want to be. He believes that access to the right knowledge is the most powerful equalizer a young person can have in today's digital economy."
    ],
  },
  {
    name: 'Uwana Essien',
    role: 'Co-Founder & CFO',
    image: '/esenidp.png',
    bio: [
      "Uwana Essien is an experienced Communications Specialist with expertise in strategic communications, media relations, content development, crisis communications, and stakeholder engagement. With over 15 years of experience across corporate and higher education sectors in both Nigeria and Canada, she has successfully led communication campaigns, developed compelling stories, managed media relations, and strengthened organizational visibility and reputation.",
      "Uwana specializes in translating complex ideas into engaging and accessible content that resonates with diverse audiences. Passionate about storytelling and community engagement, she uses strategic communications to drive impact, foster meaningful conversations, and build strong connections between organizations and the communities they serve."
    ],
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
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              Bluedemy is an innovative online e-learning platform dedicated to equipping young Africans with the digital skills, AI literacy, and strategic knowledge needed to thrive and earn in the modern world.
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
            <div className="grid md:grid-cols-2 gap-8">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="group max-w-md mx-auto w-full overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 hover:shadow-xl hover:shadow-zinc-900/10 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 42vw, 360px"
                      className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
                  </div>
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">{member.role}</p>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed space-y-3">
                      {member.bio.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
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
