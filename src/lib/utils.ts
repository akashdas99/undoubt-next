import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const wait = (t: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, t));
