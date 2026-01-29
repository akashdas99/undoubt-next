import Link from "next/link";
import NavigationSection from "./navigationSection";

export default async function Header() {
  return (
    <header className="flex justify-center bg-foreground text-white w-full sticky z-20 top-0">
      <div className="flex items-center p-3 gap-[20px] justify-between w-full my-auto max-w-[1450px]">
        <Link
          className={`font-righteous bg-primary rounded-tl-lg rounded-br-lg border-2 px-2 text-center text-xl`}
          href="/"
        >
          UNdoubt
        </Link>
        <NavigationSection />
      </div>
    </header>
  );
}
