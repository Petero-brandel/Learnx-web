"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
 {
 name: 'Adaora Momah',
 role: 'Freelance Copywriter',
 content: 'I find Bluedemy\'s usability and interface easy to use. It\'s simple and straightforward. I previously struggled with receiving payments for my work, but Bluedemy has made it faster and cheaper to do this now.',
 image: '/images/avatars/avatar-1.png',
 rating: 5,
 },
 {
 name: 'Tunde Bello',
 role: 'Digital Marketer',
 content: 'My learning experience has been practical from day one. The platform is easy to navigate, and the structure helped me build confidence and win better-paying clients in less time.',
 image: '/images/avatars/avatar-2.png',
 rating: 5,
 },
 {
 name: 'Chioma Eze',
 role: 'Content Creator',
 content: 'The lessons are clear, focused, and very actionable. I went from struggling with content ideas to shipping quality campaigns weekly with a process I can actually repeat.',
 image: '/images/avatars/avatar-1.png',
 rating: 4,
 },
];

export function Testimonials() {
 const swiperRef = useRef<SwiperType | null>(null);

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
			<article className="relative rounded-[20px] bg-[#151b2c] text-white overflow-hidden min-h-[420px] lg:min-h-[360px] shadow-[0_10px_35px_rgba(10,15,30,0.2)]">
			 <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8 lg:px-9 lg:py-9">
			  <div className="relative h-[210px] sm:h-[250px] lg:h-full lg:min-h-[280px] rounded-xl overflow-hidden">
				<Image
				 src={testimonial.image}
				 alt={testimonial.name}
				 fill
				 className="object-cover"
				 sizes="(max-width: 1024px) 100vw, 38vw"
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
				 <p className="mt-3 text-[1.12rem] leading-[1.55] font-medium tracking-[-0.005em] text-[#f5f7ff] sm:text-[1.25rem] lg:text-[1.45rem]">
				  {testimonial.content}
				 </p>
				</div>

				<div className="mt-7 border-t border-white/15 pt-4">
				 <p className="text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-white leading-tight">
				  {testimonial.name}
				 </p>
				 <p className="mt-1 text-sm sm:text-base text-[#a9b2ca]">{testimonial.role}</p>
				</div>
			  </div>
			 </div>
			</article>
		  </Reveal>
		 </SwiperSlide>
		))}
	  </Swiper>

	  <div className="pointer-events-none absolute -bottom-14 right-2 z-10 flex items-center gap-3 sm:right-5 lg:right-6">
		<button
		 type="button"
		 onClick={() => swiperRef.current?.slidePrev()}
		 aria-label="Previous testimonial"
		 className="pointer-events-auto h-11 w-11 rounded-full border border-[#c9ced8] bg-transparent text-[#8a90a0] flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-[#1a2238] hover:border-[#b4bbca]"
		>
		 <ChevronLeft className="h-4 w-4" />
		</button>
		<button
		 type="button"
		 onClick={() => swiperRef.current?.slideNext()}
		 aria-label="Next testimonial"
		 className="pointer-events-auto h-11 w-11 rounded-full border border-[#c9ced8] bg-transparent text-[#8a90a0] flex items-center justify-center transition-all duration-200 hover:bg-white hover:text-[#1a2238] hover:border-[#b4bbca]"
		>
		 <ChevronRight className="h-4 w-4" />
		</button>
	  </div>
	 </div>
	</div>
  </section>
);
}
