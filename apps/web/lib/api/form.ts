import { parseFormErrors } from "@/lib/api/formErrors";
import { apiRequest, httpMethod, type ApiMethod } from "@/lib/api/request";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

async function mutateForm<T extends FieldValues>(
  method: ApiMethod,
  path: string,
  body: unknown | undefined,
  setError: UseFormSetError<T>,
  onSuccess?: () => void | Promise<void>
) {
  const { error } = await apiRequest(path, {
    method,
    ...(body !== undefined ? { body } : {}),
  });
  if (error) {
    for (const [field, { message }] of Object.entries(parseFormErrors(error))) {
      setError(field as FieldPath<T> | "root", { message });
    }
    return;
  }
  await onSuccess?.();
}

export async function postForm<T extends FieldValues>(
  path: string,
  body: unknown,
  setError: UseFormSetError<T>,
  onSuccess?: () => void | Promise<void>
) {
  await mutateForm(httpMethod.post, path, body, setError, onSuccess);
}

export async function patchForm<T extends FieldValues>(
  path: string,
  body: unknown,
  setError: UseFormSetError<T>,
  onSuccess?: () => void | Promise<void>
) {
  await mutateForm(httpMethod.patch, path, body, setError, onSuccess);
}

export async function deleteRequest(path: string) {
  return apiRequest(path, { method: httpMethod.delete });
}
