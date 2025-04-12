import Link from "next/link";
import NavigationSection from "./navigationSection";

export default async function Header(): Promise<JSX.Element> {
  return (
    <div className="flex items-center px-[6vw] py-3 gap-[20px] bg-foreground text-white justify-between">
      <Link
        className={`font-righteous bg-primary rounded-tl-lg rounded-br-lg border-2 px-2 text-center text-xl`}
        href="/"
      >
        UNdoubt
      </Link>
      <NavigationSection />
    </div>
  );
}
