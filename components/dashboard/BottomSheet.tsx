'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
 isOpen: boolean
 onClose: () => void
 title: string
 children: React.ReactNode
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
 // Prevent body scroll when open
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden'
 } else {
 document.body.style.overflow = ''
 }
 return () => { document.body.style.overflow = '' }
 }, [isOpen])

 if (!isOpen) return null

 return (
 <>
 {/* Backdrop */}
 <div
 className="fixed inset-0 z-40 bg-zinc-900/35 dark:bg-zinc-950/55 animate-in fade-in duration-200"
 onClick={onClose}
 />

 {/* Sheet */}
 <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
 {/* Drag handle */}
 <div className="flex items-center justify-center pt-3 pb-1">
 <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
 </div>

 {/* Header */}
 <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-700/70">
 <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
 <button
 onClick={onClose}
 className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
 >
 <X className="h-4 w-4 text-zinc-500" />
 </button>
 </div>

 {/* Scrollable content */}
 <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 pb-[env(safe-area-inset-bottom,16px)]">
 {children}
 </div>
 </div>
 </>
)
}
