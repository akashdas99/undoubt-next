"use client";

import { apiRequest, httpMethod } from "@/lib/api/request";
import { authEndpoints } from "@/lib/auth/endpoints";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  return () => {
    void apiRequest(authEndpoints.logout, { method: httpMethod.post }).then(
      () => {
        router.refresh();
      }
    );
  };
}
