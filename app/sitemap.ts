import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bluedemy.org'

  // Fetch courses
  let courses: any[] = []
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnx-app.fly.dev/api/'
    const res = await fetch(`${apiUrl}courses/`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      courses = data.results || data || []
    }
  } catch (error) {
    console.error('Error fetching courses for sitemap', error)
  }

  const courseUrls = courses.map((course: any) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(course.updated_at || course.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Company LinkedIn Page
    {
      url: 'https://www.linkedin.com/company/bluedemy/',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },

    ...courseUrls,
  ]
}