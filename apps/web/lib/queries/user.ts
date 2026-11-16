"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/db/schema/users";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queries/keys";

export function useProfile(enabled = false) {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: () => api.get<User | null>("/api/profile"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled,
  });
}

// Invalidate profile (after login/logout)
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
  };
}
