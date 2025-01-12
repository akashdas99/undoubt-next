import { MenuItem } from "@/lib/types";
import MenuItemComponent from "./menuItems";

export default function MenuBar({
  menuItems,
  isLoggedIn,
}: {
  menuItems: MenuItem[];
  isLoggedIn: boolean;
}) {
  return (
    <div className="hidden md:flex h-full items-center justify-end gap-[2vw] whitespace-nowrap">
      {menuItems
        ?.filter(
          (menu) =>
            menu?.allowedFor === "all" ||
            (menu?.allowedFor === "loggedOutUsers" && !isLoggedIn) ||
            (menu?.allowedFor === "loggedInUsers" && isLoggedIn)
        )
        ?.map((item) => (
          <MenuItemComponent key={item.title} item={item} />
        ))}
    </div>
  );
}
