import SessionProvider from "@/components/app/SessionProvider";

export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
