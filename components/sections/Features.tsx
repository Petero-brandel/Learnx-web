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
		end: 100,
		suffix: '+',
		label: 'Courses covering real digital skills from design to data to development',
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
		label: 'Access to your courses, progress, and certificates anytime, anywhere',
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

			{/* ── Bottom Section: Feature Banner ── */}
			<div className="bg-[#f0f4ff]">
				<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
					<Reveal>
						<div className="relative overflow-hidden rounded-sm md:rounded-[2.5rem] bg-[#0a192f] shadow-2xl ring-1 ring-black/5">
							{/* Background Image */}
							<div className="absolute inset-0">
								<img
									src="/feature-banner.png"
									alt="Happy students learning"
									className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
								/>
								{/* Gradient overlay to ensure text readability */}
								<div className="absolute inset-0 bg-gradient-to-r from-[#030914]/90 via-[#030914]/60 to-transparent" />
							</div>

							{/* Content */}
							<div className="relative z-10 flex min-h-[300px] md:min-h-[500px] flex-col justify-center px-6 sm:px-8 py-12 md:px-16 md:py-20 lg:w-2/3">
								<h3 className="mb-6 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
									The Easiest Way To Learn <br className="hidden sm:block" />
									<span className="text-blue-300">While Learning.</span>
								</h3>
								<p className="mb-10 max-w-lg text-base sm:text-lg text-blue-50/80 leading-relaxed">
									No rigid schedules or stressful deadlines. Bluedemy gives you the complete freedom to learn real digital skills whenever and wherever it works best for you.
								</p>
								<Link
									href="/courses"
									className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-base font-medium text-white transition-all hover:bg-blue-500 hover:-translate-y-1 shadow-[0_10px_20px_rgba(37,99,235,0.3)]"
								>
									Learn on Bluedemy
									<ArrowRight className="h-5 w-5" />
								</Link>
							</div>
						</div>
					</Reveal>
				</div>

				{/* ── course de ── */}
				<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
					<Reveal>
						<div className="flex justify-center">
							{/* Text Content */}
							<div className="w-full max-w-5xl px-4 sm:px-0">
								<h3 className="mb-6 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 leading-[1.05]">
									Master AI, Marketing, digital skills...
									<br/>
									<span className="text-blue-600">
										with 100+ expert courses.
									</span>
								</h3>

								<p className="mb-10 max-w-3xl text-base sm:text-xl text-zinc-600 leading-relaxed">
									Stay ahead in the digital economy through practical learning
									experiences designed for modern careers From your Favorite -
									Coach Izu and others.
								</p>

								<ul className="grid gap-6 sm:grid-cols-2 text-zinc-600">
									<li className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
											<svg
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>

										<span className="pt-2 text-base font-medium">
											High-quality Video Contents and text materials
										</span>
									</li>

									<li className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
											<svg
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>

										<span className="pt-2 text-base font-medium">
											Flexible self-paced learning experience
										</span>
									</li>

									<li className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
											<svg
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>

										<span className="pt-2 text-base font-medium">
											High-resolution PDF you can print
										</span>
									</li>

									<li className="flex items-start gap-4">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
											<svg
												className="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>

										<span className="pt-2 text-base font-medium">
											Certificate of completion
										</span>
									</li>
								</ul>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
