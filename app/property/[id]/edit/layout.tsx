import SessionProvider from "@/components/app/SessionProvider";

export default function PropertyEditLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
