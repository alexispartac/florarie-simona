import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import Navigation from "@/components/Navigation";
import CookieConsent from "@/components/CookieConsent";
import { ShopProvider } from "@/context/ShopContext";
import { ToastProvider } from "@/context/ToastContext";
import { QueryProvider } from "./providers/QueryProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { SkeletonProvider } from "@/components/providers/SkeletonProvider";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Buchetul Simonei Poezia Florilor",
    template: "%s | Buchetul Simonei", // For page-specific titles
  },
  description: "Simpte poezia flori. Buchetul Simonei este aici pentru tine.",
  keywords: ["florarie", "buchete", "flori", "Buchetul Simonei", "livrare flori", "flori Romania"],
  authors: [{ name: "Buchetul Simonei" }],
  creator: "Buchetul Simonei",
  publisher: "Buchetul Simonei",
  
  icons: {
    icon: "/Logo V6 Negru.png",
    apple: "/Logo V6 Negru.png", // For iOS home screen
  },
  
  metadataBase: new URL('https://buchetul-simonei.com'),
  
  alternates: {
    canonical: 'https://buchetul-simonei.com',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://buchetul-simonei.com',
    siteName: 'Buchetul Simonei',
    title: "Buchetul Simonei Poezia Florilor",
    description: "Simpte poezia flori. Buchetul Simonei este aici pentru tine.",
    images: [
      {
        url: "/Logo V6 Negru.png",
        width: 1200,
        height: 630,
        alt: "Buchetul Simonei Logo",
      },
    ],
  },
  
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'white';
                  document.documentElement.classList.add('theme-' + theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider>
            <SkeletonProvider>
              <ToastProvider>
                <QueryProvider>
                  <ShopProvider>
                    <Navigation />
                    {children}
                    <Analytics />
                    <CookieConsent />
                  </ShopProvider>
                </QueryProvider>
              </ToastProvider>
            </SkeletonProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
