import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 rounded-b-2xl border-b border-slate-200/80 bg-slate-100/90 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="StillRio logo"
            width={40}
            height={40}
            className="logo-outline-dark object-contain mix-blend-multiply dark:mix-blend-normal"
          />
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
            StillRio
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="#social"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Connect
          </Link>
          <Link
            href="#planner"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
          >
            Plan Adventure
          </Link>
        </div>
      </nav>
    </header>
  );
}
