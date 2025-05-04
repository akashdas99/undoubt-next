import Link from "next/link";
import NavigationSection from "./navigationSection";

export default async function Header(): Promise<JSX.Element> {
  return (
    <div className="flex justify-center bg-foreground text-white w-full">
      <div className="flex items-center p-3 gap-[20px] justify-between w-full my-auto max-w-screen-lg px-3">
        <Link
          className={`font-righteous bg-primary rounded-tl-lg rounded-br-lg border-2 px-2 text-center text-xl`}
          href="/"
        >
          UNdoubt
        </Link>
        <NavigationSection />
      </div>
    </div>
  );
}
