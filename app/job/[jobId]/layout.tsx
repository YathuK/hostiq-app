import SessionProvider from "@/components/app/SessionProvider";

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
