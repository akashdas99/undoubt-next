import { logoutUser } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isEmpty } from "@/lib/functions";
import { useGetProfileQuery, userApi } from "@/lib/store/user/user";
import { LogIn, LogOut, UserPlus, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import UserImage, { UserImageSkeleton } from "../ui/userImage";
import { Button } from "../ui/button";

export function ProfileDropdown() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: user, isFetching } = useGetProfileQuery();

  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
    dispatch(userApi.util.invalidateTags(["profile"]));
  };

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
        {isFetching ? (
          <UserImageSkeleton className="w-[36px]" />
        ) : (
          <UserImage user={user} />
        )}
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
                onClick={handleLogout}
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
