import { isEmpty } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
import { Suspense } from "react";
import { ProfileDropdown } from "./profileDropdown";
import { ProfileMenu } from "./profileMenu";
import SearchModal from "./searchModal";
import { SessionWrapper } from "./sessionWrapper";
import { HeaderNavLink } from "./headerNavLink";
import { Logo } from "./logo";
import { MobileNav } from "./mobileNav";
import { ThemeToggle } from "./themeToggle";

function GuestAccountLinks() {
  return (
    <>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={cn(buttonVariants({ variant: "default" }))}
      >
        Sign up
      </Link>
    </>
  );
}

function GuestMenuLinks() {
  return (
    <div className="flex flex-col gap-sm">
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={cn(buttonVariants({ variant: "default" }), "w-full")}
      >
        Sign up
      </Link>
    </div>
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
          <div className="hidden items-center gap-xs md:flex">
            <Separator orientation="vertical" className="h-lg self-center!" />
            <HeaderNavLink href="/question" prefetch={false}>
              Ask
            </HeaderNavLink>
            <Separator orientation="vertical" className="h-lg self-center!" />
            <HeaderNavLink href="/about">About</HeaderNavLink>
          </div>
        </nav>
        <Logo className="justify-self-center" />
        <div className="flex items-center justify-end gap-xs">
          <Suspense fallback={null}>
            <SessionWrapper
              render={(user) => (
                <nav
                  aria-label="Account"
                  className="hidden items-center gap-xs md:flex"
                >
                  <ThemeToggle />
                  {isEmpty(user) ? (
                    <GuestAccountLinks />
                  ) : (
                    <ProfileDropdown user={user} />
                  )}
                </nav>
              )}
            />
          </Suspense>
          <MobileNav
            account={
              <Suspense fallback={null}>
                <SessionWrapper
                  render={(user) =>
                    isEmpty(user) || user == null ? (
                      <GuestMenuLinks />
                    ) : (
                      <ProfileMenu user={user} />
                    )
                  }
                />
              </Suspense>
            }
          />
        </div>
      </div>
    </header>
  );
}
