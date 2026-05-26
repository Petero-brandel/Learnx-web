import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bluedemy.org'),
  title: {
    template: "%s | Bluedemy",
    default: "Bluedemy - Master AI & Digital Skills",
  },
  description: "Master AI & Digital Skills with expert-led courses in Prompt Engineering, Content Creation, and Digital Marketing.",
  openGraph: {
    type: "website",
    url: "https://bluedemy.org",
    title: "Bluedemy - Master AI & Digital Skills",
    description: "Master AI & Digital Skills with expert-led courses in Prompt Engineering, Content Creation, and Digital Marketing.",
    siteName: "Bluedemy",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      "/favicon.ico",
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
 width: "device-width",
 initialScale: 1,
 maximumScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bluedemy",
  "url": "https://bluedemy.org",
  "logo": "https://bluedemy.org/android-chrome-512x512.png",
  "description": "Bluedemy is an innovative online e-learning platform dedicated to equipping young Africans with the digital skills, AI literacy, and strategic knowledge needed to thrive and earn in the modern world.",
  "founders": [
    {
      "@type": "Person",
      "name": "Chukwuemeka Izuchukwu Emmanuel",
      "alternateName": "Coach Izu",
      "jobTitle": "Co-Founder & CEO"
    },
    {
      "@type": "Person",
      "name": "Uwana Essien",
      "jobTitle": "Co-Founder & CFO"
    }
  ]
};

export default function RootLayout({
 children,
 modal,
}: Readonly<{
 children: React.ReactNode;
 modal: React.ReactNode;
}>) {
 return (
 <html
  lang="en"
  className={`${inter.variable} ${geistMono.variable} antialiased`}
  suppressHydrationWarning
 >
 <head>
  <link rel="icon" href="/favicon.ico?v=2" />
  <link rel="icon" href="/android-chrome-512x512.png?v=3" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png?v=2" />
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png?v=2" />
  <link rel="manifest" href="/site.webmanifest?v=2" />
  <meta name="theme-color" content="#ffffff" />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
  />
 </head>
 <body className="min-h-screen bg-background text-foreground">
 <ThemeProvider
 attribute="class"
 defaultTheme="dark"
 disableTransitionOnChange
 >
 <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
 <Providers>
 <AuthProvider>
 {children}
 {modal}
 </AuthProvider>
 </Providers>
 </GoogleOAuthProvider>
 </ThemeProvider>
 </body>
 </html>
);
}
