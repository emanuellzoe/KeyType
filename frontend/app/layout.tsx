import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-gradient-mesh keytype-root min-h-screen antialiased">
        <div className="bg-noise" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
