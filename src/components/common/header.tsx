import Link from "next/link";
import QuestionSearch from "../question/questionSearch";
import { getSession } from "@/lib/session";

export default async function Header(): Promise<JSX.Element> {
  const session = await getSession();
  console.log(session);
  return (
    <div className="flex items-center px-[10%] gap-[20px] h-[60px] bg-[--dark-background] text-white">
      <Link
        className="bg-blue-500 font-semibold rounded-tl-lg rounded-br-lg border-2 px-2 text-center"
        href="/"
      >
        UNdoubt
      </Link>
      <QuestionSearch />
      <div className="h-full flex items-center justify-end gap-8">
        <Link className="link" href="/">
          Home
        </Link>
        <Link className="link" href="/addquestion">
          Add Question
        </Link>
        {session ? (
          <>
            <Link className="link" href="/profile">
              Profile
            </Link>
            <Link className="link" href="#">
              Log out
            </Link>
          </>
        ) : (
          <>
            <Link className="link" href="/signin">
              Sign In
            </Link>
            <Link className="link" href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
