"use client";

import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-[260px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
