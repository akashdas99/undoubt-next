import { logoutUser } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
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
            className="rounded-full p-[2px] data-popup-open:bg-primary hover:bg-primary"
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
        className="font-montserrat bg-background p-2 border border-solid border-primary/50 rounded-lg"
        align="end"
      >
        <DropdownMenuLabel>Get Started</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/50 h-[2px]" />

        {isEmpty(user) ? (
          <>
            <DropdownMenuItem render={<Link href={"/register"} />}>
              <UserPlus />
              Create Account
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href={"/login"} />}>
              <LogIn />
              Login
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem render={<Link href={"/profile"} />}>
              <UserRoundCog />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
