'use client'

import { useState, useEffect } from 'react'
import { fetchMyCertificates, type Certificate } from '@/lib/dashboard'
import { Award, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Certificates
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Your earned course completion certificates.
        </p>
      </div>

      {/* Certificates grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.certificate_id}
              className="relative group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 dark:from-amber-900/10 to-transparent rounded-bl-3xl" />

              {/* Icon */}
              <div className="relative h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2">
                {cert.course_title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                Issued {new Date(cert.issued_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-4">
                ID: {cert.certificate_id.slice(0, 8)}...
              </p>

              {/* Download button */}
              {cert.pdf_url ? (
                <a
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  Processing...
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            No certificates yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs mb-5">
            Complete a course to earn your first certificate!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Go to My Courses
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
