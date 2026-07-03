import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "../store/StoreProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechCart — Premium Tech Store",
  description: "Discover the latest gadgets, electronics, and accessories at unbeatable prices. Shop laptops, smartphones, headphones and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#f8fafc] text-gray-900`}>
        <StoreProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
            {children}
          </main>
          <Footer />
          <ToastContainer position="bottom-right" theme="light" />
        </StoreProvider>
      </body>
    </html>
  );
}
