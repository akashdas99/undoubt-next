import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { UserImageSkeleton } from "../ui/userImage";
import { ProfileDropdown } from "./profileDropdown";
import SearchModal from "./searchModal";
import { SessionWrapper } from "./sessionWrapper";
import { ThemeToggle } from "./themeToggle";

export default async function Header() {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/80 shadow-header backdrop-blur-sm">
      <div className="flex w-full items-center justify-between gap-sm px-md py-sm">
        <Link
          href="/"
          className="rounded-tl-lg rounded-br-lg border-2 bg-primary px-xs text-center font-display text-xl text-white"
        >
          UNdoubt
        </Link>
        <nav aria-label="Main" className="flex items-center gap-xs">
          <SearchModal />
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted sm:hidden dark:hover:bg-muted"
            aria-label="Ask a question"
            render={<Link href="/question" prefetch={false} />}
          >
            <Plus />
          </Button>
          <Button
            variant="ghost"
            className="hidden text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted sm:inline-flex dark:hover:bg-muted"
            render={<Link href="/question" prefetch={false} />}
          >
            <Plus />
            Ask
          </Button>
          <ThemeToggle />
          <Suspense fallback={<UserImageSkeleton className="size-2xl" />}>
            <SessionWrapper
              render={(user) => <ProfileDropdown user={user} />}
            />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
