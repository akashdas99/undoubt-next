"use server";

import { addAnswer, deleteAnswer, updateAnswer } from "@/data/answer";
import { withTryCatchResponse } from "@/lib/utils";
import { AnswerType } from "@repo/validations/answer";
import { updateTag } from "next/cache";

export async function addAnswerAction(slug: string, answerData: AnswerType) {
  const res = await withTryCatchResponse(addAnswer(slug, answerData));

  if (res?.success) {
    updateTag("questions");
    updateTag(`questionBySlug:${slug}`);
    updateTag(`answersByQuestionSlug:${slug}`);
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
    updateTag(`answersByQuestionSlug:${slug}`);
  }
  return res;
}
export async function deleteAnswerAction(id: string, slug: string) {
  const res = await withTryCatchResponse(deleteAnswer(id));
  if (res?.success) {
    updateTag("questions");
    updateTag(`questionBySlug:${slug}`);
    updateTag(`answersByQuestionSlug:${slug}`);
  }

  return res;
}
