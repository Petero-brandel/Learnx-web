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
 createQuizForLesson,
 saveQuizBulk,
 type AdminCourse,
 type AdminModule,
 type AdminLesson,
 type AdminQuiz,
 type AdminQuestion,
 type AdminAnswer
} from '@/lib/admin'
import { 
 Loader2, ArrowLeft, GripVertical, Plus, Trash2, 
 Settings, Video, FileText, File, Save, CheckCircle2, AlertCircle,
 HelpCircle, Clock, ChevronDown, ChevronUp, CircleDot
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { uploadPdfAction } from '@/app/actions/upload'
import RichTextEditor from '@/components/ui/RichTextEditor'
import CourseSettingsModal from '@/components/admin/CourseSettingsModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

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

// --- Sub-Components ------------------------------------------

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

 const Icon = lesson.content_type === 'video' ? Video : lesson.content_type === 'pdf' ? File : lesson.content_type === 'quiz' ? HelpCircle : FileText

 return (
 <div
 ref={setNodeRef}
 style={style}
 className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 shadow-sm dark:shadow-none rounded-xl group relative"
 >
 <button 
 className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing p-1"
 {...attributes} 
 {...listeners}
 >
 <GripVertical className="h-4 w-4" />
 </button>
 
 <div className="p-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
 <Icon className="h-4 w-4 text-zinc-400" />
 </div>

 <div className="flex-1 min-w-0">
 <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-200 truncate">{lesson.title}</h4>
 </div>

 <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
 <button onClick={onEdit} className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
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
 <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-700/60 shadow-sm dark:shadow-none rounded-2xl p-4 space-y-4">
 {/* Module Header */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 {isEditing ? (
 <div className="flex items-center gap-2 flex-1">
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 shadow-sm dark:shadow-none"
 autoFocus
 onKeyDown={(e) => e.key === 'Enter' && handleSave()}
 />
 <button onClick={handleSave} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-md">
 <CheckCircle2 className="h-4 w-4" />
 </button>
 </div>
) : (
 <div className="flex items-center gap-3">
 <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{module.title}</h3>
 <button onClick={() => setIsEditing(true)} className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
 <Settings className="h-3.5 w-3.5" />
 </button>
 </div>
)}

 <div className="flex items-center gap-2">
 <button 
              onClick={() => onAddLesson(module.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
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
 <div className="pl-2 border-l border-zinc-200 dark:border-zinc-700/60 space-y-2">
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

function VideoUploader({ lessonId, initialVideoId, onUploadingChange }: { lessonId: number, initialVideoId: string | null, onUploadingChange?: (uploading: boolean) => void }) {
  const [uploading, setUploadingState] = useState(false)
  
  const setUploading = (val: boolean) => {
    setUploadingState(val)
    if (onUploadingChange) onUploadingChange(val)
  }

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
        <label className="mt-3 cursor-pointer inline-flex px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors">
          Replace Video
          <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    )
  }

  return (
    <div className="p-4 border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl text-center relative overflow-hidden">
      {uploading && (
        <div 
          className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <Video className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
      <p className="text-xs text-zinc-400">
        {uploading ? `Uploading... ${progress}%` :"Select a video to upload directly to Bunny Stream."}
      </p>
      
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      <button 
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "mt-3 inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 shadow-sm dark:shadow-none rounded-lg text-xs font-medium transition-colors cursor-pointer",
          uploading &&"opacity-50 cursor-not-allowed pointer-events-none"
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

function PdfUploader({ lesson, onUpdateUrl, onUploadingChange }: { lesson: AdminLesson, onUpdateUrl: (url: string) => void, onUploadingChange?: (uploading: boolean) => void }) {
  const [uploading, setUploadingState] = useState(false)
  
  const setUploading = (val: boolean) => {
    setUploadingState(val)
    if (onUploadingChange) onUploadingChange(val)
  }

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
    let fileName = lesson.file_url?.split('/').pop() || lesson.file_url || 'Document.pdf';
    if (fileName.match(/^\d{13}-/)) {
      fileName = fileName.substring(fileName.indexOf('-') + 1);
    }
    try { fileName = decodeURIComponent(fileName); } catch(e){}

    return (
      <div className="p-3 border border-blue-500/30 bg-blue-500/10 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sm text-zinc-200 font-medium truncate" title={fileName}>{fileName}</p>
            <p className="text-[10px] text-blue-400/80 uppercase tracking-wider mt-0.5 font-semibold">PDF Attached</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0 ml-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Replace
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
            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl text-center relative overflow-hidden">
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
            "mt-3 inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer",
            uploading &&"opacity-50 cursor-not-allowed pointer-events-none"
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
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">OR</span>
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-zinc-400">Host Externally (Google Drive, etc.)</label>
        <input
          type="url"
          value={lesson.file_url || ''}
          onChange={(e) => onUpdateUrl(e.target.value)}
          placeholder="https://example.com/document.pdf"
          className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50"
        />
      </div>
    </div>
  )
}

// --- Quiz Builder --------------------------------------------

function QuizBuilder({ lesson, onSaved }: { lesson: AdminLesson, onSaved: () => Promise<void> }) {
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [settingsOpen, setSettingsOpen] = useState(true)
 const [error, setError] = useState<string | null>(null)
 const [success, setSuccess] = useState(false)

 // Quiz state
 const [quizId, setQuizId] = useState<number | null>(lesson.quiz?.id ?? null)
 const [passingScore, setPassingScore] = useState(lesson.quiz?.passing_score ?? 70)
 const [maxAttempts, setMaxAttempts] = useState(lesson.quiz?.max_attempts ?? 0)
 const [timeLimitMinutes, setTimeLimitMinutes] = useState(lesson.quiz?.time_limit_minutes ?? 0)
 const [isRequired, setIsRequired] = useState(lesson.quiz?.is_required ?? true)
 const [showCorrectAnswers, setShowCorrectAnswers] = useState(lesson.quiz?.show_correct_answers ?? true)
 const [shuffleQuestions, setShuffleQuestions] = useState(lesson.quiz?.shuffle_questions ?? false)
 const [shuffleAnswers, setShuffleAnswers] = useState(lesson.quiz?.shuffle_answers ?? false)
 const [questions, setQuestions] = useState<AdminQuestion[]>(lesson.quiz?.questions ?? [])

  useEffect(() => {
    // Check for draft first
    const draftStr = localStorage.getItem(`quiz_draft_${lesson.id}`)
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr)
        if (lesson.quiz) setQuizId(lesson.quiz.id ?? null)
        setPassingScore(draft.passingScore ?? 70)
        setMaxAttempts(draft.maxAttempts ?? 0)
        setTimeLimitMinutes(draft.timeLimitMinutes ?? 0)
        setIsRequired(draft.isRequired ?? true)
        setShowCorrectAnswers(draft.showCorrectAnswers ?? true)
        setShuffleQuestions(draft.shuffleQuestions ?? false)
        setShuffleAnswers(draft.shuffleAnswers ?? false)
        setQuestions(draft.questions ?? [])
        setLoading(false)
        return
      } catch (e) {
        // ignore parse error
      }
    }

    // If quiz already exists, load its data
    if (lesson.quiz) {
      setQuizId(lesson.quiz.id ?? null)
      setPassingScore(lesson.quiz.passing_score)
      setMaxAttempts(lesson.quiz.max_attempts)
      setTimeLimitMinutes(lesson.quiz.time_limit_minutes)
      setIsRequired(lesson.quiz.is_required)
      setShowCorrectAnswers(lesson.quiz.show_correct_answers)
      setShuffleQuestions(lesson.quiz.shuffle_questions)
      setShuffleAnswers(lesson.quiz.shuffle_answers)
      setQuestions(lesson.quiz.questions ?? [])
    }
    setLoading(false)
  }, [lesson.quiz, lesson.id])

  // Auto-save draft to localStorage whenever fields change
  useEffect(() => {
    if (loading || saving) return
    const draft = {
      passingScore, maxAttempts, timeLimitMinutes, isRequired, 
      showCorrectAnswers, shuffleQuestions, shuffleAnswers, questions
    }
    localStorage.setItem(`quiz_draft_${lesson.id}`, JSON.stringify(draft))
  }, [passingScore, maxAttempts, timeLimitMinutes, isRequired, showCorrectAnswers, shuffleQuestions, shuffleAnswers, questions, lesson.id, loading, saving])

 const handleAddQuestion = (type: 'multiple_choice' | 'true_false') => {
 const newQ: AdminQuestion = {
 text: '',
 question_type: type,
 order: questions.length,
 answers: type === 'true_false'
 ? [{ text: 'True', is_correct: true }, { text: 'False', is_correct: false }]
 : [{ text: '', is_correct: true }, { text: '', is_correct: false }],
 }
 setQuestions([...questions, newQ])
 }

 const handleDeleteQuestion = (idx: number) => {
 setQuestions(questions.filter((_, i) => i !== idx))
 }

 const handleQuestionTextChange = (idx: number, text: string) => {
 const updated = [...questions]
 updated[idx] = { ...updated[idx], text }
 setQuestions(updated)
 }

  const handleAnswerTextChange = (qIdx: number, aIdx: number, text: string) => {
  const updated = [...questions]
  const answers = [...updated[qIdx].answers]
  answers[aIdx] = { ...answers[aIdx], text }
  updated[qIdx] = { ...updated[qIdx], answers }
  setQuestions(updated)
  }

 const handleCorrectAnswerChange = (qIdx: number, aIdx: number) => {
 const updated = [...questions]
 const answers = updated[qIdx].answers.map((a, i) => ({ ...a, is_correct: i === aIdx }))
 updated[qIdx] = { ...updated[qIdx], answers }
 setQuestions(updated)
 }

 const handleAddAnswer = (qIdx: number) => {
 const updated = [...questions]
 const answers = [...updated[qIdx].answers, { text: '', is_correct: false }]
 updated[qIdx] = { ...updated[qIdx], answers }
 setQuestions(updated)
 }

 const handleDeleteAnswer = (qIdx: number, aIdx: number) => {
 const updated = [...questions]
 const answers = [...updated[qIdx].answers.filter((_, i) => i !== aIdx)]
 // If we deleted the correct answer, make the first one correct
 if (!answers.some(a => a.is_correct) && answers.length > 0) {
 answers[0] = { ...answers[0], is_correct: true }
 }
 updated[qIdx] = { ...updated[qIdx], answers }
 setQuestions(updated)
 }

 const handleSaveQuiz = async () => {
 setSaving(true)
 setError(null)
 setSuccess(false)

 try {
 let currentQuizId = quizId

 // Create quiz if it doesn't exist yet
 if (!currentQuizId) {
 const created = await createQuizForLesson(lesson.id)
 currentQuizId = created.id!
 setQuizId(currentQuizId)
 }

 // Bulk save settings + questions + answers
 await saveQuizBulk(currentQuizId, {
 passing_score: passingScore,
 max_attempts: maxAttempts,
 time_limit_minutes: timeLimitMinutes,
 is_required: isRequired,
 show_correct_answers: showCorrectAnswers,
 shuffle_questions: shuffleQuestions,
 shuffle_answers: shuffleAnswers,
 questions: questions.map((q, i) => ({
 text: q.text,
 question_type: q.question_type,
 order: i,
 answers: q.answers,
 })),
 })

 setSuccess(true)
 localStorage.removeItem(`quiz_draft_${lesson.id}`) // Clear draft on successful save
 await onSaved()
 setTimeout(() => setSuccess(false), 3000)
 } catch (err: any) {
 console.error(err)
 setError(err.response?.data?.detail || 'Failed to save quiz.')
 } finally {
 setSaving(false)
 }
 }

 if (loading) {
 return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>
 }

 return (
 <div className="space-y-4">
 {/* Settings Section */}
 <button
 type="button"
 onClick={() => setSettingsOpen(!settingsOpen)}
 className="w-full flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
 >
 <span className="flex items-center gap-2">
 <Settings className="h-3.5 w-3.5" />
 Quiz Settings
 </span>
 {settingsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
 </button>

 {settingsOpen && (
 <div className="space-y-3 p-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl shadow-sm dark:shadow-none">
 {/* Passing Score */}
 <div>
 <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">Passing Score (%)</label>
 <input
 type="number"
 min={0}
 max={100}
 value={passingScore}
 onChange={(e) => setPassingScore(Number(e.target.value))}
 className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50"
 />
 </div>

 {/* Max Attempts */}
 <div>
 <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">Max Attempts <span className="text-zinc-600">(0 = unlimited)</span></label>
 <input
 type="number"
 min={0}
 value={maxAttempts}
 onChange={(e) => setMaxAttempts(Number(e.target.value))}
 className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50"
 />
 </div>

 {/* Time Limit */}
 <div>
 <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">Time Limit (minutes) <span className="text-zinc-600">(0 = no limit)</span></label>
 <input
 type="number"
 min={0}
 value={timeLimitMinutes}
 onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
 className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50"
 />
 </div>

 {/* Toggles */}
 <div className="space-y-2 pt-1">
 {[
 { label: 'Required to pass', value: isRequired, setter: setIsRequired },
 { label: 'Show correct answers', value: showCorrectAnswers, setter: setShowCorrectAnswers },
 { label: 'Shuffle questions', value: shuffleQuestions, setter: setShuffleQuestions },
 { label: 'Shuffle answers', value: shuffleAnswers, setter: setShuffleAnswers },
 ].map(({ label, value, setter }) => (
 <button
 key={label}
 type="button"
 onClick={() => setter(!value)}
 className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
 >
 <span className="text-xs text-zinc-300">{label}</span>
 <div className={cn(
"w-8 h-[18px] rounded-full transition-colors relative",
 value ?"bg-blue-500" :"bg-zinc-200 dark:bg-zinc-700"
)}>
 <div className={cn(
"absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-transform",
 value ?"left-[16px]" :"left-[2px]"
)} />
 </div>
 </button>
))}
 </div>
 </div>
)}

 {/* Questions Section */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <h4 className="text-xs font-medium text-zinc-400">Questions ({questions.length})</h4>
 </div>

 {questions.length === 0 && (
 <div className="p-4 text-center border border-dashed border-zinc-300 dark:border-zinc-700/70 rounded-xl bg-zinc-900/20">
 <HelpCircle className="h-5 w-5 text-zinc-600 mx-auto mb-1.5" />
 <p className="text-[11px] text-zinc-500">No questions yet. Add one below.</p>
 </div>
)}

 {questions.map((q, qIdx) => (
 <div key={qIdx} className="p-3 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700/60 shadow-sm dark:shadow-none rounded-xl space-y-2.5">
 {/* Question header */}
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
 Q{qIdx + 1} Â· {q.question_type === 'true_false' ? 'True/False' : 'Multiple Choice'}
 </span>
 <button
 type="button"
 onClick={() => handleDeleteQuestion(qIdx)}
 className="p-1 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
 >
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>

 {/* Question text */}
 <textarea
 rows={2}
 value={q.text}
 onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
 placeholder="Enter your question..."
 className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 resize-none"
 />

 {/* Answers */}
 <div className="space-y-1.5 pl-1">
 {q.answers.map((a, aIdx) => (
 <div key={aIdx} className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => handleCorrectAnswerChange(qIdx, aIdx)}
 className={cn(
"shrink-0 h-4 w-4 rounded-full border-2 transition-colors flex items-center justify-center",
 a.is_correct
 ?"border-emerald-500 bg-emerald-500"
 :"border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-400"
)}
 >
 {a.is_correct && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
 </button>

 {q.question_type === 'true_false' ? (
 <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">{a.text}</span>
) : (
 <input
 type="text"
 value={a.text}
 onChange={(e) => handleAnswerTextChange(qIdx, aIdx, e.target.value)}
 placeholder={`Answer ${aIdx + 1}`}
 className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-md text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50"
 />
)}

 {q.question_type !== 'true_false' && q.answers.length > 2 && (
 <button
 type="button"
 onClick={() => handleDeleteAnswer(qIdx, aIdx)}
 className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors"
 >
 <Trash2 className="h-3 w-3" />
 </button>
)}
 </div>
))}

 {q.question_type !== 'true_false' && (
 <button
 type="button"
 onClick={() => handleAddAnswer(qIdx)}
 className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mt-1"
 >
 <Plus className="h-3 w-3" /> Add Answer
 </button>
)}
 </div>
 </div>
))}

 {/* Add Question Buttons */}
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => handleAddQuestion('multiple_choice')}
 className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors"
 >
 <CircleDot className="h-3.5 w-3.5" /> Multiple Choice
 </button>
 <button
 type="button"
 onClick={() => handleAddQuestion('true_false')}
 className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-medium transition-colors"
 >
 <CheckCircle2 className="h-3.5 w-3.5" /> True / False
 </button>
 </div>
 </div>

 {/* Status Messages */}
 {error && (
 <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
 <p className="text-xs text-red-400">{error}</p>
 </div>
)}
 {success && (
 <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
 <p className="text-xs text-emerald-400 font-medium">Quiz saved successfully!</p>
 </div>
)}

 {/* Save Button */}
 <button
 type="button"
 onClick={handleSaveQuiz}
 disabled={saving || questions.length === 0}
 className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
 >
 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
 {saving ? 'Saving Quiz...' : 'Save Quiz'}
 </button>
 </div>
)
}

// --- Main Page -----------------------------------------------

export default function CourseBuilderPage() {
 const params = useParams()
 const slug = params.slug as string
 const [course, setCourse] = useState<AdminCourse | null>(null)
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 
  // Right Panel State (Lesson Editing)
  const [activeLesson, setActiveLesson] = useState<AdminLesson | null>(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [isUploadingContent, setIsUploadingContent] = useState(false)
 
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
  } catch (e: any) {
  console.error(e)
  throw e
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

 const [confirmOpen, setConfirmOpen] = useState(false)
 const [confirmPayload, setConfirmPayload] = useState<null | { type: 'module' | 'lesson'; id: number; title?: string }>(null)

 const handleDeleteModule = (id: number) => {
 setConfirmPayload({ type: 'module', id })
 setConfirmOpen(true)
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

 const handleDeleteLesson = (id: number) => {
 setConfirmPayload({ type: 'lesson', id })
 setConfirmOpen(true)
 }

 const executeConfirm = async () => {
 if (!confirmPayload) return
 setConfirmOpen(false)
 const { type, id } = confirmPayload
 setSaving(true)
 try {
 if (type === 'module') {
 await deleteModule(id)
 setCourse(prev => prev ? { ...prev, modules: prev.modules.filter(m => m.id !== id) } : prev)
 } else {
 await deleteLesson(id)
 const updated = await fetchCourse(slug)
 setCourse(updated)
 if (activeLesson?.id === id) setActiveLesson(null)
 }
 } catch (err) {
 console.error('Delete failed', err)
 } finally {
 setSaving(false)
 setConfirmPayload(null)
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
 // Close the edit pane on save so it's ready for the next edit
 setActiveLesson(null)
 } finally {
 setSaving(false)
 }
 }

 if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-zinc-500" /></div>
 if (!course) return <div>Course not found</div>

 return (
 <div className="flex flex-col lg:flex-row gap-6">
  <ConfirmDialog
    open={confirmOpen}
    title={confirmPayload?.type === 'module' ? 'Delete Module' : 'Delete Lesson'}
    description={confirmPayload?.type === 'module' ? 'Delete this module and all its lessons?' : 'Delete this lesson?'}
    confirmLabel="Delete"
    cancelLabel="Cancel"
    loading={saving}
    onConfirm={executeConfirm}
    onCancel={() => { setConfirmOpen(false); setConfirmPayload(null) }}
  />
  {showSettingsModal && (
    <CourseSettingsModal
      course={course}
      onClose={() => setShowSettingsModal(false)}
      onSave={handleUpdateCourseDetails}
    />
  )}
 {/* Left Column: Curriculum Builder */}
 <div className="flex-1 space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <Link 
                  href="/admin/dashboard/courses"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Link>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{course.title}</h1>
 </div>
  <div className="flex items-center gap-3">
  {saving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
  <button
    onClick={() => setShowSettingsModal(true)}
    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-sm font-semibold transition-colors shadow-sm"
  >
    <Settings className="h-4 w-4" />
    <span className="hidden sm:inline">Settings</span>
  </button>
  <button
  onClick={() => handleUpdateCourseDetails({ is_published: !course.is_published })}
  className={cn(
  "px-5 py-2 rounded-xl text-sm font-bold transition-all border",
  course.is_published 
  ?"bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
  :"bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600"
  )}
 >
 {course.is_published ? 'Unpublish' : 'Publish'}
 </button>
 </div>
 </div>

 {/* Modules List */}
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">Curriculum</h2>
                <button 
                  onClick={handleAddModule}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl text-sm font-semibold transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add Module
                </button>
 </div>

 {course.modules.length === 0 ? (
 <div className="p-8 text-center border border-dashed border-zinc-300 dark:border-zinc-700/70 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30">
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
 <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700/60 shadow-sm dark:shadow-none rounded-2xl p-5 min-h-[400px]">
 {!activeLesson ? (
 <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60 min-h-[300px]">
 <Settings className="h-8 w-8 text-zinc-500" />
 <p className="text-sm text-zinc-400">Select a lesson to edit its content.</p>
 </div>
) : (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Edit Lesson</h3>
  <button 
    onClick={() => !isUploadingContent && setActiveLesson(null)} 
    disabled={isUploadingContent}
    title={isUploadingContent ? "Please wait for upload to finish..." : undefined}
    className={cn("text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors", isUploadingContent && "opacity-50 cursor-not-allowed")}
  >
  Close
  </button>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Lesson Title</label>
 <input
 type="text"
 value={activeLesson.title}
 onChange={(e) => setActiveLesson({...activeLesson, title: e.target.value})}
 className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Content Type</label>
 <select
 value={activeLesson.content_type}
 onChange={(e) => setActiveLesson({...activeLesson, content_type: e.target.value as any})}
 className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/70 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500/50 appearance-none"
 >
 <option value="video">Video Lesson</option>
 <option value="text">Text Lesson</option>
 <option value="pdf">PDF Document</option>
 <option value="quiz">Quiz</option>
 </select>
 </div>

 <div className="pt-2 border-t border-zinc-800/60">
 {/* Placeholder for actual content editing based on type */}
 {activeLesson.content_type === 'video' && (
 <div className="space-y-3">
 <VideoUploader lessonId={activeLesson.id} initialVideoId={activeLesson.video_id} onUploadingChange={setIsUploadingContent} />
 </div>
)}

 {activeLesson.content_type === 'text' && (
 <div className="space-y-2">
 <RichTextEditor
 content={activeLesson.text_content || ''}
 onChange={(html) => setActiveLesson({...activeLesson, text_content: html})}
 />
 </div>
)}

 {activeLesson.content_type === 'pdf' && (
 <div className="space-y-3">
 <PdfUploader 
 lesson={activeLesson} 
 onUpdateUrl={(url) => setActiveLesson({...activeLesson, file_url: url})} 
 onUploadingChange={setIsUploadingContent}
 />
 </div>
)}

 {activeLesson.content_type === 'quiz' && (
 <QuizBuilder lesson={activeLesson} onSaved={async () => {
 const updated = await fetchCourse(slug)
 setCourse(updated)
 }} />
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
 disabled={saving || isUploadingContent}
 title={isUploadingContent ? "Please wait for upload to finish..." : undefined}
 className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {(saving || isUploadingContent) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
