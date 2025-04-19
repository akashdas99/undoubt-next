import { logoutUser } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { User } from "@/models/user";
import { LogIn, LogOut, UserPlus, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserImage from "../ui/userImage";
import { userApi } from "@/lib/store/user/user";
import { useDispatch } from "react-redux";
import { isEmpty } from "@/lib/functions";

export function ProfileDropdown({ user }: { user?: User }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
    dispatch(userApi.util.invalidateTags(["profile"]));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[36px] inline-flex items-center justify-center gap-2">
        <UserImage user={user} />
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
