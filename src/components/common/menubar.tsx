import { MenuItem } from "@/types/misc";
import MenuItemComponent from "./menuItems";

export default function MenuBar({
  menuItems,
  isLoggedIn,
}: {
  menuItems: MenuItem[];
  isLoggedIn: boolean;
}) {
  return (
    <ul className="flex text-xs lg:text-base h-full items-center justify-end md:gap-[1em] lg:gap-[2em] whitespace-nowrap px-2">
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
    </ul>
  );
}
