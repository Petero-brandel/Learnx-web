"use client";

import React, { useState, useEffect } from"react";
import Link from"next/link";
import { Menu, X, BookOpen, ChevronRight } from"lucide-react";
import Logo from '@/components/ui/Logo';
import { cn } from"@/lib/utils";

export default function MobileNav() {
 const [isOpen, setIsOpen] = useState(false);

 // Prevent body scroll when menu is open
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow ="hidden";
 } else {
 document.body.style.overflow ="auto";
 }
 return () => {
 document.body.style.overflow ="auto";
 };
 }, [isOpen]);

 const closeMenu = () => setIsOpen(false);

 return (
 <div className="md:hidden flex items-center">
 <button
 onClick={() => setIsOpen(true)}
 className="p-2 -mr-2 text-slate-900 focus:outline-none dark:text-slate-50"
 aria-label="Open menu"
 >
 <Menu className="h-6 w-6" />
 </button>

 {/* Backdrop */}
 {isOpen && (
 <div
 className="fixed inset-0 z-[60] bg-slate-900/50 transition-opacity"
 onClick={closeMenu}
 aria-hidden="true"
 />
)}

 {/* Sliding Drawer */}
 <div
 className={cn(
"fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-slate-200 bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 sm:max-w-md",
 isOpen ?"translate-x-0" :"translate-x-full"
)}
 >
 <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <Logo href="/" size="sm" variant="auto" src="/bluedemy-logo.png" onClick={closeMenu} />
 <button
 onClick={closeMenu}
 className="p-2 -mr-2 text-slate-500 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:text-slate-50"
 aria-label="Close menu"
 >
 <X className="h-6 w-6" />
 </button>
 </div>

 <nav className="flex flex-col gap-4 pt-6 overflow-y-auto">
 <div className="flex flex-col space-y-3">
 <h4 className="font-medium text-slate-900 dark:text-slate-50">Courses</h4>
 <div className="flex flex-col space-y-2 pl-4 border-l border-slate-200 dark:border-slate-800">
 <Link href="/courses" className="flex items-center text-slate-600 dark:text-slate-300" onClick={closeMenu}>
 All Courses <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
 </Link>
 <Link href="/courses?category=development" className="flex items-center text-slate-600 dark:text-slate-300" onClick={closeMenu}>
 Development
 </Link>
 <Link href="/courses?category=business" className="flex items-center text-slate-600 dark:text-slate-300" onClick={closeMenu}>
 Business
 </Link>
 <Link href="/courses?category=design" className="flex items-center text-slate-600 dark:text-slate-300" onClick={closeMenu}>
 Design
 </Link>
 </div>
 </div>
 
 <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
 <Link href="/my-learning" className="font-medium text-slate-900 dark:text-slate-50" onClick={closeMenu}>
 My Learning
 </Link>
 </div>
 </nav>

 <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
 <Link
 href="/login"
 onClick={closeMenu}
 className="flex h-11 w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
 >
 Login
 </Link>
 </div>
 </div>
 </div>
);
}
