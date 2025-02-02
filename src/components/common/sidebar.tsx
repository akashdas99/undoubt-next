"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuItem } from "@/lib/types";
import { Menu } from "lucide-react";
import { useState } from "react";
import MenuItemComponent from "./menuItems";

export default function Sidebar({
  menuItems,
  isLoggedIn,
}: {
  menuItems: MenuItem[];
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[240px] sm:w-[300px] bg-background"
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-5">
          {menuItems
            ?.filter(
              (menu) =>
                menu?.allowedFor === "all" ||
                (menu?.allowedFor === "loggedOutUsers" && !isLoggedIn) ||
                (menu?.allowedFor === "loggedInUsers" && isLoggedIn)
            )
            ?.map((item, index) => (
              <SheetClose key={index} asChild>
                <MenuItemComponent item={item} />
              </SheetClose>
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
