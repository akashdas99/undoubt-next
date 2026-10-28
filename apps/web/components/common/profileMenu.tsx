"use client";

import { logoutUserAction } from "@/actions/auth";
import { Button } from "@workspace/ui/components/button";
import { LogOut, UserRoundCog } from "lucide-react";
import Link from "next/link";
import UserImage from "../ui/userImage";
import type { SessionUser } from "./sessionWrapper";

export function ProfileMenu({ user }: { user: SessionUser }) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-sm rounded-panel bg-card p-sm">
        <UserImage user={user} className="size-2xl" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{user?.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user?.email}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        nativeButton={false}
        render={<Link href="/profile" />}
        className="w-full justify-start rounded-2xl px-md"
      >
        <UserRoundCog className="text-primary" />
        Profile Settings
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start rounded-2xl px-md text-destructive hover:text-destructive"
        onClick={logoutUserAction}
      >
        <LogOut />
        Log out
      </Button>
    </div>
  );
}
