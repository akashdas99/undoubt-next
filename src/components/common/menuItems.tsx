import { MenuItem } from "@/lib/types";
import Link from "next/link";

export default function MenuItemComponent({ item }: { item: MenuItem }) {
  return (
    <Link href={item.href} className="link">
      {item.title}
    </Link>
  );
}
