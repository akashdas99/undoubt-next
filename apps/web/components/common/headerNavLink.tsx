"use client";

import { cn } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const itemClassName =
  "text-foreground hover:bg-white hover:text-foreground aria-expanded:bg-white aria-expanded:text-foreground dark:hover:bg-muted dark:aria-expanded:bg-muted";

export function HeaderNavLink({
  href,
  className,
  children,
  prefetch = true,
  ...props
}: React.ComponentProps<typeof Button> & {
  href: string;
  prefetch?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant="ghost"
      aria-current={active ? "page" : undefined}
      className={cn(
        itemClassName,
        active && "bg-white dark:bg-muted",
        className
      )}
      render={<Link href={href} prefetch={prefetch} />}
      {...props}
    >
      {children}
    </Button>
  );
}
