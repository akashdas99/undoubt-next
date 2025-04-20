export function pick<T, K extends keyof T>(object: T, keys: K[]) {
  const entries = keys.map((key) => [key, object[key]]);
  return Object.fromEntries(entries);
}

export function isEmpty(
  value: object | string | null | undefined | number | boolean
): boolean {
  if (value == null) {
    // Handles both null and undefined
    return true;
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      // If it's an array, check if it has no elements
      return value.length === 0;
    } else {
      // If it's an object, check if it has no keys
      return Object.keys(value).length === 0;
    }
  }

  if (typeof value === "string") {
    // For strings, check if it's empty or contains only whitespace
    return value.trim().length === 0;
  }

  // For any other type (number, boolean, etc.), consider it non-empty
  return false;
}
