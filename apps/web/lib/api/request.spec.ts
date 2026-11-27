import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { apiRequest, apiResult, httpMethod } from "./request.ts";

describe("apiResult", () => {
  it("returns the body and no error when the status is ok", () => {
    assert.deepEqual(apiResult(true, null), {
      response: null,
      error: null,
    });
  });

  it("returns the raw body as error when the status is not ok", () => {
    assert.deepEqual(
      apiResult(false, { detail: "Invalid email or password" }),
      {
        response: null,
        error: { detail: "Invalid email or password" },
      }
    );
  });
});

describe("apiRequest", () => {
  const previousFetch = globalThis.fetch;
  const previousOrigin = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    globalThis.fetch = previousFetch;
    if (previousOrigin === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = previousOrigin;
    }
  });

  it("posts JSON with credentials when the call has no session cookie", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.test/";
    let url = "";
    let init: RequestInit | undefined;
    globalThis.fetch = (async (input: string | URL, options?: RequestInit) => {
      url = String(input);
      init = options;
      return Response.json({ id: "q1" });
    }) as typeof fetch;

    const result = await apiRequest<{ id: string }>("/questions", {
      method: httpMethod.post,
      body: { title: "Why" },
      searchParams: { keyword: "why", cursor: undefined, limit: 10 },
    });

    assert.deepEqual(result, { response: { id: "q1" }, error: null });
    assert.equal(url, "http://api.test/questions?keyword=why&limit=10");
    assert.equal(init?.method, "POST");
    assert.equal(init?.credentials, "include");
    assert.equal(init?.cache, "no-store");
    assert.equal(init?.body, JSON.stringify({ title: "Why" }));
    assert.deepEqual(init?.headers, { "Content-Type": "application/json" });
  });

  it("forwards a session cookie and omits browser credentials", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.test";
    let init: RequestInit | undefined;
    globalThis.fetch = (async (_input: string | URL, options?: RequestInit) => {
      init = options;
      return new Response(null, { status: 204 });
    }) as typeof fetch;

    const result = await apiRequest("/questions/1", {
      method: "DELETE",
      cookie: "access=abc",
    });

    assert.deepEqual(result, { response: null, error: null });
    assert.equal(init?.credentials, "omit");
    assert.deepEqual(init?.headers, { cookie: "access=abc" });
    assert.equal(init?.body, undefined);
  });

  it("returns the error body when the status is not ok", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.test";
    globalThis.fetch = (async () =>
      Response.json(
        { detail: "Invalid email or password" },
        {
          status: 401,
        }
      )) as typeof fetch;

    const result = await apiRequest("/auth/login", { method: httpMethod.post });

    assert.deepEqual(result, {
      response: null,
      error: { detail: "Invalid email or password" },
    });
  });

  it("returns a generic error when the network fails", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://api.test";
    globalThis.fetch = (async () => {
      throw new Error("offline");
    }) as typeof fetch;

    const result = await apiRequest("/questions", { method: httpMethod.get });

    assert.deepEqual(result, {
      response: null,
      error: { message: "Something went wrong" },
    });
  });

  it("throws when the API origin is blank", async () => {
    process.env.NEXT_PUBLIC_API_URL = "";

    await assert.rejects(
      () => apiRequest("/questions", { method: httpMethod.get }),
      /NEXT_PUBLIC_API_URL is required/
    );
  });
});
