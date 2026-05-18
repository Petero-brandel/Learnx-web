'use client'

import { useState, useEffect } from 'react'
import { fetchMyCertificates, type Certificate } from '@/lib/dashboard'
import { api } from '@/lib/api'
import { Award, Download, ExternalLink, Calendar, Hash, Sparkles, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

 export default function CertificatesPage() {
 const { user, fetchUser } = useAuth()
 const [certificates, setCertificates] = useState<Certificate[]>([])
 const [loading, setLoading] = useState(true)
 const [downloadingId, setDownloadingId] = useState<string | null>(null)
 
 // Modal state
 const [showNameModal, setShowNameModal] = useState(false)
 const [tempName, setTempName] = useState('')
 const [isSavingName, setIsSavingName] = useState(false)
 const [pendingDownload, setPendingDownload] = useState<{ id: string, title: string } | null>(null)

 const performDownload = async (certId: string, title: string) => {
 setDownloadingId(certId)
 try {
   // Call the authenticated download endpoint
   const response = await api.get(`/certificates/${certId}/download/`, {
     responseType: 'blob',
   })

   const blob = new Blob([response.data], { type: 'application/pdf' })
   const blobUrl = window.URL.createObjectURL(blob)
   const a = document.createElement('a')
   a.href = blobUrl
   a.download = `Certificate - ${title}.pdf`
   document.body.appendChild(a)
   a.click()
   document.body.removeChild(a)
   window.URL.revokeObjectURL(blobUrl)
 } catch (err) {
   console.error('Download failed', err)
   alert('Failed to download certificate. Please try again.')
 } finally {
   setDownloadingId(null)
 }
 }

 const handleDownloadClick = (certId: string, title: string) => {
   if (!user?.full_name) {
     setPendingDownload({ id: certId, title })
     setShowNameModal(true)
     return
   }
   performDownload(certId, title)
 }

 const handleSaveName = async () => {
   if (!tempName.trim()) return
   setIsSavingName(true)
   try {
     await api.patch('/auth/me/', { full_name: tempName.trim() })
     await fetchUser() // Update context
     setShowNameModal(false)
     if (pendingDownload) {
       performDownload(pendingDownload.id, pendingDownload.title)
       setPendingDownload(null)
     }
   } catch (error) {
     console.error('Failed to update name', error)
     alert('Failed to save name. Please try again.')
   } finally {
     setIsSavingName(false)
   }
 }


 useEffect(() => {
 async function load() {
 try {
 const data = await fetchMyCertificates()
 setCertificates(data)
 } catch (err) {
 console.error('Failed to load certificates', err)
 } finally {
 setLoading(false)
 }
 }
 load()
 }, [])

 if (loading) {
 return (
 <div className="space-y-6 animate-pulse">
 <div className="h-7 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 {[1, 2].map(i => (
 <div key={i} className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
   <div className="h-44 bg-zinc-100 dark:bg-zinc-800/50" />
   <div className="p-5 space-y-3">
     <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
     <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-800/30 rounded" />
   </div>
 </div>
))}
 </div>
 </div>
)
 }

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex items-start justify-between">
   <div>
     <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
       Certificates
     </h1>
     <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
       Your earned course completion certificates.
     </p>
   </div>
   {certificates.length > 0 && (
     <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
       <Award className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
       <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
         {certificates.length} earned
       </span>
     </div>
   )}
 </div>

 {/* Certificates grid */}
 {certificates.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 {certificates.map((cert) => (
 <div
 key={cert.certificate_id}
 className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:border-zinc-300 dark:hover:border-zinc-700"
 >
  {/* Certificate Preview — shows actual template */}
  <div className="relative h-48 overflow-hidden">
    <img
      src="/images/certificate_bg.png"
      alt="Certificate preview"
      className="w-full h-full object-cover object-top"
    />
    {/* Overlay with name and course */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingTop: '28%' }}>
      <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-blue-800 uppercase drop-shadow-sm" style={{ fontFamily: "'Permanent Marker', cursive" }}>
        {user?.full_name ? user.full_name.toUpperCase() : 'YOUR NAME'}
      </span>
      <span className="text-[6px] sm:text-[7px] text-blue-900/60 mt-1 italic">has completed</span>
      <span className="text-[7px] sm:text-[8px] font-bold text-blue-900 mt-0.5">
        {cert.course_title}
      </span>
    </div>
    {/* Verified badge */}
    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-sm">
      <Sparkles className="h-2.5 w-2.5 text-amber-500" />
      <span className="text-[9px] font-bold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">
        Verified
      </span>
    </div>
  </div>

 {/* Content */}
 <div className="p-5">
   <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3 line-clamp-2 leading-snug">
     {cert.course_title}
   </h3>
   
   {/* Meta info */}
   <div className="flex flex-wrap items-center gap-3 mb-4">
     <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
       <Calendar className="h-3 w-3" />
       {new Date(cert.issued_at).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
       })}
     </span>
     <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
       <Hash className="h-3 w-3" />
       {cert.certificate_id.slice(0, 8)}
     </span>
   </div>

   {/* Download button */}
   <button
   onClick={() => handleDownloadClick(cert.certificate_id, cert.course_title)}
   disabled={downloadingId === cert.certificate_id}
   className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
   >
   {downloadingId === cert.certificate_id ? (
   <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
 ) : (
   <Download className="h-4 w-4" />
 )}
   {downloadingId === cert.certificate_id ? 'Downloading...' : 'Download Certificate'}
   </button>
 </div>
 </div>
))}
 </div>
) : (
 <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
 <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-5 shadow-sm">
 <Award className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
 </div>
 <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
 No certificates yet
 </h3>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-6">
 Complete a course to earn your first certificate!
 </p>
 <Link
 href="/dashboard"
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
 >
 Go to My Courses
 <ExternalLink className="h-3.5 w-3.5" />
 </Link>
 </div>
)}
  {/* Name Collection Modal */}
  {showNameModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Enter Your Full Name</h3>
          <button 
            onClick={() => setShowNameModal(false)}
            className="text-zinc-400 hover:text-zinc-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Before you can download your certificate, we need your full name exactly as you want it to appear on the document.
          </p>
          <div>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName()
              }}
            />
          </div>
          <button
            onClick={handleSaveName}
            disabled={!tempName.trim() || isSavingName}
            className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingName ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSavingName ? 'Saving...' : 'Save & Download Certificate'}
          </button>
        </div>
      </div>
    </div>
  )}
  
  </div>
)
}
