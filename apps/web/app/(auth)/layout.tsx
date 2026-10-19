import AuthBrandPanel from "@/components/auth/authBrandPanel";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/themeToggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative grid min-h-svh w-full flex-1 lg:grid-cols-2">
      <div className="flex min-h-svh flex-col gap-xl p-xl">
        <div className="flex items-start justify-between">
          <Logo />
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
