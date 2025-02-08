import Link from "next/link";
import QuestionSearch from "../question/questionSearch";
import { getSession } from "@/lib/session";
import Sidebar from "./sidebar";
import { MenuItem } from "@/lib/types";
import MenuBar from "./menubar";

export default async function Header(): Promise<JSX.Element> {
  const menuItems: MenuItem[] = [
    { title: "Home", href: "/", allowedFor: "all" },
    { title: "Add Question", href: "/addquestion", allowedFor: "all" },
    { title: "Profile", href: "/profile", allowedFor: "loggedInUsers" },
    { title: "Logout", href: "#", allowedFor: "loggedInUsers" },
    { title: "Log in", href: "/login", allowedFor: "loggedOutUsers" },
    { title: "Register", href: "/register", allowedFor: "loggedOutUsers" },
  ];

  const session = await getSession();
  const isLoggedIn =
    typeof session?.username === "string" && session?.username?.length >= 0;
  return (
    <div className="flex items-center px-[6vw] py-[1vw] gap-[20px] bg-foreground text-white">
      <Link
        className={`font-righteous bg-primary font-semibold rounded-tl-lg rounded-br-lg border-2 px-2 text-center`}
        href="/"
      >
        UNdoubt
      </Link>
      <div className="flex items-center grow">
        <QuestionSearch />
      </div>
      <MenuBar menuItems={menuItems} isLoggedIn={isLoggedIn} />
      <Sidebar menuItems={menuItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
