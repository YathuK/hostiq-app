"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppHeaderProps {
  activePage?: "dashboard" | "messages" | "settings" | "setup" | "job" | "claim" | "property-edit";
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", key: "dashboard" },
  { href: "/messages", label: "Messages", key: "messages" },
  { href: "/settings", label: "Settings", key: "settings" },
] as const;

export default function AppHeader({ activePage }: AppHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const activeKey =
    activePage ||
    navLinks.find((l) => pathname?.startsWith(l.href))?.key ||
    "dashboard";

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <span className="text-lg font-bold text-dark tracking-tight">HostIQ</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeKey === link.key;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:text-dark hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User pill + Logout */}
        <div className="flex items-center gap-3">
          {session?.user?.email && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600 max-w-[200px] truncate">
              {session.user.email}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 rounded-lg text-slate-400 hover:text-dark hover:bg-slate-50 transition-colors"
            title="Log out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
