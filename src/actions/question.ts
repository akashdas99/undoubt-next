"use server";

import { addQuestion, deleteQuestion, editQuestion } from "@/data/question";
import { voteOnQuestion, VoteType } from "@/data/questionVote";
import { withTryCatchResponse } from "@/lib/utils";
import {
  DeleteQuestionType,
  EditQuestionType,
  QuestionType,
} from "@/validations/question";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addQuestionAction(questionData: QuestionType) {
  const res = await withTryCatchResponse(addQuestion(questionData));

  if (res?.success) {
    revalidateTag("questions");
    redirect("/");
  }

  return res;
}

export async function editQuestionAction(questionData: EditQuestionType) {
  const res = await withTryCatchResponse(editQuestion(questionData));

  if (res?.success) {
    revalidateTag("questions");
  }

  return res;
}

export async function deleteQuestionAction(questionData: DeleteQuestionType) {
  const res = await withTryCatchResponse(deleteQuestion(questionData));

  if (res?.success) {
    revalidateTag("questions");
    redirect("/");
  }

  return res;
}

export async function voteOnQuestionAction(
  questionId: string,
  voteType: VoteType
) {
  const res = await withTryCatchResponse(voteOnQuestion(questionId, voteType));

  if (res?.success) {
    revalidateTag("questions");
  }

  return res;
}
