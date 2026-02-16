import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur dark:border-stone-700/80 dark:bg-stone-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-stone-900 dark:text-white">
          StillRio
        </Link>
        <div className="flex gap-6">
          <Link
            href="#social"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
          >
            Connect
          </Link>
          <Link
            href="#planner"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
          >
            Plan Adventure
          </Link>
        </div>
      </nav>
    </header>
  );
}
