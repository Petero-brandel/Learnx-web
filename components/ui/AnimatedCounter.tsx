'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
 value: string;
 duration?: number;
}

export function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
 const [displayValue, setDisplayValue] = useState('0');
 const [hasAnimated, setHasAnimated] = useState(false);
 const ref = useRef<HTMLParagraphElement>(null);

 useEffect(() => {
 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting && !hasAnimated) {
 setHasAnimated(true);
 animateCounter();
 }
 },
 { threshold: 0.5 }
);

 if (ref.current) {
 observer.observe(ref.current);
 }

 return () => {
 if (ref.current) {
 observer.unobserve(ref.current);
 }
 };
 }, [hasAnimated]);

 const animateCounter = () => {
 // Extract the numeric part (including decimals) and suffix (like +, %, /5)
 const numericMatch = value.match(/([\d.]+)/);
 const suffix = value.replace(/([\d.]+)/g, '');
 
 if (!numericMatch) {
 setDisplayValue(value);
 return;
 }

 const targetNumber = parseFloat(numericMatch[0]);
 const isDecimal = numericMatch[0].includes('.');
 const decimalPlaces = isDecimal ? numericMatch[0].split('.')[1].length : 0;
 const increment = targetNumber / (duration / 16); // ~60fps
 let current = 0;

 const counter = setInterval(() => {
 current += increment;
 if (current >= targetNumber) {
 const displayNum = isDecimal ? targetNumber.toFixed(decimalPlaces) : targetNumber.toLocaleString();
 setDisplayValue(displayNum + suffix);
 clearInterval(counter);
 } else {
 const displayNum = isDecimal ? current.toFixed(decimalPlaces) : Math.floor(current).toLocaleString();
 setDisplayValue(displayNum + suffix);
 }
 }, 16);
 };

 return (
 <p ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-2">
 {displayValue}
 </p>
);
}
