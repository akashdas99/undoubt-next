"use server";

import { AnswerType } from "@/lib/types";
import { addAnswer, deleteAnswer, updateAnswer } from "@/services/answer";
import { revalidateTag } from "next/cache";

export async function addAnswerAction(slug: string, answerData: AnswerType) {
  const result = await addAnswer(slug, answerData);
  revalidateTag(`answersByQuestionSlug:${slug}`);
  return result;
}
export async function updateAnswerAction(
  id: string,
  slug: string,
  answerData: AnswerType
) {
  const result = await updateAnswer(id, answerData);
  revalidateTag(`answersByQuestionSlug:${slug}`);
  return result;
}
export async function deleteAnswerAction(id: string, slug: string) {
  const result = await deleteAnswer(id, slug);
  revalidateTag(`answersByQuestionSlug:${slug}`);
  return result;
}
