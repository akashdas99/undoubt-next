import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/db/schema/users";
import { api } from "@/lib/api";

export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => api.get<User>("/api/profile"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Invalidate profile (after login/logout)
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.profile() });
  };
}
