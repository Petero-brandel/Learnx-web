'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
 const { setTheme, theme, systemTheme } = useTheme();
 const [mounted, setMounted] = React.useState(false);

 React.useEffect(() => {
 setMounted(true);
 }, []);

 if (!mounted) {
 return <div className="w-9 h-9" />; // Placeholder to avoid layout shift
 }

 const currentTheme = theme === 'system' ? systemTheme : theme;

 return (
 <button
 onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
 className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 w-9 text-zinc-600 dark:text-zinc-400"
 aria-label="Toggle theme"
 >
 {currentTheme === 'dark' ? (
 <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
) : (
 <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
)}
 </button>
);
}
