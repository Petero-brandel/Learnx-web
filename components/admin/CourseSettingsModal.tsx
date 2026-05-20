'use client'

import { useState, useRef } from 'react'
import { AdminCourse } from '@/lib/admin'
import { uploadThumbnailAction } from '@/app/actions/upload'
import { Loader2, ImagePlus, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseSettingsModalProps {
  course: AdminCourse
  onSave: (data: Partial<AdminCourse>) => Promise<void>
  onClose: () => void
}

export default function CourseSettingsModal({ course, onSave, onClose }: CourseSettingsModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description || '')
  const [price, setPrice] = useState(course.price?.toString() || '0')
  const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnail || '')
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(course.thumbnail || null)
  
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploadingThumb(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { url, error: uploadError } = await uploadThumbnailAction(formData)
      if (uploadError) throw new Error(uploadError)
      if (url) setThumbnailUrl(url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload thumbnail')
      setThumbnailPreview(course.thumbnail || null)
    } finally {
      setUploadingThumb(false)
    }
  }

  const removeThumbnail = () => {
    setThumbnailUrl('')
    setThumbnailPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: Partial<AdminCourse> = {
        title,
        description,
        price: Number(price) as any,
      }
      // Only include thumbnail if it was changed
      if (thumbnailUrl !== (course.thumbnail || '')) {
        (payload as any).thumbnail = thumbnailUrl || undefined
      }
      await onSave(payload)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.detail || JSON.stringify(err?.response?.data) || err?.message || 'Failed to update course details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Course Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="course-settings-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Course Thumbnail
                </label>
                {thumbnailPreview ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700/70 group">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                    />
                    {uploadingThumb && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                    {!uploadingThumb && (
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-44 border-2 border-dashed border-zinc-300 dark:border-zinc-700/70 hover:border-blue-500/40 dark:hover:border-blue-500/40 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900/30 hover:bg-blue-50 dark:hover:bg-blue-500/5"
                  >
                    <ImagePlus className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
                    <span className="text-xs text-zinc-500">Click to upload a thumbnail image</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">JPG, PNG, or WebP recommended</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailSelect}
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Course Title <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Prompt Engineering"
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm dark:shadow-none"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Short Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what students will learn..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none shadow-sm dark:shadow-none"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Price (NGN) <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm dark:shadow-none"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="course-settings-form"
            disabled={loading || !title || uploadingThumb}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
