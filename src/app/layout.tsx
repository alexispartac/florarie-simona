import { FiltersProvider } from "./components/context/FiltersContext";
import { StoreProvider } from "./components/context/StoreContext";
import { UserProvider } from "./components/context/ContextUser";
import QueryProvider from "./components/context/QueryProvider";
import ReduxProvider from "./cart/components/ReduxProvider";
import ClientWrapper from './components/ClientWrapper';
import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider } from '@mantine/core';
import BackToTop from "./components/BackToTop";
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
  title: "Buchetul Simonei Poezia Florilor",
  description: "Buchetul Simonei Poezia Florilor - Florărie online cu buchete personalizate.",
  metadataBase: new URL("https://buchetul-simonei.com"),
  icons: {
    icon: "/Logo-Principal.jpg",
    shortcut: "/Logo-Principal.jpg",
    apple: "/Logo-Principal.jpg",
  },
  robots: "index, follow",
  openGraph: {
    title: "Buchetul Simonei",
    description: "Florărie online cu buchete personalizate. Comandă acum buchetul perfect pentru orice ocazie!",
    url: "https://buchetul-simonei.com",
    siteName: "Buchetul Simonei Poezia Florilor",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/poezia-florilor-9bb89.firebasestorage.app/o/images%2FLogo-Principal.jpg?alt=media&token=b3d4ad6e-2f73-48c6-b7aa-515d43e37c5f", // adaugare imagine cu logo
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
                <StoreProvider>
                  <FiltersProvider>
                    <ClientWrapper>
                      {children}
                      <BackToTop />
                    </ClientWrapper>
                  </FiltersProvider>
                </StoreProvider>
              </ReduxProvider>
            </QueryProvider>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}


