'use client'

import { useState, useEffect } from 'react'
import { manualRegisterUser, manualEnrollUser, generateCertificate, fetchAllCourses, type AdminCourse } from '@/lib/admin'
import { UserPlus, GraduationCap, Award, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type FeedbackState = { type: 'success' | 'error'; message: string } | null

function FormCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function FeedbackBanner({ feedback, onDismiss }: { feedback: FeedbackState; onDismiss: () => void }) {
  if (!feedback) return null
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl text-sm mb-4 animate-fade-up-sm",
        feedback.type === 'success'
          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          : "bg-red-500/10 border border-red-500/20 text-red-400"
      )}
    >
      {feedback.type === 'success' ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">{feedback.message}</span>
      <button onClick={onDismiss} className="text-xs opacity-60 hover:opacity-100 transition-opacity">Dismiss</button>
    </div>
  )
}

function InputField({
  label, type = 'text', value, onChange, placeholder, required = false,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl bg-zinc-800/50 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
      />
    </div>
  )
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-zinc-800/50 border border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all appearance-none"
      >
        <option value="" className="bg-zinc-900">{placeholder || 'Select...'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
        "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98]",
        loading && "opacity-50 cursor-not-allowed"
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  )
}

export default function StudentsPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([])

  // Register form
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regFirstName, setRegFirstName] = useState('')
  const [regLastName, setRegLastName] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regFeedback, setRegFeedback] = useState<FeedbackState>(null)

  // Enroll form
  const [enrollUserId, setEnrollUserId] = useState('')
  const [enrollCourseId, setEnrollCourseId] = useState('')
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [enrollFeedback, setEnrollFeedback] = useState<FeedbackState>(null)

  // Certificate form
  const [certUserId, setCertUserId] = useState('')
  const [certCourseId, setCertCourseId] = useState('')
  const [certLoading, setCertLoading] = useState(false)
  const [certFeedback, setCertFeedback] = useState<FeedbackState>(null)

  useEffect(() => {
    fetchAllCourses()
      .then(setCourses)
      .catch(() => {})
  }, [])

  const courseOptions = courses.map((c) => ({ value: String(c.id), label: c.title }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegLoading(true)
    setRegFeedback(null)
    try {
      const result = await manualRegisterUser({
        email: regEmail,
        password: regPassword,
        first_name: regFirstName,
        last_name: regLastName,
      })
      setRegFeedback({ type: 'success', message: `User created successfully (ID: ${result.user_id})` })
      setRegEmail('')
      setRegPassword('')
      setRegFirstName('')
      setRegLastName('')
    } catch (err: any) {
      setRegFeedback({ type: 'error', message: err?.response?.data?.error || 'Registration failed' })
    } finally {
      setRegLoading(false)
    }
  }

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnrollLoading(true)
    setEnrollFeedback(null)
    try {
      const result = await manualEnrollUser({
        user_id: Number(enrollUserId),
        course_id: Number(enrollCourseId),
      })
      setEnrollFeedback({ type: 'success', message: result.status })
      setEnrollUserId('')
      setEnrollCourseId('')
    } catch (err: any) {
      setEnrollFeedback({ type: 'error', message: err?.response?.data?.error || 'Enrollment failed' })
    } finally {
      setEnrollLoading(false)
    }
  }

  const handleCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCertLoading(true)
    setCertFeedback(null)
    try {
      const result = await generateCertificate({
        user_id: Number(certUserId),
        course_id: Number(certCourseId),
      })
      setCertFeedback({ type: 'success', message: result.status })
      setCertUserId('')
      setCertCourseId('')
    } catch (err: any) {
      setCertFeedback({ type: 'error', message: err?.response?.data?.error || 'Certificate generation failed' })
    } finally {
      setCertLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Student Management</h1>
        <p className="text-sm text-zinc-500 mt-1">Register students, manage enrollments, and generate certificates.</p>
      </div>

      {/* Register User */}
      <FormCard icon={UserPlus} title="Register New Student" description="Manually create a student account">
        <FeedbackBanner feedback={regFeedback} onDismiss={() => setRegFeedback(null)} />
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" value={regFirstName} onChange={setRegFirstName} placeholder="John" />
            <InputField label="Last Name" value={regLastName} onChange={setRegLastName} placeholder="Doe" />
          </div>
          <InputField label="Email" type="email" value={regEmail} onChange={setRegEmail} placeholder="student@email.com" required />
          <InputField label="Password" type="password" value={regPassword} onChange={setRegPassword} placeholder="Minimum 8 characters" required />
          <SubmitButton loading={regLoading} label="Register Student" />
        </form>
      </FormCard>

      {/* Enroll User */}
      <FormCard icon={GraduationCap} title="Enroll Student in Course" description="Manually enroll a student (bypasses payment)">
        <FeedbackBanner feedback={enrollFeedback} onDismiss={() => setEnrollFeedback(null)} />
        <form onSubmit={handleEnroll} className="space-y-4">
          <InputField label="User ID" type="number" value={enrollUserId} onChange={setEnrollUserId} placeholder="Enter the student's user ID" required />
          <SelectField label="Course" value={enrollCourseId} onChange={setEnrollCourseId} options={courseOptions} placeholder="Select a course" />
          <SubmitButton loading={enrollLoading} label="Enroll Student" />
        </form>
      </FormCard>

      {/* Generate Certificate */}
      <FormCard icon={Award} title="Generate Certificate" description="Force-generate a certificate for a student">
        <FeedbackBanner feedback={certFeedback} onDismiss={() => setCertFeedback(null)} />
        <form onSubmit={handleCertificate} className="space-y-4">
          <InputField label="User ID" type="number" value={certUserId} onChange={setCertUserId} placeholder="Enter the student's user ID" required />
          <SelectField label="Course" value={certCourseId} onChange={setCertCourseId} options={courseOptions} placeholder="Select a course" />
          <SubmitButton loading={certLoading} label="Generate Certificate" />
        </form>
      </FormCard>
    </div>
  )
}
