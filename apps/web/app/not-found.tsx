import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex w-4/5 max-w-narrow grow flex-col justify-center self-center">
      <h1 className="mb-lg text-3xl font-semibold text-primary">
        Page Not Found
      </h1>
      <p>Sorry, the page you’re looking for cannot be found.</p>
      <Link href="/" className="mt-xs font-semibold text-primary underline">
        Return Home
      </Link>
    </div>
  );
}
