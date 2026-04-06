import SessionProvider from "@/components/app/SessionProvider";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
