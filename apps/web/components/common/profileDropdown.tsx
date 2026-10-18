import { logoutUserAction } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { isEmpty } from "@/lib/functions";
import { cacheTags } from "@/lib/cache/tags";
import type { SessionUser } from "./sessionWrapper";
import { LogIn, LogOut, UserPlus, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Button } from "@workspace/ui/components/button";
import UserImage from "../ui/userImage";

export async function ProfileDropdown({ user }: { user?: SessionUser | null }) {
  "use cache";
  cacheTag(cacheTags.users.profile());
  cacheLife("hours");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={"icon"}
            data-slot="dropdown-menu-trigger"
            className="rounded-full p-xxs transition-shadow hover:ring-2 hover:ring-primary/30 data-popup-open:ring-2 data-popup-open:ring-primary/50"
          >
            <UserImage user={user} />
          </Button>
        }
      />

      <DropdownMenuContent className="frosted-glass" align="end" sideOffset={8}>
        {isEmpty(user) ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-xs py-xs text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Get Started
            </DropdownMenuLabel>
            <DropdownMenuItem
              render={<Link href={"/register"} />}
              className="mx-xxs my-xxs rounded-lg"
            >
              <UserPlus className="text-primary" />
              <span>Create Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={"/login"} />}
              className="mx-xxs my-xxs rounded-lg"
            >
              <LogIn className="text-primary" />
              <span>Login</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuGroup>
              <div className="flex items-center gap-sm px-xs py-xs">
                <UserImage user={user} className="size-2xl" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {user?.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-xs" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-xs py-xxs text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Account
              </DropdownMenuLabel>
              <DropdownMenuItem
                render={<Link href={"/profile"} />}
                className="mx-xxs my-xxs rounded-lg"
              >
                <UserRoundCog className="text-primary" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-xs" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={logoutUserAction}
                variant="destructive"
                className="mx-xxs my-xxs rounded-lg"
              >
                <LogOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
