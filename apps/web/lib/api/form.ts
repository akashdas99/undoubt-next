import { parseFormErrors } from "@/lib/api/formErrors";
import { apiRequest } from "@/lib/api/request";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

export async function postForm<T extends FieldValues>(
  path: string,
  body: unknown,
  setError: UseFormSetError<T>,
  onSuccess?: () => void | Promise<void>
) {
  const { error } = await apiRequest(path, { method: "POST", body });
  if (error) {
    for (const [field, { message }] of Object.entries(parseFormErrors(error))) {
      setError(field as FieldPath<T> | "root", { message });
    }
    return;
  }
  await onSuccess?.();
}
