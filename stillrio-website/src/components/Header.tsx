import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 rounded-b-2xl border-b border-slate-200/80 bg-slate-100/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-105 active:scale-95">
          <Image
            src="/logo.png"
            alt="StillRio logo"
            width={40}
            height={40}
            className="object-contain mix-blend-multiply"
          />
          <span className="text-xl font-bold text-slate-800">
            StillRio
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/#social"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-800"
          >
            Find My Content
          </Link>
          <Link
            href="/adventure"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-800"
          >
            Plan Adventure
          </Link>
        </div>
      </nav>
    </header>
  );
}
