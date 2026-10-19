import { isEmpty } from "@/lib/functions";
import { Button } from "@workspace/ui/components/button";
import { Info, LogIn, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ProfileDropdown } from "./profileDropdown";
import SearchModal from "./searchModal";
import { SessionWrapper } from "./sessionWrapper";
import { HeaderNavLink } from "./headerNavLink";
import { Logo } from "./logo";
import { ThemeToggle } from "./themeToggle";

function GuestAccountLinks() {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:bg-white hover:text-foreground aria-expanded:bg-white md:hidden dark:hover:bg-muted dark:aria-expanded:bg-muted"
        aria-label="Login"
        render={<Link href="/login" />}
      >
        <LogIn />
      </Button>
      <Button
        variant="outline"
        className="hidden md:inline-flex"
        render={<Link href="/login" />}
      >
        Login
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:bg-white hover:text-foreground aria-expanded:bg-white md:hidden dark:hover:bg-muted dark:aria-expanded:bg-muted"
        aria-label="Create Account"
        render={<Link href="/register" />}
      >
        <UserPlus />
      </Button>
      <Button
        variant="default"
        className="hidden md:inline-flex"
        render={<Link href="/register" />}
      >
        Create Account
      </Button>
    </>
  );
}

export default async function Header() {
  return (
    <header className="sticky top-0 z-20 flex w-full justify-center px-md pt-sm pb-xs">
      <div className="frosted-glass grid w-full max-w-[calc(var(--container-content)-(var(--spacing-md)*2))] grid-cols-[1fr_auto_1fr] items-center gap-xs rounded-full bg-background/50 p-xs text-card-foreground backdrop-blur-md lg:max-w-[calc(var(--container-content)+var(--spacing-xl)+var(--container-dialog))]">
        <nav
          aria-label="Find and ask"
          className="flex items-center justify-start gap-xs"
        >
          <SearchModal />
          <HeaderNavLink
            href="/question"
            prefetch={false}
            size="icon"
            className="sm:hidden"
            aria-label="Ask a question"
          >
            <Plus />
          </HeaderNavLink>
          <HeaderNavLink
            href="/question"
            prefetch={false}
            className="hidden sm:inline-flex"
          >
            <Plus />
            Ask
          </HeaderNavLink>
          <HeaderNavLink
            href="/about"
            size="icon"
            className="sm:hidden"
            aria-label="About"
          >
            <Info />
          </HeaderNavLink>
          <HeaderNavLink href="/about" className="hidden sm:inline-flex">
            About
          </HeaderNavLink>
        </nav>
        <Logo className="justify-self-center" />
        <nav
          aria-label="Account"
          className="flex items-center justify-end gap-xs"
        >
          <Suspense fallback={null}>
            <SessionWrapper
              render={(user) => (
                <>
                  <ThemeToggle />
                  {isEmpty(user) ? (
                    <GuestAccountLinks />
                  ) : (
                    <ProfileDropdown user={user} />
                  )}
                </>
              )}
            />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
