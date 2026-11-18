import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiResult } from "./request.ts";

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
