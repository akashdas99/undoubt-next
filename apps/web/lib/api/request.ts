export type ApiResult<T> =
  | { response: T; error: null }
  | { response: null; error: unknown };

export function apiResult<T>(ok: boolean, body: unknown): ApiResult<T> {
  if (!ok) {
    return {
      response: null,
      error: body || { message: "Request failed" },
    };
  }
  return { response: body as T, error: null };
}

export function apiOrigin() {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (!configured) {
    throw new Error("NEXT_PUBLIC_API_URL is required");
  }
  return configured.replace(/\/$/, "");
}

export const httpMethod = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
} as const;

export type ApiMethod = (typeof httpMethod)[keyof typeof httpMethod];

export type ApiRequestInit = {
  method: ApiMethod;
  body?: unknown;
  cookie?: string;
  searchParams?: Record<string, string | number | undefined>;
};

export type ApiRequest = <T>(
  path: string,
  init: ApiRequestInit
) => Promise<ApiResult<T>>;

function requestUrl(
  path: string,
  searchParams?: Record<string, string | number | undefined>
) {
  const base = `${apiOrigin()}${path}`;
  if (!searchParams) {
    return base;
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export async function apiRequest<T>(
  path: string,
  init: ApiRequestInit
): Promise<ApiResult<T>> {
  const url = requestUrl(path, init.searchParams);
  try {
    const headers: Record<string, string> = {};
    if (init.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (init.cookie) {
      headers.cookie = init.cookie;
    }
    const response = await fetch(url, {
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
  if (response.status === 204) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}
