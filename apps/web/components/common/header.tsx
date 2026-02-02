import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { UserImageSkeleton } from "../ui/userImage";
import { ProfileDropdown } from "./profileDropdown";
import { SessionWrapper } from "./sessionWrapper";
import SearchModal from "./searchModal";

export default async function Header() {
  return (
    <header className="flex justify-center bg-foreground text-white w-full sticky z-20 top-0">
      <div className="flex items-center p-3 gap-[20px] justify-between w-full my-auto max-w-[1450px]">
        <Link
          className={`font-righteous bg-primary rounded-tl-lg rounded-br-lg border-2 px-2 text-center text-xl`}
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
          <Suspense fallback={<UserImageSkeleton className="w-[36px]" />}>
            <SessionWrapper
              render={(sessionId) => <ProfileDropdown sessionId={sessionId} />}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
