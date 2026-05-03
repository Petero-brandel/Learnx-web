import { api } from './api';

export async function checkoutCourse(courseId: number): Promise<{ authorization_url: string }> {
  const response = await api.post('/payments/checkout/', { course_id: courseId });
  return response.data;
}

export async function verifyPayment(reference: string): Promise<{ status: string, message: string }> {
  const response = await api.get(`/payments/verify/?reference=${reference}`);
  return response.data;
}
