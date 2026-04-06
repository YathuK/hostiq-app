import SessionProvider from "@/components/app/SessionProvider";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
