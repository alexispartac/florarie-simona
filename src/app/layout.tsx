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
  title: "Buchetul Simonei Poezia Florilor",
  description: "Simpte poezia flori. Buchetul Simonei este aici pentru tine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
