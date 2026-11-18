export type FormFieldErrors = Record<string, { message: string }>;

export function parseFormErrors(error: unknown): FormFieldErrors {
  if (error === null || typeof error !== "object" || !("detail" in error)) {
    return { root: { message: "Something went wrong" } };
  }
  const record = error as Record<string, unknown>;
  const params = record["invalid-params"];
  if (params && Array.isArray(params)) {
    const errors: FormFieldErrors = {};
    for (const item of params) {
      if (
        item !== null &&
        typeof item === "object" &&
        "name" in item &&
        "reason" in item &&
        typeof item.name === "string" &&
        typeof item.reason === "string"
      ) {
        errors[item.name] = { message: item.reason };
      }
    }
    if (Object.keys(errors).length > 0) {
      return errors;
    }
  }
  const detail =
    typeof record.detail === "string" ? record.detail : "Something went wrong";
  return { root: { message: detail } };
}
