import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { CourseDetail } from './dashboard';

export interface PublicCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  thumbnail: string | null;
  is_published: boolean;
  created_at: string;
  module_count: number;
  lesson_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<PublicCourse>>('/courses/');
      return data.results;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCourseDetail(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await api.get<CourseDetail>(`/courses/${slug}/`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCheckEnrollment(courseId: number | undefined, isAuthenticated: boolean = false) {
  return useQuery({
    queryKey: ['enrollment', courseId, isAuthenticated],
    queryFn: async () => {
      console.log(`[DEBUG] Checking enrollment for courseId: ${courseId}, isAuthenticated: ${isAuthenticated}`);
      try {
        const { data } = await api.get<any>(`/payments/check-enrollment/${courseId}/`);
        console.log("[DEBUG] /check-enrollment/ response:", data);
        const result = data.enrolled || data.is_enrolled || data.isEnrolled || false;
        console.log("[DEBUG] Evaluated enrollment status:", result);
        return result;
      } catch (err) {
        console.warn("[DEBUG] Lightweight check failed, trying fallback...", err);
        try {
          const { data } = await api.get<any[]>('/payments/my-enrollments/');
          console.log("[DEBUG] /my-enrollments/ response:", data);
          // Use == instead of === just in case of string/number type mismatches
          const result = data.some(enrollment => enrollment.course_id == courseId);
          console.log("[DEBUG] Fallback evaluated status:", result);
          return result;
        } catch (fallbackErr) {
          console.error("[DEBUG] Both checks failed!", fallbackErr);
          return false;
        }
      }
    },
    enabled: !!courseId && isAuthenticated,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
}
