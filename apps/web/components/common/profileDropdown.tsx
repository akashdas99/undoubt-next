import { logoutUserAction } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserById } from "@/data/user";
import { isEmpty } from "@/lib/functions";
import { withTryCatch } from "@/lib/utils";
import { LogIn, LogOut, UserPlus, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Button } from "../ui/button";
import UserImage from "../ui/userImage";

export async function ProfileDropdown({
  sessionId,
}: {
  sessionId?: string | null;
}) {
  "use cache";
  cacheTag("user-profile");
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
            className="rounded-full p-[2px] data-popup-open:ring-2 data-popup-open:ring-primary/50 hover:ring-2 hover:ring-primary/30 transition-shadow"
          />
        }
      >
        <UserImage user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg rounded-xl p-1.5"
        align="end"
        sideOffset={8}
      >
        {isEmpty(user) ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
              Get Started
            </DropdownMenuLabel>
            <DropdownMenuItem
              render={<Link href={"/register"} />}
              className="rounded-lg mx-1 my-0.5"
            >
              <UserPlus className="text-primary" />
              <span>Create Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={"/login"} />}
              className="rounded-lg mx-1 my-0.5"
            >
              <LogIn className="text-primary" />
              <span>Login</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuGroup>
              <div className="flex items-center gap-3 px-2 py-2">
                <UserImage user={user} className="w-10 h-10" />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm truncate">
                    {user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                Account
              </DropdownMenuLabel>
              <DropdownMenuItem
                render={<Link href={"/profile"} />}
                className="rounded-lg mx-1 my-0.5"
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
                className="rounded-lg mx-1 my-0.5"
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
