"use server";

import { AnswerType } from "@/lib/types";
import { addAnswer } from "@/services/answer";
import { revalidateTag } from "next/cache";

export async function addAnswerAction(slug: string, answerData: AnswerType) {
  const result = await addAnswer(slug, answerData);
  revalidateTag(`answersByQuestionSlug:${slug}`);
  return result;
}
