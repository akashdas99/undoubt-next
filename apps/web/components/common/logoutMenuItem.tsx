"use client";

import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { LogOut } from "lucide-react";
import { useLogout } from "./useLogout";

export default function LogoutMenuItem() {
  const logout = useLogout();
  return (
    <DropdownMenuItem
      onClick={logout}
      variant="destructive"
      className="mx-xxs my-xxs rounded-2xl"
    >
      <LogOut />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
