import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KeyType | Modern Typing Test",
  description:
    "Test and improve your typing speed with KeyType - a modern, minimalist typing test application with beautiful UI/UX",
  keywords: [
    "typing test",
    "wpm",
    "typing speed",
    "keyboard practice",
    "touch typing",
  ],
  authors: [{ name: "KeyType" }],
  openGraph: {
    title: "KeyType | Modern Typing Test",
    description: "Test and improve your typing speed with KeyType",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-gradient-mesh min-h-screen antialiased">
        <div className="bg-noise" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
