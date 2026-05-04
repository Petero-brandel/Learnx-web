export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-56 bg-zinc-800/60 rounded-lg" />
        <div className="h-4 w-36 bg-zinc-800/40 rounded mt-2" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/30">
            <div className="h-11 w-11 rounded-xl bg-zinc-800/60" />
            <div>
              <div className="h-7 w-16 bg-zinc-800/60 rounded" />
              <div className="h-3 w-24 bg-zinc-800/40 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
        <div className="h-5 w-40 bg-zinc-800/60 rounded mb-4" />
        <div className="h-48 bg-zinc-800/30 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
        <div className="h-5 w-32 bg-zinc-800/60 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-zinc-800/30 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
