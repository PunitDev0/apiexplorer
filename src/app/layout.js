// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";

import Head from "next/head";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { RequestProvider } from "@/components/explorer/request-context";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { EnvironmentProvider } from "@/context/environment-context";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Base metadata
export const metadata = {
  title: "API Explorer - Test, Document, and Optimize APIs Effortlessly",
  description:
    "API Explorer is a powerful tool for developers to test, document, and optimize APIs with ease. Featuring real-time WebSocket testing, AI-powered analysis, and team collaboration.",
  keywords: [
    "API testing",
    "developer tools",
    "WebSocket",
    "API optimization",
    "React",
    "Next.js",
    "AI-powered",
  ],
  authors: [{ name: "Your Name" }],
  icons: {
    icon: "/favicon.ico",
  },
};

// Root Layout Component
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google-site-verification" content="mqAHT7zvLB6rcRZwZJQIMDhsXtQVVQ-ISGX0RcqJ1-g" />
        <meta
          property="og:title"
          content="API Explorer - Simplify API Development"
        />
        <meta
          property="og:description"
          content="A sleek, modern tool for API testing and optimization, built with React and Next.js, enhanced by AI."
        />
        <meta property="og:url" content="https://apiexplorer.vercel.app/" />
        <meta property="og:site_name" content="API Explorer" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://apiexplorer.vercel.app/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="API Explorer Preview" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="API Explorer - Simplify API Development"
        />
        <meta
          name="twitter:description"
          content="Test, document, and optimize APIs with API Explorer – a developer-friendly tool powered by AI."
        />
        <meta
          name="twitter:image"
          content="https://apiexplorer.vercel.app/twitter-image.jpg"
        />
        <link rel="canonical" href="https://apiexplorer.vercel.app/" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiasedV font-mono`}
      >
        <ToastProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <RequestProvider>
              <AuthProvider>
                <EnvironmentProvider>
                  {children}
                </EnvironmentProvider>
              </AuthProvider>
            </RequestProvider>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};
