import { RestrictedComponents } from "./components/RestrictedComponents";
import { AutoConnectWithToken } from "./components/AutoConnectWithToken";
import AnimateForBegin from "./components/ui/animate-for-begin";
import ReduxProvider from "./cart/components/ReduxProvider";
import { UserProvider } from "./components/ContextUser";
import QueryProvider from "./components/QueryProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider } from '@mantine/core';
import type { Metadata } from "next";
import '@mantine/core/styles.css';
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buchetul Simonei - Florărie online",
  description: "Buchetul Simonei - Florărie online cu buchete personalizate.",
  metadataBase: new URL("https://buchetul-simonei.com"),
  robots: "index, follow",
  openGraph: {
    title: "Buchetul Simonei",
    description: "Florărie online cu buchete personalizate.",
    url: "https://buchetul-simonei.com",
    siteName: "Buchetul Simonei",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/poezia-florilor-9bb89.firebasestorage.app/o/images%2Flogo.jpg?alt=media&token=b3d4ad6e-2f73-48c6-b7aa-515d43e37c5f", // adaugare imagine cu logo
        width: 1200,
        height: 630,
        alt: "Buchetul Simonei",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <UserProvider>
            <QueryProvider>
              <ReduxProvider>
                <AutoConnectWithToken />
                <AnimateForBegin />
                <RestrictedComponents>
                  {children}
                </RestrictedComponents>
              </ReduxProvider>
            </QueryProvider>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}


