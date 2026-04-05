import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEE Practice Hub",
  description: "A simple Next.js dashboard for practicing JEE mock questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
