"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
 {
 name: 'ABBA OYALE TESSY',
 role: 'AI content creator',
 content: 'I\'m thankful for Coach Izu\'s training, it has opened my eyes to so many aspect of AI and even marketing. I gathered good knowledge from his training concerning AI and it\'s application. Thank you once again',
 image: '/images/avatars/dpstd1.png',
 rating: 5,
 },
 {
 name: 'AJEH EMMANUEL',
 role: 'Student',
 content: 'Izu is one of the best coaches. He\'s dedicated to teaching others what makes them real money. He has selfless mindset is worth a celebrating. Thank you so much for all you do Coach Izu.',
 image: '/images/avatars/dpstd2.png',
 rating: 5,
 },

  {
 name: 'Clinton Mudiaga Akpoyovware',
 role: 'Student, AI Enthusiast',
 content: 'The courses are not just amazing, the courses are not just valuable, they are always double the value.\n\nI have noticed that anytime Coach Izu is giving a class, he gives more than what is being paid for. Anything we ask for a class, were expecting just something basic but you don\'t end there, you take us advance.\n\nYour Courses are not just amazing, they are wonderful for everyone and I think anyone who registers for your course is making a huge investment in themselves that is always worth it.',
 image: '/images/avatars/dpstd4.jpeg',
 rating: 4,
 },

  {
 name: 'Julianah Inyang',
 role: 'Content creator, Writer & Digital Marketer',
content: 'I got to know Coach Izu through a Facebook group where he usually shared AI-generated images. What first caught my attention was how outstanding and stunning the images were. I became curious and decided to connect with him through WhatsApp to learn more.\n\nAt that time, I had just started learning about AI, so I didn’t really know much. Coach Izu organized a free class where he taught people how to create AI-generated images for free, and that was my first real introduction to AI creation. His teaching style was very detailed, simple, and easy to understand, even for beginners like me.\n\nOne thing that really stood out to me was his kindness and generosity. He had different course packages ranging from Bronze to Gold, and honestly, I couldn’t afford much at that moment. But after seeing how passionate and willing I was to learn, he gave me access to the Gold course at a discounted price. That truly meant a lot to me, and I was sincerely grateful for it.\n\nBeyond teaching, Coach Izu is someone who genuinely listens to his students. Whenever I had questions, needed clarity, advice on growing an audience, or even ways to make money with AI, he was always willing to help. He is not stingy with knowledge at all. He gives corrections, guidance, advice, and support freely.\n\nThe course content itself was mind-blowing and premium. Everything I learned was worth far more than what I paid for. He has impacted me in so many positive ways, and sincerely, I’m really glad I met him and learned from him.',
 image: '/images/avatars/dpstd5.png',
 rating: 5,
 },

  {
 name: 'Nnanwuba Precious',
 role: 'Student, Business Owner',
 content: 'Genuinely, I have learnt and taken good interest in AI because Coach Izu took his time to teach and educate us on the importance and financial benefits of AI. He didn\'t take it likely.\n\nNot to talk about his courses, very accessible and understandable, if you are willing to put it into practice. The courses are practical, because I have been able to apply them to my business and it has brought about massive turnout such as I have never seen in business and more still coming.\n\nThank you coach Izu for your efforts, your students are grateful.',
 image: '/images/avatars/dpstd6.jpeg',
 rating: 5,
 },

  {
 name: 'Blossom Chukwudalu',
 role: 'Student, Entrepreneur',
 content: 'As a person, Coach Izu is truly one of a kind. And I don\’t say this lightly… I say it because I have personally experienced it. I have rarely seen someone as humble and selfless as him.\n\nHe gives out valuable knowledge completely free of charge, knowledge people would normally pay heavily to acquire. But no… Coach Izu chooses impact over profit. In fact, his priority isn\’t money; it\’s his students. Over 99% of his focus is on ensuring that his students gain a skill they can rely on, something meaningful they can build their lives on. And honestly, that\’s rare in today\’s world. To keep this short, I\’ll just say this Coach Izu is someone I can never forget in my life. Why? Because he didn\’t just teach me… he transformed my mindset. Through the knowledge I gained from him, I now make daily income, and beyond that, he taught me something even more powerful—CONSISTENCY and the willingness to keep learning and growing.\n\nAbout His Course: Let me be very honest—his courses are a MUST HAVE for anyone serious about advancing in the AI space. They are well-structured, deeply insightful, and designed to give you both foundational understanding and practical skills in any area of AI you choose to explore. This isn\’t just theory you actually learn what works. If you\’re serious about leveling up, building a skill, and earning from it, Coach Izu has a course for you. Invest in knowledge. Invest in growth.',
 image: '/images/avatars/dpstd7.png',
 rating: 5,
 },

   {
 name: 'Victor Emmanuel',
 role: 'Digital Creator',
 content: 'If I must be very honest, coach Izu is one coach that cares really , about his own. I joined his class in October, and ever since then, AI photography has been one of my side gigs that pays me. He teaches very simply and without stress. Explains everything to the barest detail. His courses? They\'re all self explanatory. He explained everything in his book, just the same way he explains it in real life .',
 image: '/images/avatars/dpstd8.jpeg',
 rating: 5,
 },

    {
 name: 'Tolulope Tehila Ademakinwa ',
 role: 'Student',
 content: "Coach Izu is a very unique individual. He's a very forward minded, goal driven entrepreneur, teacher and aspiring engineer. He explains things very well, thinks in ways that make use of everyday tools the average person doesn't, and has a wonderful vibe and personality that's nothing short of magnetic. His innovative way of thinking carries into his courses as well and provides useful, beneficial information efficiently.",
 image: '/images/avatars/dpstd9.jpg',
 rating: 5,
 },

     {
 name: 'Chukwu Amarachi Gift',
 role: 'Student, Digital creator',
 content: "To my coach, my mentor, my guide, Izu. Some people teach because it is a job. But rare people teach because they genuinely want lives to change. You are one of those rare people. Before your classes, AI felt like something distant… something complicated and impossible to truly understand. But you carried it with patience, wisdom, excellence, and heart. You didn’t just drop information and disappear. You stayed, explained, corrected, guided, pushed, encouraged, and made people believe they could become something greater. It wasn’t just a course. It was an eye opener. A life changer. A confidence builder. The kind of knowledge that makes someone sit quietly and say, “Wow… so I can actually do this.” And the beautiful thing about you is that you never disappoint when it comes to quality. You give your best every single time. Not half knowledge. Not recycled motivation. But real value. Real teaching. Real impact. A lot of people online pretend to care, but you actually do. And I pray God rewards you deeply for every sleepless night, every explanation, every sacrifice, every effort you put into helping others grow. May the same doors you open for people begin to open for you in ways beyond imagination. May your knowledge keep making room for you. May your name be mentioned in places of greatness. May you never lack wisdom, strength, peace, opportunities, and genuine happiness. And when people speak about mentors who truly changed lives, may your name be remembered with honor. Thank you for being real. Thank you for teaching with passion. Thank you for not disappointing us. Thank you for proving that good coaches still exist. The truth is… some people will learn skills and forget where they learnt them from. But some of us will always remember the person who helped us believe in ourselves again. And for many of us… that person is you, Izu.",
 image: '/images/avatars/dpstd10.png',
 rating: 5,
 },

      {
 name: 'AbleGod',
 role: 'Web3 Expert, Writer',
 content: "Izu doesn't chase you. Ignore his corrections and he won't argue or beg, he just goes quiet. And that silence? It hits harder than any lecture ever could. He teaches until you truly understand, not until he's tired or until time runs out, but until it finally clicks for you. That kind of patience is rare in a coach. His AI training was one of the most practical learning experiences I've had — dense, applicable, and the kind of knowledge you keep coming back to long after it ends. The results speak for themselves; the growth is the testimony. But what truly separates Izu from most coaches is that he's not driven by money. You can feel it in the way he shows up, the way he corrects, and the way he remains committed to your progress even when you're not fully committed yourself. If you ever get access to his coaching, don't take it for granted.",
 image: '/images/avatars/dpstd11.png',
 rating: 5,
 },

       {
 name: 'Achile Favour Ojotule',
 role: 'Student',
 content: "One thing that really stood out to me was the lesson on prompt engineering. Most of us open AI apps, type a single-line prompt, and expect the AI to magically deliver perfect results based only on its intelligence. But Coach Izu showed us that even though AI helps reduce the stress of solving problems, getting the best results still requires an analytical mind. He taught us that AI works best when combined with human intelligence, creativity, and clear thinking. That lesson completely changed my relationship with AI. I stopped seeing it like some magical genie that grants wishes, and started understanding it for what it truly is — Artificial Intelligence working together with Human Intelligence. If you get what I mean.",
 image: '/images/avatars/dpstd12.jpg',
 rating: 5,
 },

];

const previewLimit = testimonials.find((testimonial) => testimonial.name === 'Cynthia Nwabueze')?.content.length ?? 220;

function truncateTestimonial(content: string) {
 if (content.length <= previewLimit) return { text: content, truncated: false };

 const clipped = content.slice(0, previewLimit).trimEnd();
 const lastSpace = clipped.lastIndexOf(' ');
 const safeText = lastSpace > 120 ? clipped.slice(0, lastSpace).trimEnd() : clipped;

 return {
	text: safeText,
	truncated: true,
 };
}

export function Testimonials() {
 const swiperRef = useRef<SwiperType | null>(null);
 const [activeTestimonial, setActiveTestimonial] = useState<(typeof testimonials)[number] | null>(null);

 useEffect(() => {
	if (!activeTestimonial) return;

	const handleKeyDown = (event: KeyboardEvent) => {
	 if (event.key === 'Escape') {
		setActiveTestimonial(null);
	 }
	};

	document.body.style.overflow = 'hidden';
	window.addEventListener('keydown', handleKeyDown);

	return () => {
	 document.body.style.overflow = '';
	 window.removeEventListener('keydown', handleKeyDown);
	};
 }, [activeTestimonial]);

 const closeModal = () => setActiveTestimonial(null);

 return (
  <section className="bg-[#ececec] py-14 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
	<div className="mx-auto w-full max-w-6xl relative">
	 <Reveal>
	  <div className="mb-8 sm:mb-10 max-w-4xl">
		<h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold tracking-[-0.01em] leading-tight text-[#1a2238]">
		 We asked our Sudents how likely they were to recommend Bluedemy to their friends
		</h2>
	  </div>
	 </Reveal>

	 <div
	  className="relative"
	  onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
	  onMouseLeave={() => swiperRef.current?.autoplay?.start()}
	 >
	  <Swiper
		onSwiper={(swiper) => { swiperRef.current = swiper; }}
		modules={[Autoplay, Navigation, Pagination, Keyboard]}
		slidesPerView={1}
		spaceBetween={20}
		grabCursor
		keyboard={{ enabled: true, onlyInViewport: true }}
		pagination={{ clickable: true, dynamicBullets: true }}
		autoplay={{
		 delay: 4200,
		 disableOnInteraction: false,
		 pauseOnMouseEnter: true,
		}}
		loop={testimonials.length > 1}
		speed={650}
		className="overflow-visible [&_.swiper-pagination]:mt-4 [&_.swiper-pagination]:relative [&_.swiper-pagination-bullet]:bg-[#9aa3bd] [&_.swiper-pagination-bullet]:opacity-70 [&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-pagination-bullet-active]:opacity-100"
	  >
		{testimonials.map((testimonial, idx) => (
		 <SwiperSlide key={testimonial.name}>
		  <Reveal delay={idx * 80}>
			<article className="relative rounded-[20px] bg-[#151b2c] text-white overflow-hidden min-h-[360px] sm:min-h-[420px] lg:min-h-[380px] shadow-[0_10px_35px_rgba(10,15,30,0.2)]">
			 <div className="grid gap-4 px-4 py-5 sm:gap-6 sm:px-7 sm:py-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:px-9 lg:py-9">
			  <div className="relative h-[180px] sm:h-[260px] lg:h-full lg:min-h-[300px] rounded-2xl overflow-hidden bg-[#0f1424]">
				<Image
				 src={testimonial.image}
				 alt={testimonial.name}
				 fill
				 className="object-cover object-top"
				 sizes="(max-width: 1024px) 100vw, 40vw"
				 priority={idx === 0}
				/>
			  </div>

			  <div className="flex flex-col justify-between">
				<div>
				 <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#95a1c2]">
				  Student Story
				 </p>
				 <div className="mt-3 flex items-center gap-1 text-[#ffcf66]">
				  {Array.from({ length: 5 }).map((_, starIndex) => (
					<Star
					 key={`${testimonial.name}-${starIndex}`}
					 className={`h-4 w-4 ${starIndex < testimonial.rating ? 'fill-current' : 'text-white/30'}`}
					/>
				  ))}
				 </div>
				 {(() => {
				  const preview = truncateTestimonial(testimonial.content);

				  return (
				   <div className="mt-3">
					<p className="text-[0.96rem] leading-[1.55] font-medium tracking-[-0.005em] text-[#f5f7ff] sm:text-[1.08rem] lg:text-[1.18rem]">
					 {preview.text}
					 {preview.truncated ? '… ' : ''}
					 {preview.truncated ? (
					  <button
					   type="button"
					   onClick={() => setActiveTestimonial(testimonial)}
					   className="inline-flex items-center rounded-full text-[#9fb4ff] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
					  >
					   Read Full
					  </button>
					 ) : null}
					</p>
				   </div>
				  );
				 })()}
				</div>

				<div className="mt-5 border-t border-white/15 pt-3 sm:mt-7 sm:pt-4">
				 <p className="text-lg sm:text-2xl font-semibold tracking-[-0.01em] text-white leading-tight">
				  {testimonial.name}
				 </p>
				 <p className="mt-1 text-xs sm:text-base text-[#a9b2ca]">{testimonial.role}</p>
				</div>
			  </div>
			 </div>
			</article>
		  </Reveal>
		 </SwiperSlide>
		))}
	  </Swiper>

	  {activeTestimonial ? (
	   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4" onClick={closeModal}>
		<div
		 className="w-full max-w-4xl overflow-hidden rounded-3xl bg-[#151b2c] text-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] flex flex-col max-h-[90svh]"
		 onClick={(event) => event.stopPropagation()}
		>
		 {/* Header */}
		 <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5 flex-shrink-0">
		  <div className="min-w-0">
		   <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b8cba]">Testimonial</p>
		   <h3 className="mt-2 text-lg sm:text-2xl font-bold tracking-tight truncate">{activeTestimonial.name}</h3>
		   <p className="mt-1 text-xs sm:text-sm text-[#9fb4ff] font-medium">{activeTestimonial.role}</p>
		  </div>
		  <button
		   type="button"
		   onClick={closeModal}
		   aria-label="Close testimonial"
		   className="ml-4 flex-shrink-0 rounded-full p-2.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
		  >
		   <X className="h-5 w-5" />
		  </button>
		 </div>

		 {/* Content - scrollable text takes full width */}
		 <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7 sm:py-8 flex flex-col">
		  {/* Stars */}
		  <div className="flex items-center gap-1.5 text-[#ffcf66]">
		   {Array.from({ length: 5 }).map((_, starIndex) => (
			<Star
			 key={`${activeTestimonial.name}-modal-${starIndex}`}
			 className={`h-5 w-5 ${starIndex < activeTestimonial.rating ? 'fill-current' : 'text-white/20'}`}
			/>
		   ))}
		  </div>

		  {/* Testimonial Text */}
		  <p className="mt-6 text-base sm:text-lg leading-[1.8] text-[#e5e7eb] font-light whitespace-pre-wrap">
		   {activeTestimonial.content}
		  </p>
		 </div>

		 {/* Bottom Divider */}
		 <div className="border-t border-white/10 flex-shrink-0" />
		</div>
	   </div>
	  ) : null}

	  <div className="pointer-events-none absolute -bottom-14 right-2 z-10 flex items-center gap-3 sm:right-5 lg:right-6">
		<button
		 type="button"
		 onClick={() => swiperRef.current?.slidePrev()}
		 aria-label="Previous testimonial"
		 className="pointer-events-auto h-11 w-11 rounded-full border border-[#c9ced8] bg-transparent text-[#8a90a0] flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-[#1a2238] hover:border-[#b4bbca]"
		>
		 <ChevronLeft className="h-5 w-5" />
		</button>
		<button
		 type="button"
		 onClick={() => swiperRef.current?.slideNext()}
		 aria-label="Next testimonial"
		 className="pointer-events-auto h-11 w-11 rounded-full border border-[#c9ced8] bg-transparent text-[#8a90a0] flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-[#1a2238] hover:border-[#b4bbca]"
		>
		 <ChevronRight className="h-5 w-5" />
		</button>
	  </div>
	 </div>
	</div>
  </section>
);
}
