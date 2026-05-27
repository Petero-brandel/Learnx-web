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

			{/* ── Bottom Section: Featured Product Cards ── */}
			<div className="bg-[#f0f4ff]">


			</div>
		</section>
	);
}
