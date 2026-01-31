const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

type Params = Record<string, string | number | undefined>;

type FetchOptions = Omit<RequestInit, "body"> & {
  params?: Params;
};

type MutationOptions = FetchOptions & {
  body?: unknown;
};

async function request<T>(
  endpoint: string,
  options?: FetchOptions & { body?: BodyInit },
): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};

  let url = `${baseUrl}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

function withJsonBody(
  options?: MutationOptions,
): FetchOptions & { body?: BodyInit } {
  if (!options) return {};
  const { body, ...rest } = options;
  if (body === undefined) return rest;
  return {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    body: JSON.stringify(body),
  };
}

export const api = {
  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, options?: MutationOptions): Promise<T> {
    return request<T>(endpoint, { ...withJsonBody(options), method: "POST" });
  },

  put<T>(endpoint: string, options?: MutationOptions): Promise<T> {
    return request<T>(endpoint, { ...withJsonBody(options), method: "PUT" });
  },

  delete<T>(endpoint: string, options?: MutationOptions): Promise<T> {
    return request<T>(endpoint, { ...withJsonBody(options), method: "DELETE" });
  },
};
