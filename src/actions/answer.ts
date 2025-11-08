"use server";

import { addAnswer } from "@/data/answer";
import { withTryCatchResponse } from "@/lib/utils";
import { deleteAnswer, updateAnswer } from "@/services/answer";
import { AnswerType } from "@/validations/answer";
import { revalidateTag } from "next/cache";

export async function addAnswerAction(slug: string, answerData: AnswerType) {
  const res = await withTryCatchResponse(addAnswer(slug, answerData));

  if (res?.success) {
    revalidateTag(`questions`);
    revalidateTag(`questionBySlug:${slug}`);
    revalidateTag(`answersByQuestionSlug:${slug}`);
  }

  return res;
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
  revalidateTag(`questions`);
  revalidateTag(`questionBySlug:${slug}`);
  revalidateTag(`answersByQuestionSlug:${slug}`);

  return result;
}
