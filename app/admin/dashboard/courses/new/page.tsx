'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createCourse, requestNewCourseUploadUrl } from '@/lib/admin'
import { uploadThumbnailAction } from '@/app/actions/upload'
import { Loader2, ArrowLeft, ImagePlus, X, Video, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import * as tus from 'tus-js-client'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

function NewCourseVideoUploader({ courseTitle, onVideoUploaded, onUploadingChange }: { courseTitle: string, onVideoUploaded: (videoId: string) => void, onUploadingChange?: (uploading: boolean) => void }) {
  const [uploading, setUploadingState] = useState(false)
  
  const setUploading = (val: boolean) => {
    setUploadingState(val)
    if (onUploadingChange) onUploadingChange(val)
  }

  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!courseTitle) {
      setError('Please enter a course title first before uploading a preview video.')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      const { video_id, library_id, authorization_signature, authorization_expire } = await requestNewCourseUploadUrl(courseTitle)

      const upload = new tus.Upload(file, {
        endpoint: 'https://video.bunnycdn.com/tusupload',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          AuthorizationSignature: authorization_signature,
          AuthorizationExpire: authorization_expire.toString(),
          VideoId: video_id,
          LibraryId: library_id,
        },
        metadata: {
          filetype: file.type,
          title: file.name,
        },
        onError: function (error) {
          console.error('Failed because: ' + error)
          setError('Upload failed. Please try again.')
          setUploading(false)
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          setProgress(Number(percentage))
        },
        onSuccess: function () {
          setSuccess(true)
          setUploading(false)
          onVideoUploaded(video_id)
        },
      })

      upload.start()

    } catch (err: any) {
      console.error(err)
      setError('Failed to request upload URL.')
      setUploading(false)
    }
  }

  if (success && !uploading) {
    return (
      <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-center mt-2">
        <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm text-emerald-400 font-medium">Video uploaded successfully!</p>
        <p className="text-xs text-zinc-400 mt-1">Bunny Stream is now encoding it.</p>
        <label className="mt-3 cursor-pointer inline-flex px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors">
          Replace Video
          <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    )
  }

  return (
    <div className="mt-2 p-4 border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl text-center relative overflow-hidden">
      {uploading && (
        <div 
          className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <Video className="h-6 w-6 text-zinc-700 dark:text-zinc-300 mx-auto mb-2" />
      <p className="text-xs text-zinc-400">
        {uploading ? `Uploading... ${progress}%` : "Select a video to upload directly to Bunny Stream."}
      </p>
      
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      <button 
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "mt-3 inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 shadow-sm dark:shadow-none rounded-lg text-xs font-medium transition-colors cursor-pointer",
          uploading && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {uploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
        {uploading ? 'Uploading...' : 'Select Video File'}
      </button>
      <input 
        ref={fileInputRef}
        type="file" 
        accept="video/*" 
        className="hidden" 
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  )
}

export default function NewCoursePage() {
 const router = useRouter()
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const [title, setTitle] = useState('')
 const [description, setDescription] = useState('')
 const [price, setPrice] = useState('0')
 const [thumbnailUrl, setThumbnailUrl] = useState('')
 const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
 const [uploadingThumb, setUploadingThumb] = useState(false)
 const [uploadingVideo, setUploadingVideo] = useState(false)
 const [previewVideoId, setPreviewVideoId] = useState<string | null>(null)
 const fileInputRef = useRef<HTMLInputElement>(null)

 const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0]
 if (!file) return

 // Show local preview immediately
 const reader = new FileReader()
 reader.onload = (ev) => setThumbnailPreview(ev.target?.result as string)
 reader.readAsDataURL(file)

 // Upload to Supabase
 setUploadingThumb(true)
 try {
 const formData = new FormData()
 formData.append('file', file)
 const { url, error: uploadError } = await uploadThumbnailAction(formData)
 if (uploadError) throw new Error(uploadError)
 if (url) setThumbnailUrl(url)
 } catch (err: any) {
 setError(err.message || 'Failed to upload thumbnail')
 setThumbnailPreview(null)
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
 const course = await createCourse({
 title,
 description,
 price: Number(price),
 is_published: false,
 thumbnail: thumbnailUrl || undefined,
 preview_video_id: previewVideoId || undefined,
 })
 
 // Redirect to the course builder edit page
 router.push(`/admin/dashboard/courses/${course.slug}/edit`)
 } catch (err: any) {
 setError(err?.response?.data?.error || 'Failed to create course. Please try again.')
 setLoading(false)
 }
 }

 return (
 <div className="max-w-2xl mx-auto space-y-8">
 {/* Header */}
 <div>
 <Link 
 href="/admin/dashboard/courses"
 className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors mb-4"
 >
 <ArrowLeft className="h-5 w-5" />
 Back to Courses
 </Link>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Create New Course</h1>
 <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
 Give your course a name and basic details to get started. You can change these later.
 </p>
 </div>

 <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700/60 shadow-sm dark:shadow-none rounded-[20px] p-6">
 <form onSubmit={handleSubmit} className="space-y-6">
 {error && (
 <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
 {error}
 </div>
)}

 <div className="space-y-4">
 {/* Thumbnail Upload */}
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
 <X className="h-5 w-5" />
 </button>
)}
 </div>
) : (
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="w-full h-44 border-2 border-dashed border-zinc-300 dark:border-zinc-700/70 hover:border-blue-500/40 dark:hover:border-blue-500/40 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900/30 hover:bg-blue-50 dark:hover:bg-blue-500/5"
 >
 <ImagePlus className="h-8 w-8 text-zinc-600 dark:text-zinc-400 dark:text-zinc-600" />
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
 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
 Preview Video
 </label>
 <NewCourseVideoUploader courseTitle={title} onVideoUploaded={setPreviewVideoId} onUploadingChange={setUploadingVideo} />
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
 <div className="border border-zinc-200 dark:border-zinc-700/70 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
  <RichTextEditor
    content={description}
    onChange={setDescription}
  />
 </div>
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

 <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700/60 flex justify-end gap-3">
 <Link
 href="/admin/dashboard/courses"
 className={cn("px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors", uploadingVideo && "opacity-50 cursor-not-allowed pointer-events-none")}
 >
 Cancel
 </Link>
 <button
 type="submit"
 disabled={loading || !title || uploadingThumb || uploadingVideo}
 title={uploadingVideo ? "Please wait for video to finish uploading..." : undefined}
 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {(loading || uploadingVideo || uploadingThumb) && <Loader2 className="h-5 w-5 animate-spin" />}
 Create & Continue
 </button>
 </div>
 </form>
 </div>
 </div>
)
}
