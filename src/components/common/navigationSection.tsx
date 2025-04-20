"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ProfileDropdown } from "./profileDropdown";
import SearchModal from "./searchModal";

export default function NavigationSection() {
  return (
    <div className="flex items-center gap-5 text-xs">
      <SearchModal />
      <Button variant="ghost" size={"icon"}>
        <Link href={"/question"} className="flex">
          <Plus />
        </Link>
      </Button>
      <ProfileDropdown />
    </div>
  );
}
