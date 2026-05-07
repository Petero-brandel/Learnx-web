'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Lesson } from '@/lib/dashboard'
import { fetchStudentQuiz, submitQuiz, type QuizResult } from '@/lib/admin'
import { FileText, Download, HelpCircle, Clock, CheckCircle2, XCircle, RotateCcw, Loader2, Trophy, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonPlayerProps {
  lesson: Lesson
  bunnyLibraryId: string
  onQuizPassed?: () => void
}

export default function LessonPlayer({ lesson, bunnyLibraryId, onQuizPassed }: LessonPlayerProps) {
  if (lesson.content_type === 'video' && lesson.video_id) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${bunnyLibraryId}/${lesson.video_id}?autoplay=false&preload=true&responsive=true`}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (lesson.content_type === 'text' && lesson.text_content) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 md:p-8">
          <div
            className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.text_content }}
          />
        </div>
      </div>
    )
  }

  if (lesson.content_type === 'pdf' && lesson.file_url) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            PDF Resource
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 text-center">
            Download this lesson&apos;s resource file to continue.
          </p>
          <a
            href={lesson.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </div>
    )
  }

  if (lesson.content_type === 'quiz' && lesson.quiz) {
    return <QuizPlayer quizId={lesson.quiz.id} onPassed={onQuizPassed} />
  }

  // Unknown type
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          This content type is not yet supported.
        </p>
      </div>
    </div>
  )
}

// ─── Quiz Player ─────────────────────────────────────────────

type QuizState = 'loading' | 'intro' | 'active' | 'submitting' | 'results'

interface QuizData {
  id: number
  passing_score: number
  max_attempts: number
  time_limit_minutes: number
  is_required: boolean
  show_correct_answers: boolean
  shuffle_questions: boolean
  shuffle_answers: boolean
  questions: {
    id: number
    text: string
    question_type: 'multiple_choice' | 'true_false'
    order: number
    answers: { id: number; text: string }[]
  }[]
  attempts_used: number
  already_passed: boolean
}

function QuizPlayer({ quizId, onPassed }: { quizId: number; onPassed?: () => void }) {
  const [state, setState] = useState<QuizState>('loading')
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const loadQuiz = useCallback(async () => {
    setState('loading')
    setError(null)
    setSelectedAnswers({})
    setResult(null)
    try {
      const data = await fetchStudentQuiz(quizId)
      setQuiz(data as unknown as QuizData)

      if (data.already_passed) {
        setState('results')
        setResult({
          score: 100,
          passed: true,
          total_questions: data.questions.length,
          correct_count: data.questions.length,
          attempts_used: data.attempts_used,
          attempts_remaining: null,
        })
      } else {
        setState('intro')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load quiz.')
      setState('intro')
    }
  }, [quizId])

  useEffect(() => {
    loadQuiz()
  }, [loadQuiz])

  // Timer effect
  useEffect(() => {
    if (state === 'active' && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Auto-submit when time runs out
            if (timerRef.current) clearInterval(timerRef.current)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, timeRemaining !== null])

  const handleStart = () => {
    if (!quiz) return
    const now = new Date().toISOString()
    setStartedAt(now)
    setSelectedAnswers({})

    if (quiz.time_limit_minutes > 0) {
      setTimeRemaining(quiz.time_limit_minutes * 60)
    }

    setState('active')
  }

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setSelectedAnswers(prev => ({ ...prev, [String(questionId)]: answerId }))
  }

  const handleSubmit = async () => {
    if (!quiz) return
    if (timerRef.current) clearInterval(timerRef.current)

    setState('submitting')
    setError(null)

    const timeTaken = quiz.time_limit_minutes > 0 && timeRemaining !== null
      ? (quiz.time_limit_minutes * 60) - timeRemaining
      : 0

    try {
      const res = await submitQuiz(quizId, {
        answers: selectedAnswers,
        started_at: startedAt || undefined,
        time_taken_seconds: timeTaken,
      })
      setResult(res)
      setState('results')

      if (res.passed && onPassed) {
        onPassed()
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit quiz.')
      setState('active')
    }
  }

  const handleRetake = () => {
    setResult(null)
    setSelectedAnswers({})
    setTimeRemaining(null)
    setStartedAt(null)
    loadQuiz()
  }

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ─── Loading ───
  if (state === 'loading') {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-sm text-zinc-500">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // ─── Error without quiz ───
  if (!quiz) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 dark:text-red-400">{error || 'Quiz unavailable.'}</p>
        </div>
      </div>
    )
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const totalQuestions = quiz.questions.length
  const allAnswered = answeredCount === totalQuestions

  // ─── Intro ───
  if (state === 'intro') {
    const attemptsRemaining = quiz.max_attempts > 0
      ? quiz.max_attempts - quiz.attempts_used
      : null
    const noAttemptsLeft = attemptsRemaining !== null && attemptsRemaining <= 0

    return (
      <div className="w-full">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 md:p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-5">
            <HelpCircle className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Quiz</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Test your knowledge before moving on.
          </p>

          {/* Quiz Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              {quiz.passing_score}% to pass
            </span>
            {quiz.time_limit_minutes > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {quiz.time_limit_minutes} min
              </span>
            )}
            {quiz.max_attempts > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4" />
                {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} left
              </span>
            )}
          </div>

          {noAttemptsLeft ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl mb-4">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">No attempts remaining.</p>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Start Quiz
            </button>
          )}

          {error && (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          )}
        </div>
      </div>
    )
  }

  // ─── Active / Submitting ───
  if (state === 'active' || state === 'submitting') {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {answeredCount} / {totalQuestions} answered
            </span>
            {timeRemaining !== null && (
              <span className={cn(
                "inline-flex items-center gap-1.5 text-sm font-mono font-semibold",
                timeRemaining <= 60 ? "text-red-500 animate-pulse" : "text-zinc-600 dark:text-zinc-300"
              )}>
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Questions */}
          <div className="p-5 md:p-6 space-y-6">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className="space-y-3">
                <div className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    {idx + 1}
                  </span>
                  <p className="text-sm md:text-base font-medium text-zinc-900 dark:text-zinc-100 pt-0.5">
                    {q.text}
                  </p>
                </div>

                <div className="space-y-2 pl-9">
                  {q.answers.map(a => {
                    const isSelected = selectedAnswers[String(q.id)] === a.id
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, a.id)}
                        disabled={state === 'submitting'}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all",
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        {a.text}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit bar */}
          <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {allAnswered ? 'All questions answered!' : `${totalQuestions - answeredCount} remaining`}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || state === 'submitting'}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    )
  }

  // ─── Results ───
  if (state === 'results' && result) {
    const attemptsRemaining = result.attempts_remaining
    const canRetake = attemptsRemaining === null || attemptsRemaining > 0

    return (
      <div className="w-full">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 md:p-8">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4",
              result.passed
                ? "bg-emerald-50 dark:bg-emerald-900/20"
                : "bg-amber-50 dark:bg-amber-900/20"
            )}>
              {result.passed ? (
                <Trophy className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            <h3 className={cn(
              "text-2xl font-bold mb-1",
              result.passed
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            )}>
              {result.passed ? 'Quiz Passed!' : 'Not Quite'}
            </h3>

            <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-1">
              {result.score}%
            </p>
            <p className="text-sm text-zinc-500">
              {result.correct_count} of {result.total_questions} correct
              {quiz.passing_score > 0 && ` · ${quiz.passing_score}% needed`}
            </p>
          </div>

          {/* Correct Answers Review */}
          {quiz.show_correct_answers && result.correct_answers && (
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Answer Review</h4>
              {quiz.questions.map((q, idx) => {
                const correctAnswerId = result.correct_answers?.[String(q.id)]
                const selectedId = selectedAnswers[String(q.id)]
                const isCorrect = selectedId === correctAnswerId

                return (
                  <div key={q.id} className={cn(
                    "p-3 rounded-xl border",
                    isCorrect
                      ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10"
                      : "border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
                  )}>
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {idx + 1}. {q.text}
                      </p>
                    </div>

                    <div className="pl-6 space-y-1">
                      {q.answers.map(a => {
                        const isThisCorrect = a.id === correctAnswerId
                        const wasSelected = a.id === selectedId

                        return (
                          <div key={a.id} className={cn(
                            "text-xs py-1 px-2 rounded",
                            isThisCorrect && "text-emerald-700 dark:text-emerald-400 font-semibold",
                            wasSelected && !isThisCorrect && "text-red-600 dark:text-red-400 line-through",
                            !isThisCorrect && !wasSelected && "text-zinc-500"
                          )}>
                            {isThisCorrect && '✓ '}{wasSelected && !isThisCorrect && '✗ '}{a.text}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Retry / Continue */}
          {!result.passed && (
            <div className="text-center">
              {canRetake ? (
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                  {attemptsRemaining !== null && (
                    <span className="text-xs opacity-70">({attemptsRemaining} left)</span>
                  )}
                </button>
              ) : (
                <p className="text-sm text-zinc-500">No more attempts remaining.</p>
              )}
            </div>
          )}

          {result.passed && (
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                This lesson is now marked as complete!
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
