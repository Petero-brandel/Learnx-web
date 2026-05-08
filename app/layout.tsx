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
 <body className="min-h-screen bg-background text-foreground">
 <ThemeProvider
 attribute="class"
 defaultTheme="dark"
 enableSystem
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
