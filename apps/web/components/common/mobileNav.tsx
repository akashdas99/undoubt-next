"use client";

import { useResetOnChange } from "@/hooks/useResetOnChange";
import { cn } from "@/lib/utils";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { Info, Menu, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeaderNavLink } from "./headerNavLink";
import { Logo } from "./logo";
import { ThemeToggle } from "./themeToggle";

export function MobileNav({ account }: { account: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useResetOnChange(pathname, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="text-foreground hover:bg-white hover:text-foreground md:hidden dark:hover:bg-muted"
          />
        }
      >
        <Menu />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Popup
          data-slot="mobile-nav"
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-dvh w-full max-w-narrow flex-col gap-md overflow-y-auto rounded-r-panel bg-background p-md text-foreground shadow-card backdrop-blur-md outline-none",
            "duration-100 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-left data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-left"
          )}
        >
          <div className="flex items-center justify-between gap-sm">
            <DialogTitle className="sr-only">Menu</DialogTitle>
            <Logo />
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  className="text-foreground hover:bg-white hover:text-foreground dark:hover:bg-muted"
                />
              }
            >
              <X />
            </DialogClose>
          </div>
          <nav aria-label="Find and ask" className="flex flex-col gap-sm">
            <HeaderNavLink
              href="/question"
              prefetch={false}
              className="w-full justify-start rounded-2xl px-md"
            >
              <MessageCircle />
              Ask
            </HeaderNavLink>
            <HeaderNavLink
              href="/about"
              className="w-full justify-start rounded-2xl px-md"
            >
              <Info />
              About
            </HeaderNavLink>
          </nav>
          <div className="mt-auto flex flex-col gap-sm">
            <div className="flex items-center justify-between gap-sm px-md">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Separator />
            {account}
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
