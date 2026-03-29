import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ZMN Fintech — Дижитал зээлийн платформ",
  description: "Хэдхэн минутын дотор зээл аваарай. Бүрэн онлайн, AI-д суурилсан.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={inter.variable}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
