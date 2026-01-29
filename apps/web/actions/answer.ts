"use server";

import { addAnswer, deleteAnswer, updateAnswer } from "@/data/answer";
import { withTryCatchResponse } from "@/lib/utils";
import { AnswerType } from "@repo/validations/answer";
import { revalidateTag } from "next/cache";

export async function addAnswerAction(slug: string, answerData: AnswerType) {
  const res = await withTryCatchResponse(addAnswer(slug, answerData));

  if (res?.success) {
    revalidateTag(`questions`, "max");
    revalidateTag(`questionBySlug:${slug}`, "max");
    revalidateTag(`answersByQuestionSlug:${slug}`, "max");
  }

  return res;
}
export async function updateAnswerAction(
  id: string,
  slug: string,
  answerData: AnswerType,
) {
  const res = await withTryCatchResponse(updateAnswer(id, answerData));
  if (res?.success) {
    revalidateTag(`answersByQuestionSlug:${slug}`, "max");
  }
  return res;
}
export async function deleteAnswerAction(id: string, slug: string) {
  const res = await withTryCatchResponse(deleteAnswer(id));
  if (res?.success) {
    revalidateTag(`questions`, "max");
    revalidateTag(`questionBySlug:${slug}`, "max");
    revalidateTag(`answersByQuestionSlug:${slug}`, "max");
  }

  return res;
}
