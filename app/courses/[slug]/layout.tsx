import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

async function getCourse(slug: string) {
  try {
    // We use the full API url. You might need to adjust this depending on your environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://engine.bluedemy.org/api/';
    const res = await fetch(`${apiUrl}courses/${slug}/`, {
      next: { revalidate: 3600 }, // Revalidate cache every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching course for SEO:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  const title = course.title;
  const description = course.description || `Learn ${course.title} at Bluedemy.`;
  const url = `https://bluedemy.org/courses/${slug}`;
  const images = course.thumbnail ? [{ url: course.thumbnail }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CourseLayout({ children, params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);

  let schema = null;
  if (course) {
    schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.title,
      "description": course.description || `Learn ${course.title} at Bluedemy.`,
      "provider": {
        "@type": "Organization",
        "name": "Bluedemy",
        "sameAs": "https://bluedemy.org"
      },
      "url": `https://bluedemy.org/courses/${slug}`,
      "image": course.thumbnail ? [course.thumbnail] : [],
      "offers": {
        "@type": "Offer",
        "price": course.price || "0",
        "priceCurrency": "NGN",
        "category": Number(course.price) === 0 ? "Free" : "Paid"
      }
    };
  }

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {children}
    </>
  );
}
