import SessionProvider from "@/components/app/SessionProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
