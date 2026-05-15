'use client'

import { useState, useEffect } from 'react'
import { fetchMyCertificates, type Certificate } from '@/lib/dashboard'
import { api } from '@/lib/api'
import { Award, Download, ExternalLink, Calendar, Hash, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function CertificatesPage() {
 const [certificates, setCertificates] = useState<Certificate[]>([])
 const [loading, setLoading] = useState(true)
 const [downloadingId, setDownloadingId] = useState<string | null>(null)

 const handleDownload = async (url: string, title: string, id: string) => {
 setDownloadingId(id)
 try {
   let fullUrl = url
   
   // If the URL is relative (e.g. from Django media storage), prepend the backend domain
   if (!url.startsWith('http://') && !url.startsWith('https://')) {
     const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnx-app.fly.dev/api/'
     // Remove '/api' or '/api/' from the end to get the base backend URL
     const baseUrl = apiUrl.replace(/\/api\/?$/, '')
     fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
   }

   // Fetch the file directly as it's a static media resource
   const response = await fetch(fullUrl)
   if (!response.ok) throw new Error(`HTTP ${response.status}`)
   const blob = await response.blob()

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
   // Fallback: try opening the absolute URL directly in a new tab
   let fallbackUrl = url
   if (!url.startsWith('http://') && !url.startsWith('https://')) {
     const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnx-app.fly.dev/api/'
     const baseUrl = apiUrl.replace(/\/api\/?$/, '')
     fallbackUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
   }
   window.open(fallbackUrl, '_blank')
 } finally {
   setDownloadingId(null)
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
 {/* Certificate Visual Preview */}
 <div className="relative h-44 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/30 dark:via-zinc-900 dark:to-blue-950/20 flex items-center justify-center overflow-hidden">
   {/* Decorative elements */}
   <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]">
     <div className="absolute top-4 left-4 w-20 h-20 border-2 border-blue-500 rounded-full" />
     <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-blue-500 rounded-full" />
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-blue-400 rounded-full" />
   </div>
   
   {/* Certificate icon */}
   <div className="relative flex flex-col items-center gap-3">
     <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 group-hover:scale-105 transition-transform duration-300">
       <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
     </div>
     <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-100 dark:border-zinc-700/50 shadow-sm">
       <Sparkles className="h-3 w-3 text-amber-500" />
       <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
         Verified
       </span>
     </div>
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
   {cert.pdf_url ? (
   <button
   onClick={() => handleDownload(cert.pdf_url!, cert.course_title, cert.certificate_id)}
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
 ) : (
   <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
     <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-500 dark:border-t-zinc-400" />
     Generating...
   </div>
 )}
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
 </div>
)
}
