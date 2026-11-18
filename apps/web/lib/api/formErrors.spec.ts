import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseFormErrors } from "./formErrors.ts";

describe("parseFormErrors", () => {
  it("maps invalid-params onto form fields", () => {
    assert.deepEqual(
      parseFormErrors({
        detail: "Taken",
        "invalid-params": [
          { name: "email", reason: "Email is already in use" },
        ],
      }),
      { email: { message: "Email is already in use" } }
    );
  });

  it("uses detail when the body has no field list", () => {
    assert.deepEqual(parseFormErrors({ detail: "Invalid email or password" }), {
      root: { message: "Invalid email or password" },
    });
  });
});
