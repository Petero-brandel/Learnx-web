export default function DashboardLoading() {
 return (
 <div className="space-y-8 animate-pulse">
 {/* Welcome skeleton */}
 <div>
 <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
 <div className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800/50 rounded mt-2" />
 </div>

 {/* Stats skeleton */}
 <div className="flex gap-3 overflow-hidden md:grid md:grid-cols-3">
 {[1, 2, 3].map((i) => (
 <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700/70 min-w-[200px]">
 <div className="h-11 w-11 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
 <div>
 <div className="h-7 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800/50 rounded mt-2" />
 </div>
 </div>
))}
 </div>

 {/* Course cards skeleton */}
 <div>
 <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-5" />
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {[1, 2, 3].map((i) => (
 <div key={i} className="rounded-2xl border border-zinc-100 dark:border-zinc-700/70 overflow-hidden">
 <div className="aspect-video bg-zinc-200 dark:bg-zinc-800" />
 <div className="p-4 space-y-3">
 <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full" />
 <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
 </div>
 </div>
))}
 </div>
 </div>
 </div>
)
}
