import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { UserImageSkeleton } from "../ui/userImage";
import { ProfileDropdown } from "./profileDropdown";
import { SessionWrapper } from "./sessionWrapper";
import SearchModal from "./searchModal";
import { ThemeToggle } from "./themeToggle";

export default async function Header() {
  return (
    <header className="sticky top-0 z-20 flex w-full justify-center bg-background/80 text-foreground shadow-card backdrop-blur-sm">
      <div className="my-auto flex w-full max-w-content items-center justify-between gap-xs p-sm">
        <Link
          className="rounded-tl-lg rounded-br-lg border-2 bg-primary px-xs text-center font-display text-xl text-white"
          href="/"
        >
          UNdoubt
        </Link>
        <div className="flex items-center gap-xs text-xs">
          <SearchModal />
          <Link
            href={"/question"}
            prefetch={false}
            className="flex rounded-full"
          >
            <Plus />
          </Link>
          <ThemeToggle />
          <Suspense fallback={<UserImageSkeleton className="w-2xl" />}>
            <SessionWrapper
              render={(user) => <ProfileDropdown user={user} />}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
