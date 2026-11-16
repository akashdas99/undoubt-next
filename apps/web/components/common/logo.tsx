import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center justify-center font-display text-2xl leading-none tracking-wider text-foreground",
        className
      )}
    >
      <span className="text-primary">UN</span>
      doubt
    </Link>
  );
}
