import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AOSProvider } from "@/components/providers/AOSProvider";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
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
