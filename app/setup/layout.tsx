import SessionProvider from "@/components/app/SessionProvider";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
