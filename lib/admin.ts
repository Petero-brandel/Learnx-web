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
  order: number;
  is_preview: boolean;
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

export async function requestUploadUrl(lessonId: number): Promise<{ video_id: string; library_id: string }> {
  const response = await api.post(`/lessons/${lessonId}/request_upload_url/`);
  return response.data;
}
