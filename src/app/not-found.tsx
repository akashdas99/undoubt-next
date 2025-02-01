import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center grow flex-col max-w-xs w-4/5 self-center">
      <h1 className="text-primary font-semibold text-3xl mb-5">
        Page Not Found
      </h1>
      <p>Sorry, the page you’re looking for cannot be found.</p>
      <Link href="/" className="text-primary underline font-semibold mt-2">
        Return Home
      </Link>
    </div>
  );
}
