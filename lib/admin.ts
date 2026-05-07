import { api } from './api';

// ─── Types ───────────────────────────────────────────────

export interface RevenueStats {
  revenue: {
    today: number;
    this_week: number;
    this_month: number;
    all_time: number;
  };
  revenue_over_time: { day: string; total: number }[];
  revenue_per_course: { course_title: string; total: number }[];
}

export interface UserStats {
  total_students: number;
  signups_over_time: { day: string; count: number }[];
}

export interface CoursePerformance {
  popular_courses: { course_title: string; total_enrollments: number }[];
  average_completion_rate: number;
}

export interface RecentOrder {
  id: number;
  student: string;
  course: string;
  amount: number;
  date: string;
}

export interface RecentActivity {
  recent_orders: RecentOrder[];
}

export interface AdminEnrollment {
  id: number;
  student_email: string;
  course_title: string;
  enrolled_at: string;
  progress: number;
  is_active: boolean;
}

export interface AdminCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  thumbnail: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  modules: AdminModule[];
}

export interface AdminModule {
  id: number;
  title: string;
  order: number;
  lessons: AdminLesson[];
}

export interface AdminLesson {
  id: number;
  title: string;
  content_type: 'video' | 'text' | 'pdf' | 'quiz';
  video_id: string | null;
  text_content: string | null;
  file_url: string | null;
  order: number;
  is_preview: boolean;
  quiz?: AdminQuiz | null;
}

export interface AdminAnswer {
  id?: number;
  text: string;
  is_correct: boolean;
}

export interface AdminQuestion {
  id?: number;
  text: string;
  question_type: 'multiple_choice' | 'true_false';
  order: number;
  answers: AdminAnswer[];
}

export interface AdminQuiz {
  id?: number;
  lesson: number;
  passing_score: number;
  max_attempts: number;
  time_limit_minutes: number;
  is_required: boolean;
  show_correct_answers: boolean;
  shuffle_questions: boolean;
  shuffle_answers: boolean;
  questions: AdminQuestion[];
}

export interface QuizResult {
  score: number;
  passed: boolean;
  total_questions: number;
  correct_count: number;
  attempts_used: number;
  attempts_remaining: number | null;
  correct_answers?: Record<string, number>;
}

// ─── Analytics ───────────────────────────────────────────

export async function fetchRevenueStats(): Promise<RevenueStats> {
  const response = await api.get('/dashboard/stats/revenue/');
  return response.data;
}

export async function fetchUserStats(): Promise<UserStats> {
  const response = await api.get('/dashboard/stats/users/');
  return response.data;
}

export async function fetchCoursePerformance(): Promise<CoursePerformance> {
  const response = await api.get('/dashboard/stats/courses/');
  return response.data;
}

export async function fetchRecentActivity(): Promise<RecentActivity> {
  const response = await api.get('/dashboard/recent-activity/');
  return response.data;
}

// ─── Student Management ──────────────────────────────────

export interface AdminStudent {
  id: number;
  email: string;
  full_name: string;
  date_joined: string;
  is_active: boolean;
  is_email_verified: boolean;
  enrollment_count: number;
}

export async function fetchAllStudents(): Promise<AdminStudent[]> {
  const response = await api.get('/dashboard/management/students/');
  return response.data;
}

export async function manualRegisterUser(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}): Promise<{ status: string; user_id: number }> {
  const response = await api.post('/dashboard/management/register-user/', data);
  return response.data;
}

export async function manualEnrollUser(data: {
  user_id: number;
  course_id: number;
}): Promise<{ status: string }> {
  const response = await api.post('/dashboard/management/enroll/', data);
  return response.data;
}

export async function generateCertificate(data: {
  user_id: number;
  course_id: number;
}): Promise<{ status: string }> {
  const response = await api.post('/dashboard/management/generate-certificate/', data);
  return response.data;
}

// ─── Enrollment Management ───────────────────────────────

export async function fetchEnrollments(): Promise<AdminEnrollment[]> {
  const response = await api.get('/dashboard/management/enrollments/');
  return response.data;
}

export async function toggleEnrollmentStatus(data: {
  enrollment_id: number;
  is_active: boolean;
}): Promise<{ status: string }> {
  const response = await api.patch('/dashboard/management/enrollments/', data);
  return response.data;
}

// ─── Broadcast ───────────────────────────────────────────

export async function broadcastEmail(data: {
  subject: string;
  body: string;
  target_audience: string; // 'all' or course_id
}): Promise<{ status: string }> {
  const response = await api.post('/dashboard/management/broadcast-email/', data);
  return response.data;
}

// ─── Course Management ───────────────────────────────────

export async function fetchAllCourses(): Promise<AdminCourse[]> {
  const response = await api.get('/courses/');
  return response.data;
}

export async function fetchCourse(slug: string): Promise<AdminCourse> {
  const response = await api.get(`/courses/${slug}/`);
  return response.data;
}

export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  is_published: boolean;
  thumbnail?: string;
}): Promise<AdminCourse> {
  const response = await api.post('/courses/', data);
  return response.data;
}

export async function updateCourse(slug: string, data: Partial<AdminCourse>): Promise<AdminCourse> {
  const response = await api.patch(`/courses/${slug}/`, data);
  return response.data;
}

export async function deleteCourse(slug: string): Promise<void> {
  await api.delete(`/courses/${slug}/`);
}

// ─── Module Management ───────────────────────────────────

export async function createModule(data: {
  course: number;
  title: string;
}): Promise<AdminModule> {
  const response = await api.post('/modules/', data);
  return response.data;
}

export async function updateModule(id: number, data: Partial<AdminModule>): Promise<AdminModule> {
  const response = await api.patch(`/modules/${id}/`, data);
  return response.data;
}

export async function deleteModule(id: number): Promise<void> {
  await api.delete(`/modules/${id}/`);
}

// ─── Lesson Management ───────────────────────────────────

export async function createLesson(data: {
  module: number;
  title: string;
  content_type: 'video' | 'text' | 'pdf' | 'quiz';
}): Promise<AdminLesson> {
  const response = await api.post('/lessons/', data);
  return response.data;
}

export async function updateLesson(id: number, data: Partial<AdminLesson>): Promise<AdminLesson> {
  const response = await api.patch(`/lessons/${id}/`, data);
  return response.data;
}

export async function deleteLesson(id: number): Promise<void> {
  await api.delete(`/lessons/${id}/`);
}

export async function reorderLessons(lessonIds: number[]): Promise<{ status: string }> {
  const response = await api.post('/lessons/reorder/', { lesson_ids: lessonIds });
  return response.data;
}

export async function requestUploadUrl(lessonId: number): Promise<{ 
  video_id: string; 
  library_id: string;
  authorization_signature: string;
  authorization_expire: number;
}> {
  const response = await api.post(`/lessons/${lessonId}/request_upload_url/`);
  return response.data;
}

// ─── Quiz Management ─────────────────────────────────────────

export async function createQuizForLesson(lessonId: number): Promise<AdminQuiz> {
  const response = await api.post('/quizzes/', { lesson: lessonId });
  return response.data;
}

export async function saveQuizBulk(quizId: number, data: {
  passing_score: number;
  max_attempts: number;
  time_limit_minutes: number;
  is_required: boolean;
  show_correct_answers: boolean;
  shuffle_questions: boolean;
  shuffle_answers: boolean;
  questions: Omit<AdminQuestion, 'id'>[];
}): Promise<AdminQuiz> {
  const response = await api.post(`/quizzes/${quizId}/save_all/`, data);
  return response.data;
}

export async function fetchStudentQuiz(quizId: number): Promise<AdminQuiz & { attempts_used: number; already_passed: boolean }> {
  const response = await api.get(`/quizzes/${quizId}/student_view/`);
  return response.data;
}

export async function submitQuiz(quizId: number, data: {
  answers: Record<string, number>;
  started_at?: string;
  time_taken_seconds?: number;
}): Promise<QuizResult> {
  const response = await api.post(`/quizzes/${quizId}/submit/`, data);
  return response.data;
}

export async function fetchQuizAttempts(quizId: number): Promise<{
  id: number;
  score: number;
  passed: boolean;
  attempted_at: string;
  time_taken_seconds: number;
}[]> {
  const response = await api.get(`/quizzes/${quizId}/attempts/`);
  return response.data;
}
