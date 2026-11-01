"use client";

import { usePathname } from "next/navigation";
import { HeaderNavLinks } from "./headerNavLinks";

export function ActiveHeaderNavLinks(
  props: Omit<React.ComponentProps<typeof HeaderNavLinks>, "pathname">
) {
  const pathname = usePathname();

  return <HeaderNavLinks {...props} pathname={pathname} />;
}
