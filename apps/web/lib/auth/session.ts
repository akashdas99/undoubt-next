import { httpMethod } from "@/lib/api/request";
import { serverReq } from "@/lib/api/with-session";
import { authEndpoints } from "@/lib/auth/endpoints";
import { cache } from "react";

export type Viewer = {
  id: string;
  userName: string;
};

type SessionResponse = { data: Viewer | null };

export const getSession = cache(async (): Promise<Viewer | null> => {
  const { response } = await serverReq<SessionResponse>(authEndpoints.session, {
    method: httpMethod.get,
  });
  return response?.data ?? null;
});
