import AuthBrandPanel from "@/components/auth/authBrandPanel";
import { ThemeToggle } from "@/components/common/themeToggle";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative grid min-h-svh w-full flex-1 lg:grid-cols-2">
      <div className="flex min-h-svh flex-col gap-xl p-xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-fit rounded-tl-lg rounded-br-lg border-2 bg-primary px-xs text-center font-display text-xl text-white"
          >
            UNdoubt
          </Link>
          <ThemeToggle />
        </div>
        <main className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-form flex-col gap-lg">
            {children}
          </div>
        </main>
        <footer className="text-center text-sm text-muted-foreground">
          Undoubt · A Q&amp;A community
        </footer>
      </div>
      <AuthBrandPanel />
    </div>
  );
}
