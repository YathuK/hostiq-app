import SessionProvider from "@/components/app/SessionProvider";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
