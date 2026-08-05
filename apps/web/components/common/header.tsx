import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { UserImageSkeleton } from "../ui/userImage";
import { ProfileDropdown } from "./profileDropdown";
import { SessionWrapper } from "./sessionWrapper";
import SearchModal from "./searchModal";

export default async function Header() {
  return (
    <header className="sticky top-0 z-20 flex w-full justify-center bg-foreground text-white">
      <div className="my-auto flex w-full max-w-362.5 items-center justify-between gap-5 p-3">
        <Link
          className={`rounded-tl-lg rounded-br-lg border-2 bg-primary px-2 text-center font-righteous text-xl`}
          href="/"
        >
          UNdoubt
        </Link>
        <div className="flex items-center gap-5 text-xs">
          <SearchModal />
          <Link
            href={"/question"}
            prefetch={false}
            className="flex rounded-full"
          >
            <Plus />
          </Link>
          <Suspense fallback={<UserImageSkeleton className="w-9" />}>
            <SessionWrapper
              render={(sessionId) => <ProfileDropdown sessionId={sessionId} />}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
