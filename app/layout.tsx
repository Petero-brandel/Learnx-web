import type { Metadata, Viewport } from"next";
import { Inter, Geist_Mono } from"next/font/google";
import { ThemeProvider } from"@/components/ThemeProvider";
import { AuthProvider } from"@/context/AuthContext";
import { GoogleOAuthProvider } from"@react-oauth/google";
import"./globals.css";

const inter = Inter({
 variable:"--font-inter",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable:"--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title:"Bluedemy",
 description:"Master AI & Digital Skills with expert-led courses in Prompt Engineering, Content Creation, and Digital Marketing.",
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
 width:"device-width",
 initialScale: 1,
 maximumScale: 1,
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
 </head>
 <body className="min-h-screen bg-background text-foreground">
 <ThemeProvider
 attribute="class"
 defaultTheme="dark"
 disableTransitionOnChange
 >
 <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||""}>
 <AuthProvider>
 {children}
 {modal}
 </AuthProvider>
 </GoogleOAuthProvider>
 </ThemeProvider>
 </body>
 </html>
);
}
