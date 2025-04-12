"use client";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import UserImage from "../ui/userImage";
import SearchModal from "./searchModal";

export default function NavigationSection() {
  // const menuItems: MenuItem[] = [
  //   { title: "Add Question", href: "/question", allowedFor: "loggedInUsers" },
  //   { title: "Profile", href: "/profile", allowedFor: "loggedInUsers" },
  //   { title: "Logout", href: "#", allowedFor: "loggedInUsers" },
  //   { title: "Log in", href: "/login", allowedFor: "loggedOutUsers" },
  //   { title: "Register", href: "/register", allowedFor: "loggedOutUsers" },
  // ];
  const { data, isFetching } = useGetProfileQuery();
  console.log({ data, isFetching });
  return (
    <div className="flex items-center gap-5 text-xs">
      <SearchModal />
      <Button variant="ghost" size={"icon"}>
        <Link href={"/question"} className="flex">
          <Plus />
        </Link>
      </Button>
      <Button variant="ghost" size={"icon"}>
        <UserImage user={data} className="w-5" />
      </Button>
    </div>
  );
}
