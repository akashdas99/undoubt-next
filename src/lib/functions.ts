export function pick<T, K extends keyof T>(object: T, keys: K[]) {
  const entries = keys.map((key) => [key, object[key]]);
  return Object.fromEntries(entries);
}
