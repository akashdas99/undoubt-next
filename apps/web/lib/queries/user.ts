"use client";

import { apiRequest, httpMethod } from "@/lib/api/request";
import { userEndpoints } from "@/lib/domain/endpoints";
import { queryKeys } from "@/lib/queries/keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type ProfileUser = {
  id: string;
  name: string;
  userName: string;
  email: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  profilePicture: string | null;
};

export function useProfile(enabled = false) {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: async () => {
      const { response, error } = await apiRequest<ProfileUser>(
        userEndpoints.me,
        { method: httpMethod.get }
      );
      if (error) {
        return null;
      }
      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled,
  });
}

export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
  };
}
