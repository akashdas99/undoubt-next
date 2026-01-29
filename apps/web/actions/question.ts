"use server";

import { addQuestion, deleteQuestion, editQuestion } from "@/data/question";
import { voteOnQuestion, VoteType } from "@/data/questionVote";
import { withTryCatchResponse } from "@/lib/utils";
import {
  DeleteQuestionType,
  EditQuestionType,
  QuestionType,
} from "@repo/validations/question";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addQuestionAction(questionData: QuestionType) {
  const res = await withTryCatchResponse(addQuestion(questionData));

  if (res?.success) {
    revalidateTag("questions", "max");
    redirect("/");
  }

  return res;
}

export async function editQuestionAction(questionData: EditQuestionType) {
  const res = await withTryCatchResponse(editQuestion(questionData));

  if (res?.success) {
    revalidateTag("questions", "max");
  }

  return res;
}

export async function deleteQuestionAction(
  questionData: DeleteQuestionType,
  shouldRedirect?: boolean,
) {
  const res = await withTryCatchResponse(deleteQuestion(questionData));

  if (res?.success) {
    revalidateTag("questions", "max");
    // Also revalidate the specific question page to remove it from static cache
    if ("data" in res && res.data?.slug) {
      revalidateTag(`questionBySlug:${res.data.slug}`, "max");
    }
    if (shouldRedirect) redirect("/");
  }

  return res;
}

export async function voteOnQuestionAction(
  questionId: string,
  voteType: VoteType,
) {
  const res = await withTryCatchResponse(voteOnQuestion(questionId, voteType));

  if (res?.success) {
    revalidateTag("questions", "max");
  }

  return res;
}
