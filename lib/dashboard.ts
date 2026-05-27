import { api } from './api';

// ─── Types ───────────────────────────────────────────────
export interface Enrollment {
  enrollment_id: number;
  course_id: number;
  course_title: string;
  course_slug: string;
  course_thumbnail: string | null;
  progress_percentage: number;
  enrolled_at: string;
  is_active: boolean;
  completed_lesson_ids?: number[];
}

export interface Lesson {
  id: number;
  title: string;
  content_type: 'video' | 'text' | 'pdf' | 'quiz';
  video_id: string | null;
  text_content: string | null;
  file_url: string | null;
  order: number;
  is_preview: boolean;
  quiz?: {
    id: number;
    passing_score: number;
    max_attempts: number;
    time_limit_minutes: number;
    is_required: boolean;
    show_correct_answers: boolean;
    shuffle_questions: boolean;
    shuffle_answers: boolean;
    questions: {
      id: number;
      text: string;
      question_type: 'multiple_choice' | 'true_false';
      order: number;
      answers: { id: number; text: string; is_correct?: boolean }[];
    }[];
  } | null;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  preview_video_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  modules: Module[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'system' | 'sale' | 'enrollment' | 'achievement' | 'broadcast';
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  unread_count: number;
  notifications: Notification[];
}

export interface Certificate {
  certificate_id: string;
  course_title: string;
  issued_at: string;
  pdf_url: string | null;
}

// ─── Enrollments ─────────────────────────────────────────
export async function fetchMyEnrollments(): Promise<Enrollment[]> {
  const timestamp = Date.now();
  const response = await api.get(`/payments/my-enrollments/?t=${timestamp}`);
  return response.data;
}

// ─── Courses ─────────────────────────────────────────────
export async function fetchCourseDetail(slug: string): Promise<CourseDetail> {
  const response = await api.get(`/courses/${slug}/`);
  return response.data;
}

// ─── Progress ────────────────────────────────────────────
export async function markLessonComplete(lessonId: number): Promise<{ status: string; progress_percentage: number }> {
  const response = await api.post('/payments/progress/mark-complete/', { lesson_id: lessonId });
  return response.data;
}

// ─── Notifications ───────────────────────────────────────
export async function fetchNotifications(): Promise<NotificationsResponse> {
  const response = await api.get('/notifications/');
  return response.data;
}

export async function markNotificationRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/mark-read/`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post('/notifications/mark-all-read/');
}

// ─── Certificates ────────────────────────────────────────
export async function fetchMyCertificates(): Promise<Certificate[]> {
  const response = await api.get('/certificates/my-certificates/');
  return response.data;
}
