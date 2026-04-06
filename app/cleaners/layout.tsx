import SessionProvider from "@/components/app/SessionProvider";

export default function CleanersLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
