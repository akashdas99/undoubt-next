import { logoutUser } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { isEmpty } from "@/lib/functions";
import { useGetProfileQuery, userApi } from "@/lib/store/user/user";
import { LogIn, LogOut, UserPlus, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import UserImage from "../ui/userImage";

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
      <DropdownMenuTrigger className="w-[36px] inline-flex items-center justify-center gap-2">
        <UserImage user={user} isLoading={isFetching} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="font-montserrat bg-background p-2 border border-solid border-primary/50 rounded-lg"
        align="end"
      >
        <DropdownMenuLabel>Get Started</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/50 h-[2px]" />

        {isEmpty(user) ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={"/register"}>
                <UserPlus />
                Create Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/login"}>
                <LogIn />
                Login
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href={"/profile"}>
                <UserRoundCog />
                Profile
              </Link>
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
