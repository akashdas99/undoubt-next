"use client";

import { usePrefetch } from "@/lib/store/user/user";
import { useEffect } from "react";

export function PrefetchUser() {
  const prefetchProfile = usePrefetch("getProfile");

  useEffect(() => {
    // Prefetch profile data on mount
    prefetchProfile(undefined, { force: true });
  }, [prefetchProfile]);

  return null;
}
