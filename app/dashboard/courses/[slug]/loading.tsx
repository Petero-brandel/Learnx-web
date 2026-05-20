export default function CoursePlayerLoading() {
 return (
 <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-6 md:-my-8 animate-pulse">
 <div className="flex items-center gap-3 px-4 md:px-8 py-3 border-b border-zinc-200 dark:border-zinc-700/70">
 <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
 <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded flex-1" />
 </div>
 <div className="flex">
 <div className="flex-1 p-4 md:p-6">
 <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
 <div className="mt-4 space-y-2">
 <div className="h-6 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
 </div>
 </div>
 <aside className="hidden md:block w-80 lg:w-96 border-l border-zinc-200 dark:border-zinc-700/70 p-5">
 <div className="flex items-center gap-4 mb-6">
 <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
 <div className="space-y-2">
 <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
 </div>
 </div>
 {[1, 2, 3].map(i => (
 <div key={i} className="h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl mb-3" />
))}
 </aside>
 </div>
 </div>
)
}
