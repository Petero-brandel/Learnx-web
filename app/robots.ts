import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/', '/verify-email/'],
    },
    sitemap: 'https://bluedemy.org/sitemap.xml',
  }
}
