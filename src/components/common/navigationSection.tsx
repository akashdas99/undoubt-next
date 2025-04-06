"use client";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import UserImage from "../ui/userImage";

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
    <div className="flex items-center gap-2 md:gap-5 text-xs">
      <a className="flex gap-2">
        <Search /> Search
      </a>
      <Link href={"/question"} className="flex">
        <Plus /> Question
      </Link>
      <UserImage user={data} className="w-5" />
    </div>
  );
}
