import { apiRequest } from "@/lib/api/request";
import { authEndpoints } from "@/lib/auth/endpoints";
import { ACCESS_COOKIE } from "@workspace/constants";
import { cookies } from "next/headers";
import { cache } from "react";

export type Viewer = {
  id: string;
  userName: string;
};

type SessionResponse = { data: Viewer | null };

export const getSession = cache(async (): Promise<Viewer | null> => {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const { response } = await apiRequest<SessionResponse>(
    authEndpoints.session,
    {
      method: "GET",
      cookie: `${ACCESS_COOKIE}=${token}`,
    }
  );
  if (response === null) {
    return null;
  }
  return response.data;
});
