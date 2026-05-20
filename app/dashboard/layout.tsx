'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/dashboard/ProtectedRoute'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import MobileHeader from '@/components/dashboard/MobileHeader'
import DashboardDrawer from '@/components/dashboard/DashboardDrawer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 const [drawerOpen, setDrawerOpen] = useState(false)

 return (
 <ProtectedRoute>
 {/* Desktop navbar */}
 <DashboardNavbar />

 {/* Mobile header */}
 <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />

 {/* Mobile drawer */}
 <DashboardDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

 {/* Main content */}
 <main className="min-h-screen bg-white dark:bg-zinc-900 pt-14 md:pt-16">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
 {children}
 </div>
 </main>
 </ProtectedRoute>
)
}
