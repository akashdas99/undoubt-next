"use client";

import { logoutUser } from "@/actions/auth";
import { userApi } from "@/lib/store/user/user";
import { MenuItem } from "@/types/misc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function MenuItemComponent({
  item,
  ...restProps
}: {
  item: MenuItem;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Link
      href={item.href}
      className="link"
      onClick={async (e) => {
        if (restProps.onClick) restProps.onClick(e);
        if (item.title === "Logout") {
          await logoutUser();
          router.refresh();
          dispatch(userApi.util.invalidateTags(["profile"]));
        }
      }}
    >
      {item.title}
    </Link>
  );
}
