import { ACCESS_COOKIE } from "@workspace/constants";
import { cookies } from "next/headers";
import {
  apiRequest,
  type ApiRequestInit,
  type ApiResult,
} from "@/lib/api/request";

export async function serverReq<T>(
  path: string,
  init: Omit<ApiRequestInit, "cookie">
): Promise<ApiResult<T>> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  return apiRequest<T>(path, {
    ...init,
    cookie: token ? `${ACCESS_COOKIE}=${token}` : undefined,
  });
}
