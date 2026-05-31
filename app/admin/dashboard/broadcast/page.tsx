'use client'

import { useState, useEffect } from 'react'
import { broadcastEmail, fetchAllCourses, fetchBroadcastHistory, type AdminCourse, type BroadcastHistoryRecord } from '@/lib/admin'
import { Send, Loader2, CheckCircle2, AlertCircle, Radio, History, Users, Clock, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BroadcastPage() {
    const [courses, setCourses] = useState<AdminCourse[]>([])
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [targetAudience, setTargetAudience] = useState<string[]>(['all'])
    const [sending, setSending] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [history, setHistory] = useState<BroadcastHistoryRecord[]>([])
    const [visibleCount, setVisibleCount] = useState(5)
    const [loadingHistory, setLoadingHistory] = useState(true)

    const loadHistory = async () => {
        try {
            const data = await fetchBroadcastHistory()
            setHistory(data)
        } catch (error) {
            console.error('Failed to fetch history', error)
        } finally {
            setLoadingHistory(false)
        }
    }

    useEffect(() => {
        fetchAllCourses()
            .then(setCourses)
            .catch(() => { })
        loadHistory()
    }, [])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!subject.trim() || !body.trim()) return

        setSending(true)
        setFeedback(null)
        try {
            const result = await broadcastEmail({ subject, body, target_audience: targetAudience.includes('all') ? 'all' : targetAudience.join(',') })
            setFeedback({ type: 'success', message: result.status })
            setSubject('')
            setBody('')
            setTargetAudience(['all'])
            loadHistory()
        } catch (err: any) {
            setFeedback({ type: 'error', message: err?.response?.data?.error || 'Failed to send broadcast' })
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Broadcast Message</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Send an email and in-app notification to all students or a specific course audience.
                </p>
            </div>

            {/* Feedback */}
            {feedback && (
                <div
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-xl text-sm border animate-fade-up-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    )}
                >
                    {feedback.type === 'success' ? (
                        <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-900 flex items-center justify-center shrink-0">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                    <span className="flex-1 font-medium">{feedback.message}</span>
                    <button onClick={() => setFeedback(null)} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">
                        Dismiss
                    </button>
                </div>
            )}

            {/* Composer */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Compose Broadcast</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">This sends both an email and an in-app notification</p>
                    </div>
                </div>

                <form onSubmit={handleSend} className="space-y-5">
                    {/* Target audience */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Target Audience</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setTargetAudience(['all'])}
                                className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                                    targetAudience.includes('all')
                                        ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-400"
                                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-600"
                                )}
                            >

                                All Students
                            </button>
                            {courses.map((course) => (
                                <button
                                    key={course.id}
                                    type="button"
                                    onClick={() => {
                                        if (targetAudience.includes('all')) {
                                            setTargetAudience([String(course.id)])
                                        } else {
                                            if (targetAudience.includes(String(course.id))) {
                                                const next = targetAudience.filter(id => id !== String(course.id))
                                                if (next.length === 0) setTargetAudience(['all'])
                                                else setTargetAudience(next)
                                            } else {
                                                setTargetAudience([...targetAudience, String(course.id)])
                                            }
                                        }
                                    }}
                                    className={cn(
                                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                                        targetAudience.includes(String(course.id))
                                            ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-400"
                                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-600"
                                    )}
                                >
                                    {course.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject line..."
                            required
                            className="w-full rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                        />
                    </div>

                    {/* Body */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Message Body</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your message here..."
                            required
                            rows={8}
                            className="w-full rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all resize-none"
                        />
                    </div>

                    {/* Character count + Send */}
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-600">
                            {body.length > 0 ? `${body.length} characters` : 'Start typing...'}
                        </p>
                        <button
                            type="submit"
                            disabled={sending || !subject.trim() || !body.trim()}
                            className={cn(
                                "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98]",
                                (sending || !subject.trim() || !body.trim()) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                            <Send className="h-4 w-4" />
                            Send Broadcast
                        </button>
                    </div>
                </form>
            </div>

            {/* History Table */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <History className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Broadcast History</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Review previously sent messages and their audience</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Subject & Message</th>
                                <th className="px-6 py-4 font-medium">Audience</th>
                                <th className="px-6 py-4 font-medium">Recipients</th>
                                <th className="px-6 py-4 font-medium">Sent At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {loadingHistory ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                        <p className="text-xs">Loading history...</p>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 text-xs">
                                        No broadcast history found.
                                    </td>
                                </tr>
                            ) : (
                                history.slice(0, visibleCount).map((record) => (
                                    <tr key={record.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3 max-w-[300px]">
                                                <Mail className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                                                <div className="truncate">
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-200 truncate">{record.subject}</p>
                                                    <p className="text-xs text-zinc-500 truncate mt-0.5">{record.body}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                                {record.target_audience === 'all' ? 'All Students' : `Course IDs: ${record.target_audience}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5" />
                                                <span>{record.recipients_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{new Date(record.sent_at).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {!loadingHistory && history.length > visibleCount && (
                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center bg-zinc-50 dark:bg-zinc-950">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 5)}
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Show More ({history.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
