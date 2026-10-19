"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@workspace/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const itemClassName =
  "text-foreground hover:bg-white hover:text-foreground aria-expanded:bg-white aria-expanded:text-foreground dark:hover:bg-muted dark:aria-expanded:bg-muted";

export function HeaderNavLink({
  href,
  className,
  children,
  prefetch = true,
  size = "default",
  "aria-label": ariaLabel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  prefetch?: boolean;
  size?: "default" | "icon";
  "aria-label"?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        itemClassName,
        active && "bg-white dark:bg-muted",
        className
      )}
    >
      {children}
    </Link>
  );
}
