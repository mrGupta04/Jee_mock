import type { Metadata } from "next";
import SiteHeader from "./components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEE Practice Hub",
  description:
    "A Next.js dashboard with 100 JEE-style questions across Physics, Chemistry, and Mathematics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
