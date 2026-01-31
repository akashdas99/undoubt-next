"use client";

import { logoutUser } from "@/actions/auth";
import { useInvalidateProfile } from "@/lib/queries/user";
import { MenuItem } from "@/types/misc";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuItemComponent({
  item,
  ...restProps
}: {
  item: MenuItem;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) {
  const router = useRouter();
  const invalidateProfile = useInvalidateProfile();

  return (
    <Link
      href={item.href}
      className="link"
      onClick={async (e) => {
        if (restProps.onClick) restProps.onClick(e);
        if (item.title === "Logout") {
          await logoutUser();
          router.refresh();
          invalidateProfile();
        }
      }}
    >
      {item.title}
    </Link>
  );
}
