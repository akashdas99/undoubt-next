import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center px-[10%] gap-[20px] h-[60px] bg-[--dark-background] text-white">
      <Link
        className="bg-blue-500 font-semibold rounded-tl-lg rounded-br-lg border-2 w-[82px] text-center"
        href="/"
      >
        UNdoubt
      </Link>
      <div className="h-full flex items-center justify-between grow">
        <Link className="link" href="/">
          Home
        </Link>
        <Link className="link" href="/addquestion">
          Add Question
        </Link>
        <Link className="link" href="/signin">
          SignIn
        </Link>
        <Link className="link" href="/signup">
          SignUp
        </Link>
      </div>
    </div>
  );
};

export default Header;
