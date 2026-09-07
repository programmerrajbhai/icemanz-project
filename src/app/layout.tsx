import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";
import { Toaster } from 'react-hot-toast';
import TopLoader from "@/components/TopLoader";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICEMANZ | Walk-In Cooler & Freezer Solutions",
  description: "Fast, reliable, and high-performance walk-in coolers and freezers. Ready to ship in 36-48 hours with 10-year panel warranty.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/20 selection:text-primary`}
      >
        <CartProvider>
          <TopLoader />
          {children}
          <Footer />
          <Toaster position="bottom-right" />
          <PrelineScript />
        </CartProvider>
      </body>
    </html>
  );
}
