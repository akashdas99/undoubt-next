import { Separator } from "@workspace/ui/components/separator";
import { Info, MessageCircle } from "lucide-react";
import { Fragment } from "react";
import { HeaderNavItem } from "./headerNavItem";

const links = [
  { href: "/question", label: "Ask", icon: MessageCircle, prefetch: false },
  { href: "/about", label: "About", icon: Info, prefetch: true },
];

export function HeaderNavLinks({
  pathname,
  variant,
}: {
  pathname?: string;
  variant: "bar" | "menu";
}) {
  if (variant === "menu") {
    return (
      <nav aria-label="Find and ask" className="flex flex-col gap-sm">
        {links.map(({ href, label, icon: Icon, prefetch }) => (
          <HeaderNavItem
            key={href}
            href={href}
            prefetch={prefetch}
            active={pathname === href}
            className="w-full justify-start rounded-2xl px-md"
          >
            <Icon />
            {label}
          </HeaderNavItem>
        ))}
      </nav>
    );
  }

  return (
    <div className="hidden items-center gap-xs md:flex">
      {links.map(({ href, label, prefetch }) => (
        <Fragment key={href}>
          <Separator orientation="vertical" className="h-lg self-center!" />
          <HeaderNavItem
            href={href}
            prefetch={prefetch}
            active={pathname === href}
          >
            {label}
          </HeaderNavItem>
        </Fragment>
      ))}
    </div>
  );
}
