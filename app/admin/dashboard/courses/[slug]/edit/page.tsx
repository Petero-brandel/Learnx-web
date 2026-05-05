'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  fetchCourse, 
  updateCourse, 
  createModule, 
  updateModule, 
  deleteModule, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  reorderLessons,
  requestUploadUrl,
  type AdminCourse,
  type AdminModule,
  type AdminLesson
} from '@/lib/admin'
import { 
  Loader2, ArrowLeft, GripVertical, Plus, Trash2, 
  Settings, Video, FileText, File, Save, CheckCircle2, AlertCircle 
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { uploadPdfAction } from '@/app/actions/upload'

// @dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import * as tus from 'tus-js-client'

// ─── Sub-Components ──────────────────────────────────────────

function SortableLesson({ lesson, onEdit, onDelete }: { lesson: AdminLesson, onEdit: () => void, onDelete: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `lesson-${lesson.id}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = lesson.content_type === 'video' ? Video : lesson.content_type === 'pdf' ? File : FileText

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl group relative"
    >
      <button 
        className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing p-1"
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <div className="p-2 bg-zinc-800/50 rounded-lg">
        <Icon className="h-4 w-4 text-zinc-400" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-200 truncate">{lesson.title}</h4>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md">
          <Settings className="h-4 w-4" />
        </button>
        <button onClick={onDelete} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function SortableModule({ 
  module, 
  courseId,
  onModuleUpdate,
  onModuleDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonsReordered
}: { 
  module: AdminModule,
  courseId: number,
  onModuleUpdate: (id: number, title: string) => void,
  onModuleDelete: (id: number) => void,
  onAddLesson: (moduleId: number) => void,
  onEditLesson: (lesson: AdminLesson) => void,
  onDeleteLesson: (lessonId: number) => void,
  onLessonsReordered: (moduleId: number, newLessons: AdminLesson[]) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(module.title)

  const handleSave = () => {
    onModuleUpdate(module.id, title)
    setIsEditing(false)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = module.lessons.findIndex(l => `lesson-${l.id}` === active.id)
    const newIndex = module.lessons.findIndex(l => `lesson-${l.id}` === over.id)

    const reordered = arrayMove(module.lessons, oldIndex, newIndex)
    onLessonsReordered(module.id, reordered)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 space-y-4">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button onClick={handleSave} className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-md">
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-zinc-100">{module.title}</h3>
            <button onClick={() => setIsEditing(true)} className="p-1 text-zinc-500 hover:text-zinc-300">
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onAddLesson(module.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Lesson
          </button>
          <button 
            onClick={() => onModuleDelete(module.id)}
            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lessons List (Drag and Drop) */}
      <div className="pl-2 border-l border-zinc-800/60 space-y-2">
        {module.lessons.length === 0 ? (
          <p className="text-xs text-zinc-500 py-2">No lessons in this module yet.</p>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={module.lessons.map(l => `lesson-${l.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {module.lessons.map(lesson => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={() => onEditLesson(lesson)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

function VideoUploader({ lessonId, initialVideoId }: { lessonId: number, initialVideoId: string | null }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(!!initialVideoId)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      const { video_id, library_id, authorization_signature, authorization_expire } = await requestUploadUrl(lessonId)

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
      <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-center">
        <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm text-emerald-400 font-medium">Video uploaded successfully!</p>
        <p className="text-xs text-zinc-400 mt-1">Bunny Stream is now encoding it.</p>
        <label className="mt-3 cursor-pointer inline-flex px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors">
          Replace Video
          <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    )
  }

  return (
    <div className="p-4 border border-dashed border-zinc-700 bg-zinc-800/30 rounded-xl text-center relative overflow-hidden">
      {uploading && (
        <div 
          className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <Video className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
      <p className="text-xs text-zinc-400">
        {uploading ? `Uploading... ${progress}%` : "Select a video to upload directly to Bunny Stream."}
      </p>
      
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      <button 
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "mt-3 inline-flex items-center px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer",
          uploading && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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

function PdfUploader({ lesson, onUpdateUrl }: { lesson: AdminLesson, onUpdateUrl: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const { url, error: uploadError } = await uploadPdfAction(formData)
      
      if (uploadError) throw new Error(uploadError)
      if (url) onUpdateUrl(url)

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to upload PDF.')
    } finally {
      setUploading(false)
    }
  }

  const hasFile = !!lesson.file_url

  if (hasFile && !uploading) {
    const isSupabase = lesson.file_url?.includes('supabase.co')
    const displayLabel = isSupabase ? 'Supabase PDF Attached' : 'External PDF Attached'
    const fileName = lesson.file_url?.split('/').pop() || lesson.file_url

    return (
      <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-center">
        <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm text-emerald-400 font-medium">{displayLabel}</p>
        <p className="text-xs text-emerald-400/80 mt-1 truncate px-4" title={lesson.file_url || ''}>
          {fileName}
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-2">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Replace File
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <button 
            type="button"
            onClick={() => onUpdateUrl('')}
            className="inline-flex px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border border-dashed border-zinc-700 bg-zinc-800/30 rounded-xl text-center relative overflow-hidden">
        <File className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
        <p className="text-xs text-zinc-400">
          Upload a PDF directly to Supabase Storage
        </p>
        
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        <button 
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "mt-3 inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer",
            uploading && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {uploading ? 'Uploading PDF...' : 'Select PDF File'}
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="application/pdf" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px bg-zinc-800 flex-1"></div>
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">OR</span>
        <div className="h-px bg-zinc-800 flex-1"></div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-zinc-400">Host Externally (Google Drive, etc.)</label>
        <input
          type="url"
          value={lesson.file_url || ''}
          onChange={(e) => onUpdateUrl(e.target.value)}
          placeholder="https://example.com/document.pdf"
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
        />
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────

export default function CourseBuilderPage() {
  const params = useParams()
  const slug = params.slug as string
  const [course, setCourse] = useState<AdminCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Right Panel State (Lesson Editing)
  const [activeLesson, setActiveLesson] = useState<AdminLesson | null>(null)
  
  useEffect(() => {
    fetchCourse(slug)
      .then(setCourse)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  // Handlers for Course Data
  const handleUpdateCourseDetails = async (data: Partial<AdminCourse>) => {
    if (!course) return
    setSaving(true)
    try {
      const updated = await updateCourse(slug, data)
      setCourse(updated)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  // Handlers for Modules
  const handleAddModule = async () => {
    if (!course) return
    setSaving(true)
    try {
      await createModule({ course: course.id, title: 'New Module' })
      const updated = await fetchCourse(slug)
      setCourse(updated)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateModule = async (id: number, title: string) => {
    setSaving(true)
    try {
      await updateModule(id, { title })
      setCourse(prev => prev ? {...prev, modules: prev.modules.map(m => m.id === id ? {...m, title} : m)} : prev)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Delete this module and all its lessons?')) return
    setSaving(true)
    try {
      await deleteModule(id)
      setCourse(prev => prev ? {...prev, modules: prev.modules.filter(m => m.id !== id)} : prev)
    } finally {
      setSaving(false)
    }
  }

  // Handlers for Lessons
  const handleAddLesson = async (moduleId: number) => {
    setSaving(true)
    try {
      await createLesson({ module: moduleId, title: 'New Lesson', content_type: 'video' })
      const updated = await fetchCourse(slug)
      setCourse(updated)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLesson = async (id: number) => {
    if (!confirm('Delete this lesson?')) return
    setSaving(true)
    try {
      await deleteLesson(id)
      const updated = await fetchCourse(slug)
      setCourse(updated)
      if (activeLesson?.id === id) setActiveLesson(null)
    } finally {
      setSaving(false)
    }
  }

  const handleLessonsReordered = async (moduleId: number, newLessons: AdminLesson[]) => {
    if (!course) return
    
    // Optimistic UI update
    setCourse(prev => {
      if (!prev) return prev
      return {
        ...prev,
        modules: prev.modules.map(m => m.id === moduleId ? { ...m, lessons: newLessons } : m)
      }
    })

    // Background save
    try {
      await reorderLessons(newLessons.map(l => l.id))
    } catch (e) {
      console.error('Failed to reorder lessons', e)
      // Revert if failed
      const updated = await fetchCourse(slug)
      setCourse(updated)
    }
  }

  // Right Panel Update
  const handleSaveLessonEdit = async (data: Partial<AdminLesson>) => {
    if (!activeLesson) return
    setSaving(true)
    try {
      await updateLesson(activeLesson.id, data)
      const updated = await fetchCourse(slug)
      setCourse(updated)
      // Update active lesson reference to the newly fetched one
      const newActive = updated.modules.flatMap(m => m.lessons).find(l => l.id === activeLesson.id)
      if (newActive) setActiveLesson(newActive)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-zinc-500" /></div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column: Curriculum Builder */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/admin/dashboard/courses"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">{course.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {saving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
            <button
              onClick={() => handleUpdateCourseDetails({ is_published: !course.is_published })}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                course.is_published 
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
              )}
            >
              {course.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">Curriculum</h2>
            <button 
              onClick={handleAddModule}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Module
            </button>
          </div>

          {course.modules.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
              <p className="text-sm text-zinc-500">No modules yet. Add a module to start building your curriculum.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map(module => (
                <SortableModule
                  key={module.id}
                  module={module}
                  courseId={course.id}
                  onModuleUpdate={handleUpdateModule}
                  onModuleDelete={handleDeleteModule}
                  onAddLesson={handleAddLesson}
                  onEditLesson={setActiveLesson}
                  onDeleteLesson={handleDeleteLesson}
                  onLessonsReordered={handleLessonsReordered}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Lesson Editor (Sticky) */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="sticky top-6">
          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 min-h-[400px]">
            {!activeLesson ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60 min-h-[300px]">
                <Settings className="h-8 w-8 text-zinc-500" />
                <p className="text-sm text-zinc-400">Select a lesson to edit its content.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-zinc-100">Edit Lesson</h3>
                  <button onClick={() => setActiveLesson(null)} className="text-zinc-500 hover:text-zinc-300">
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Lesson Title</label>
                    <input
                      type="text"
                      value={activeLesson.title}
                      onChange={(e) => setActiveLesson({...activeLesson, title: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Content Type</label>
                    <select
                      value={activeLesson.content_type}
                      onChange={(e) => setActiveLesson({...activeLesson, content_type: e.target.value as any})}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 appearance-none"
                    >
                      <option value="video">Video Lesson</option>
                      <option value="text">Text Lesson</option>
                      <option value="pdf">PDF Document</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/60">
                    {/* Placeholder for actual content editing based on type */}
                    {activeLesson.content_type === 'video' && (
                      <div className="space-y-3">
                        <VideoUploader lessonId={activeLesson.id} initialVideoId={activeLesson.video_id} />
                      </div>
                    )}

                    {activeLesson.content_type === 'text' && (
                      <div className="space-y-2">
                        <textarea
                          rows={6}
                          value={activeLesson.text_content || ''}
                          onChange={(e) => setActiveLesson({...activeLesson, text_content: e.target.value})}
                          placeholder="Write your lesson content here..."
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/50 resize-none"
                        />
                      </div>
                    )}

                    {activeLesson.content_type === 'pdf' && (
                      <div className="space-y-3">
                        <PdfUploader 
                          lesson={activeLesson} 
                          onUpdateUrl={(url) => setActiveLesson({...activeLesson, file_url: url})} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveLessonEdit({ 
                        title: activeLesson.title, 
                        content_type: activeLesson.content_type,
                        text_content: activeLesson.text_content,
                        file_url: activeLesson.file_url
                      })}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Lesson
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
