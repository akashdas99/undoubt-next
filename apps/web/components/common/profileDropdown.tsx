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
import { getUserById } from "@/data/user";
import { isEmpty } from "@/lib/functions";
import { withTryCatch } from "@/lib/utils";
import { LogIn, LogOut, UserPlus, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "@/lib/cache/tags";
import { Button } from "@workspace/ui/components/button";
import UserImage from "../ui/userImage";

export async function ProfileDropdown({
  sessionId,
}: {
  sessionId?: string | null;
}) {
  "use cache";
  cacheTag(cacheTags.userProfile());
  cacheLife("hours");
  const { result: user } = sessionId
    ? await withTryCatch(getUserById(sessionId))
    : { result: null };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={"icon"}
            className="rounded-full p-0.5 transition-shadow hover:ring-2 hover:ring-primary/30 data-popup-open:ring-2 data-popup-open:ring-primary/50"
          >
            <UserImage user={user} />
          </Button>
        }
      />

      <DropdownMenuContent className="frosted-glass" align="end" sideOffset={8}>
        {isEmpty(user) ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Get Started
            </DropdownMenuLabel>
            <DropdownMenuItem
              render={<Link href={"/register"} />}
              className="mx-1 my-0.5 rounded-lg"
            >
              <UserPlus className="text-primary" />
              <span>Create Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={"/login"} />}
              className="mx-1 my-0.5 rounded-lg"
            >
              <LogIn className="text-primary" />
              <span>Login</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuGroup>
              <div className="flex items-center gap-3 px-2 py-2">
                <UserImage user={user} className="h-10 w-10" />
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

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Account
              </DropdownMenuLabel>
              <DropdownMenuItem
                render={<Link href={"/profile"} />}
                className="mx-1 my-0.5 rounded-lg"
              >
                <UserRoundCog className="text-primary" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={logoutUserAction}
                variant="destructive"
                className="mx-1 my-0.5 rounded-lg"
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
