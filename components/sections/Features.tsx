"use client";

import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

function CountUp({ end, suffix = '', duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const [hasStarted, setHasStarted] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasStarted) {
					setHasStarted(true);
				}
			},
			{ threshold: 0.1 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [hasStarted]);

	useEffect(() => {
		if (!hasStarted) return;
		let startTimestamp: number | null = null;
		const step = (timestamp: number) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
			setCount(Math.floor(easeProgress * end));
			if (progress < 1) {
				window.requestAnimationFrame(step);
			}
		};
		window.requestAnimationFrame(step);
	}, [hasStarted, end, duration]);

	return <span ref={ref}>{count >= 1000 ? count.toLocaleString() : count}{suffix}</span>;
}

const stats = [
	{
		end: 15,
		suffix: '+',
		label: 'Courses covering real digital skills — from design to data to development',
	},
	{
		end: 100,
		suffix: '%',
		label: 'Self-paced learning so you study on your own time, at your own speed',
	},
	{
		end: 500,
		suffix: '+',
		label: 'Students already learning and building skills they actually use',
	},
	{
		end: 24,
		suffix: '/7',
		label: 'Access to your courses, progress, and certificates — anytime, anywhere',
	},
];

const featuredProducts = [
	{
		type: 'image-card' as const,
		tag: 'Self-paced courses',
		title: 'Learn at Your Own Speed',
		description:
			'No deadlines, no pressure. Every course on Bluedemy is designed so you can start, pause, and pick up right where you left off — whether you have 15 minutes or a whole afternoon.',
		cta: 'Browse courses',
		href: '/courses',
		image: '/course-player-preview.png',
	},
	{
		type: 'text-card' as const,
		title: 'Real Skills That Matter',
		description:
			'We don\'t do fluff. Our courses cover the digital skills employers actually care about — UI/UX design, frontend development, data analysis, digital marketing, and more. Everything is hands-on with real projects.',
		cta: 'See what you can learn',
		href: '/courses',
	},
	{
		type: 'text-card' as const,
		title: 'Track Every Step',
		description:
			'Your personal dashboard shows exactly where you are in every course. See your progress, revisit lessons, and know when you\'re ready for your certificate — it\'s all right there.',
		cta: 'How it works',
		href: '/faq',
	},
	{
		type: 'image-card' as const,
		tag: 'Your personal dashboard',
		title: 'Your Learning, Your Way',
		description:
			'Bluedemy\'s learning system adapts to you. Pick the skills you want, follow structured paths, and get a learning experience that feels like it was built just for you.',
		cta: 'Start learning',
		href: '/signup',
		image: '/dashboard-preview.png',
	},
];

export function Features() {
	return (
		<section id="features" className="bg-white">
			{/* ── Top Section: Heading + Stats ── */}
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
				<Reveal>
					<div className="max-w-3xl">
						<h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-blue-700">
							What makes Bluedemy different
						</h2>
						<p className="mt-4 max-w-2xl text-[15px] md:text-base leading-7 text-zinc-600">
							We built Bluedemy because learning digital skills shouldn&apos;t feel complicated. It&apos;s a simple, self-paced platform where you pick a course, learn by doing, and actually walk away with skills you can use.
						</p>
					</div>
				</Reveal>

				<div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{stats.map((stat, idx) => (
						<Reveal key={stat.label} delay={idx * 90}>
							<div className="h-full rounded-3xl bg-zinc-50 p-6 md:p-7 shadow-[0_1px_0_rgba(255,255,255,0.9),0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
								<div className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950">
									<CountUp end={stat.end} suffix={stat.suffix} />
								</div>
								<p className="mt-3 max-w-[16rem] text-sm leading-6 text-zinc-600">
									{stat.label}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>

			{/* ── Bottom Section: Featured Product Cards ── */}
			<div className="bg-[#f0f4ff]">
				<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
					<Reveal>
						<div className="mb-10 max-w-3xl">
							<h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-blue-700">
								What you&apos;ll find on Bluedemy
							</h3>
							<p className="mt-2 text-2xl md:text-3xl font-medium tracking-tight text-blue-400">
								Everything you need to learn, grow, and prove it
							</p>
						</div>
					</Reveal>

					<div className="grid gap-5 md:grid-cols-2">
						{featuredProducts.map((product, idx) => (
							<Reveal key={product.title} delay={80 + idx * 80}>
								{product.type === 'image-card' ? (
									<article className="group relative flex flex-col md:flex-row min-h-[280px] md:min-h-[320px] overflow-hidden rounded-3xl bg-[#1f49d8] text-white shadow-[0_20px_50px_rgba(31,73,216,0.25)]">
										<div className="flex w-full md:w-[50%] flex-col justify-between p-7 md:p-8 relative z-10">
											<div>
												<p className="text-sm font-medium text-white/85">
													{product.tag}
												</p>
												<h4 className="mt-4 text-2xl md:text-[28px] font-medium tracking-tight">
													{product.title}
												</h4>
												<p className="mt-3 max-w-sm text-sm leading-6 text-white/85">
													{product.description}
												</p>
											</div>

											<Link
												href={product.href}
												className="mt-6 md:mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
											>
												{product.cta}
												<ArrowRight className="h-4 w-4" />
											</Link>
										</div>

										<div className="relative w-full md:w-[50%] min-h-[240px] md:min-h-full bg-zinc-900 border-t md:border-t-0 md:border-l border-white/10">
											<Image
												src={product.image!}
												alt={product.title}
												fill
												className="object-cover object-top md:object-left-top"
											/>
										</div>
									</article>
								) : (
									<article className="h-full rounded-3xl bg-white p-7 md:p-8 shadow-[0_1px_0_rgba(255,255,255,0.9),0_12px_35px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
										<h4 className="text-2xl font-medium tracking-tight text-zinc-900">
											{product.title}
										</h4>
										<p className="mt-4 max-w-sm text-sm leading-6 text-zinc-600">
											{product.description}
										</p>

										<Link
											href={product.href}
											className="mt-8 inline-flex w-fit items-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
										>
											{product.cta}
										</Link>
									</article>
								)}
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
