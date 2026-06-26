'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Command Center" },
  { href: "/transit-map", label: "Transit Map" },
  { href: "/events", label: "Events" },
  { href: "/shipments", label: "Shipments" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
  { href: "/demo-control", label: "Investor Demo Control Panel" },
];

export default function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-slate-950/80 p-6 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Smart Label
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Investor Command
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Logistics intelligence platform
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-slate-500">↗</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  Smart Label Investor MVP
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </div>
              <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                Live demo ready
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
