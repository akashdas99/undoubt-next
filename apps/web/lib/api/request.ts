import { DEFAULT_API_ORIGIN } from "@/lib/constants";

export type ApiResult<T> =
  | { response: T; error: null }
  | { response: null; error: unknown };

export function apiResult<T>(ok: boolean, body: unknown): ApiResult<T> {
  if (!ok) {
    return { response: null, error: body };
  }
  return { response: body as T, error: null };
}

export function apiOrigin() {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_ORIGIN;
  return configured.replace(/\/$/, "");
}

type ApiRequestInit = {
  method: "GET" | "POST";
  body?: unknown;
  cookie?: string;
};

export async function apiRequest<T>(
  path: string,
  init: ApiRequestInit
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {};
    if (init.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (init.cookie) {
      headers.cookie = init.cookie;
    }
    const response = await fetch(`${apiOrigin()}${path}`, {
      method: init.method,
      credentials: init.cookie ? "omit" : "include",
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    const body = await readJson(response);
    return apiResult<T>(response.ok, body);
  } catch {
    return apiResult<T>(false, { message: "Something went wrong" });
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
