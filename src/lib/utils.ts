import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { errorResponse } from "./response";
import { ZodError } from "zod";
import slugify from "slugify";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const wait = (t: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, t));

export async function withTryCatch<T>(promise: Promise<T>) {
  try {
    const result = await promise;
    return { result };
  } catch (error) {
    return { error };
  }
}

export async function withTryCatchResponse<T>(promise: Promise<T>) {
  const { result, error } = await withTryCatch(promise);
  if (result) {
    return result;
  }
  console.error("Server error:", error);
  return errorResponse({
    root: { message: "Something went wrong" },
  });
}
export function parseZodErrors(error: ZodError) {
  return Object.fromEntries(
    error.issues.map((issue) => [
      issue.path[0], // assume flat structure with single key path
      { message: issue.message },
    ])
  );
}
// Generate slug from title and append short UUID for uniqueness
export default function createSlug(s: string) {
  const baseSlug = slugify(s, {
    lower: true,
    strict: true,
    trim: true,
  });
  const uniqueId = nanoid(8);
  return `${baseSlug}-${uniqueId}`;
}
