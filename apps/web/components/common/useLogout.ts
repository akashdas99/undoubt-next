"use client";

import { authEndpoints } from "@/lib/auth/endpoints";
import { apiRequest } from "@/lib/api/request";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  return () => {
    void apiRequest(authEndpoints.logout, { method: "POST" }).then(() => {
      router.refresh();
    });
  };
}
