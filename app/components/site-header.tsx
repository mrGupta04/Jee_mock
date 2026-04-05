"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="text-lg font-black tracking-tight text-slate-900">
          JEE Practice Hub
        </Link>

        <nav className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-lg px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-orange-600 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
