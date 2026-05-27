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
    queryKey: ['enrollment', courseId],
    queryFn: async () => {
      const { data } = await api.get<{ enrolled: boolean }>(`/payments/check-enrollment/${courseId}/`);
      return data.enrolled;
    },
    enabled: !!courseId && isAuthenticated,
    staleTime: 60 * 1000,
    retry: false,
  });
}
