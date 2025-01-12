import Link from "next/link";
import QuestionSearch from "../question/questionSearch";
import { getSession } from "@/lib/session";
import HamburgerMenu from "./menu";
import { MenuItem } from "@/lib/types";
import MenuBar from "./menubar";

export default async function Header(): Promise<JSX.Element> {
  const menuItems: MenuItem[] = [
    { title: "Home", href: "/", allowedFor: "all" },
    { title: "Add Question", href: "/addquestion", allowedFor: "all" },
    { title: "Profile", href: "/profile", allowedFor: "loggedInUsers" },
    { title: "Logout", href: "#", allowedFor: "loggedInUsers" },
    { title: "LogIn", href: "/login", allowedFor: "loggedOutUsers" },
    { title: "Register", href: "/register", allowedFor: "loggedOutUsers" },
  ];

  const session = await getSession();
  const isLoggedIn = session?.username?.length === 0;
  return (
    <div className="flex items-center px-[6vw] gap-[20px] h-[60px] bg-[--dark-background] text-white">
      <Link
        className="bg-blue-500 font-semibold rounded-tl-lg rounded-br-lg border-2 px-2 text-center"
        href="/"
      >
        UNdoubt
      </Link>
      <QuestionSearch />
      <MenuBar menuItems={menuItems} isLoggedIn={isLoggedIn} />
      <HamburgerMenu menuItems={menuItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
