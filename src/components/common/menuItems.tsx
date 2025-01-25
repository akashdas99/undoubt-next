"use client";

import { logoutUser } from "@/actions/auth";
import { MenuItem } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuItemComponent({
  item,
  ...restProps
}: {
  item: MenuItem;
}) {
  const router = useRouter();
  return (
    <Link
      href={item.href}
      className="link"
      onClick={async () => {
        if (item.title === "Logout") {
          await logoutUser();
          router.refresh();
        }
      }}
      {...restProps}
    >
      {item.title}
    </Link>
  );
}
