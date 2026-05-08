'use client'

import { useState } from 'react'
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminMobileHeader from '@/components/admin/AdminMobileHeader'
import { cn } from '@/lib/utils'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AdminProtectedRoute>
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile header */}
      <AdminMobileHeader onMenuOpen={() => setMobileOpen(true)} />

      {/* Main content area — shifts right based on fixed closed sidebar width */}
      <main
        className={cn(
          "min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] transition-all duration-300",
          "pt-14 md:pt-0", // Mobile has header offset
          "md:pl-[68px]"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
