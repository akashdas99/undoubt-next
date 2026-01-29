"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "./profileDropdown";
import SearchModal from "./searchModal";

export default function NavigationSection() {
  return (
    <div className="flex items-center gap-5 text-xs">
      <SearchModal />
      <Link href={"/question"} prefetch={false} className="flex rounded-full">
        <Plus />
      </Link>
      <ProfileDropdown />
    </div>
  );
}
