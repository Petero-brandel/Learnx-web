'use client'

import { useState, useEffect, useMemo } from 'react'
import { manualRegisterUser, manualEnrollUser, generateCertificate, fetchAllCourses, fetchAllStudents, type AdminCourse, type AdminStudent } from '@/lib/admin'
import { UserPlus, GraduationCap, Award, Loader2, CheckCircle2, AlertCircle, Search, Users, Mail, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

type FeedbackState = { type: 'success' | 'error'; message: string } | null

function formatDate(dateStr: string): string {
 return new Date(dateStr).toLocaleDateString('en-US', {
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 })
}

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
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 shadow-sm dark:shadow-none">
 <div className="flex items-center gap-3 mb-5">
 <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
 <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
 </div>
 <div>
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">{title}</h3>
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
 ?"bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
 :"bg-red-500/10 border border-red-500/20 text-red-400"
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
 <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
 <input
 type={type}
 value={value}
 onChange={(e) => onChange(e.target.value)}
 placeholder={placeholder}
 required={required}
 className="w-full rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all shadow-sm dark:shadow-none"
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
 <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
 <select
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-full rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700/50 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all appearance-none shadow-sm dark:shadow-none"
 >
 <option value="" className="bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">{placeholder || 'Select...'}</option>
 {options.map((opt) => (
 <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200">{opt.label}</option>
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
"bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]",
 loading &&"opacity-50 cursor-not-allowed"
)}
 >
 {loading && <Loader2 className="h-4 w-4 animate-spin" />}
 {label}
 </button>
)
}

export default function StudentsPage() {
 const [courses, setCourses] = useState<AdminCourse[]>([])
 const [students, setStudents] = useState<AdminStudent[]>([])
 const [studentsLoading, setStudentsLoading] = useState(true)
 const [search, setSearch] = useState('')

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

 useEffect(() => {
 fetchAllStudents()
 .then(setStudents)
 .catch(() => {})
 .finally(() => setStudentsLoading(false))
 }, [])

 const courseOptions = courses.map((c) => ({ value: String(c.id), label: c.title }))

 const filteredStudents = useMemo(() => {
 if (!search.trim()) return students
 const q = search.toLowerCase()
 return students.filter(
 (s) => s.email.toLowerCase().includes(q) || s.full_name.toLowerCase().includes(q) || String(s.id).includes(q)
)
 }, [students, search])

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
 // Refresh student list
 fetchAllStudents().then(setStudents).catch(() => {})
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
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Student Management</h1>
 <p className="text-sm text-zinc-500 mt-1">Browse students, manage enrollments, and generate certificates.</p>
 </div>

 {/* ─── Student Directory ─── */}
 <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 p-6 space-y-4 shadow-sm dark:shadow-none">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
 <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
 </div>
 <div>
 <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Student Directory</h3>
 <p className="text-xs text-zinc-500 mt-0.5">{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
 </div>
 </div>

 {/* Search */}
 <div className="relative max-w-xs w-full">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by name, email, or ID..."
 className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all shadow-sm dark:shadow-none"
 />
 </div>
 </div>

 {studentsLoading ? (
 <div className="space-y-3 animate-pulse">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800/30 rounded-lg" />
))}
 </div>
) : filteredStudents.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
 <Users className="h-8 w-8 text-zinc-400 dark:text-zinc-700 mb-2" />
 <p className="text-sm text-zinc-500">{search ? 'No matching students' : 'No students registered yet'}</p>
 </div>
) : (
 <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800/60">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900/50">
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID</th>
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Student</th>
 <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Courses</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Verified</th>
 <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
 </tr>
 </thead>
 <tbody>
 {filteredStudents.map((student) => (
 <tr
 key={student.id}
 className="border-b border-zinc-200 dark:border-zinc-800/30 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer"
 onClick={() => {
 setEnrollUserId(String(student.id))
 setCertUserId(String(student.id))
 }}
 title="Click to use this student's ID in forms below"
 >
 <td className="px-4 py-3">
 <span className="inline-flex items-center justify-center h-6 min-w-[28px] px-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
 {student.id}
 </span>
 </td>
 <td className="px-4 py-3">
 <div className="flex items-center gap-2.5">
 <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
 <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
 {(student.full_name || student.email).charAt(0).toUpperCase()}
 </span>
 </div>
 <span className="text-zinc-900 dark:text-zinc-200 font-medium dark:font-normal truncate max-w-[150px]">
 {student.full_name || '—'}
 </span>
 </div>
 </td>
 <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">{student.email}</td>
 <td className="px-4 py-3 text-center">
 <span className={cn(
"inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold",
 student.enrollment_count > 0
 ?"bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
 :"bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
)}>
 {student.enrollment_count}
 </span>
 </td>
 <td className="px-4 py-3 text-center">
 {student.is_email_verified ? (
 <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mx-auto" />
) : (
 <Mail className="h-4 w-4 text-zinc-400 dark:text-zinc-600 mx-auto" />
)}
 </td>
 <td className="px-4 py-3 text-center text-xs text-zinc-500 whitespace-nowrap">
 {formatDate(student.date_joined)}
 </td>
 </tr>
))}
 </tbody>
 </table>
 </div>
)}

 {!studentsLoading && (
 <p className="text-xs text-zinc-600">
 Showing {filteredStudents.length} of {students.length} student{students.length !== 1 ? 's' : ''}
 </p>
)}
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
