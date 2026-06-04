'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { User, Mail, Calendar, Shield, Edit2, Check, X, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function SettingsPage() {
 const { user, fetchUser } = useAuth()
 const [isEditingName, setIsEditingName] = useState(false)
 const [newName, setNewName] = useState('')
 const [isSavingName, setIsSavingName] = useState(false)

 const handleSaveName = async () => {
   if (!newName.trim() || newName.trim() === user?.full_name) {
     setIsEditingName(false)
     return
   }
   setIsSavingName(true)
   try {
     await api.patch('/auth/me/', { full_name: newName.trim() })
     await fetchUser() // Refresh context
     setIsEditingName(false)
   } catch (error) {
     console.error('Failed to update name', error)
     alert('Failed to update name.')
   } finally {
     setIsSavingName(false)
   }
 }

 return (
 <div className="space-y-8 max-w-2xl">
 {/* Header */}
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
 Settings
 </h1>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
 Manage your profile and preferences.
 </p>
 </div>

 {/* Profile Section */}
 <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/50 overflow-hidden">
 <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700/70">
 <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Profile</h2>
 </div>
 <div className="p-5 space-y-5">
 {/* Avatar */}
 <div className="flex items-center gap-4">
 {user?.profile_photo ? (
 <img
 src={user.profile_photo}
 alt={user.full_name}
 className="h-16 w-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
 />
) : (
 <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ring-2 ring-zinc-200 dark:ring-zinc-700">
 <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
 {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
 </span>
 </div>
)}
 <div>
 <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
 {user?.full_name}
 </p>
 <p className="text-sm text-zinc-500 dark:text-zinc-400">
 {user?.is_staff ? 'Administrator' : 'Student'}
 </p>
 </div>
 </div>

 {/* Info rows */}
 <div className="space-y-3">
 {/* Editable Full Name */}
 <div className="flex items-center gap-3 py-2">
   <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
     <User className="h-5 w-5 text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 dark:text-zinc-400" />
   </div>
   <div className="min-w-0 flex-1">
     <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
       Full Name
     </p>
     <div className="flex items-center gap-2 mt-0.5">
       {isEditingName ? (
         <div className="flex items-center gap-2 w-full max-w-sm">
           <input
             type="text"
             value={newName}
             onChange={(e) => setNewName(e.target.value)}
             className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
             placeholder="Your full name"
             autoFocus
           />
           <button
             onClick={handleSaveName}
             disabled={isSavingName}
             className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
           >
             {isSavingName ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
           </button>
           <button
             onClick={() => setIsEditingName(false)}
             disabled={isSavingName}
             className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-md transition-colors"
           >
             <X className="h-5 w-5" />
           </button>
         </div>
       ) : (
         <>
           <p className="text-sm text-zinc-900 dark:text-zinc-100 truncate">{user?.full_name || 'Not set'}</p>
           <button
             onClick={() => {
               setNewName(user?.full_name || '')
               setIsEditingName(true)
             }}
             className="ml-2 text-zinc-400 hover:text-blue-500 transition-colors"
             title="Edit Name"
           >
             <Edit2 className="h-5 w-5" />
           </button>
         </>
       )}
     </div>
   </div>
 </div>
 <InfoRow icon={Mail} label="Email" value={user?.email || ''} badge="Verified" />
 <InfoRow
 icon={Calendar}
 label="Member Since"
 value={user?.date_joined
 ? new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
 : ''
 }
 />
 <InfoRow
 icon={Shield}
 label="Account Type"
 value={user?.is_superuser ? 'Super Admin' : user?.is_staff ? 'Staff' : 'Student'}
 />
 </div>
 </div>
 </section>

 {/* Preferences Section */}
 <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/50 overflow-hidden">
 <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700/70">
 <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Preferences</h2>
 </div>
 <div className="p-5">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Theme</p>
 <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
 Choose between light and dark mode.
 </p>
 </div>
 <ThemeToggle />
 </div>
 </div>
 </section>

 {/* Account Section */}
 <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700/70 bg-white dark:bg-zinc-900/50 overflow-hidden">
 <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700/70">
 <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Account</h2>
 </div>
 <div className="p-5 space-y-3">
 <button
 disabled
 className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
 >
 <span>Change Password</span>
 <span className="text-[10px] font-semibold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded text-zinc-500 dark:text-zinc-400">
 Coming Soon
 </span>
 </button>
 </div>
 </section>
 </div>
)
}

// --- Info Row --------------------------------------------
function InfoRow({ icon: Icon, label, value, badge }: {
 icon: React.ElementType
 label: string
 value: string
 badge?: string
}) {
 return (
 <div className="flex items-center gap-3 py-2">
 <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
 <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
 {label}
 </p>
 <div className="flex items-center gap-2">
 <p className="text-sm text-zinc-900 dark:text-zinc-100 truncate">{value}</p>
 {badge && (
 <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
 {badge}
 </span>
)}
 </div>
 </div>
 </div>
)
}
