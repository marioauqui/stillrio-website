"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#social", label: "Find My Content" },
    { href: "/adventure", label: "Route Builder" },
  ];

  return (
    <header className="sticky top-0 z-50 rounded-b-2xl border-b border-slate-200/80 bg-slate-100/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95 sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt="StillRio logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain mix-blend-multiply sm:h-10 sm:w-10"
          />
          <span className="text-lg font-bold text-slate-800 sm:text-xl">StillRio</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-slate-500 underline-offset-4 transition-colors duration-150 hover:text-slate-900 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-200/80 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
