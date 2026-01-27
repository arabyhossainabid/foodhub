import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AOSProvider } from "@/components/shared/AOSProvider";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import NextTopLoader from 'nextjs-toploader';
import { GlobalLoader } from "@/components/shared/GlobalLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodHub | Discover & Order Delicious Meals",
  description: "A premium food ordering platform with three roles: Customer, Provider, and Admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <NextTopLoader
          color="#FF5200"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease-in-out"
          speed={300}
          shadow="0 0 15px #FF5200, 0 0 5px #FF5200"
          zIndex={99999}
          showAtBottom={false}
        />
        <GlobalLoader />
        <AuthProvider>
          <CartProvider>
            <AOSProvider>
              <Toaster position="top-right" />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="grow">{children}</main>
                <Footer />
              </div>
            </AOSProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
