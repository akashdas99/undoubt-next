"use server";

import { cacheTags } from "@/lib/cache/tags";
import { revalidatePath, updateTag } from "next/cache";

export async function invalidateQuestionContent(
  slug: string,
  options?: { revalidateUrl?: boolean }
) {
  updateTag(cacheTags.questions.content(slug));
  if (options?.revalidateUrl) {
    revalidatePath(`/question/${slug}`);
  }
}
