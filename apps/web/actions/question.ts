"use server";

import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestionBySlug,
} from "@/data/question";
import { getSession } from "@/lib/session";
import { voteOnQuestion, VoteType } from "@/data/questionVote";
import { withTryCatchResponse } from "@/lib/utils";
import {
  DeleteQuestionType,
  EditQuestionType,
  QuestionType,
} from "@workspace/validations/question";
import { cacheTags } from "@/lib/cache/tags";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addQuestionAction(questionData: QuestionType) {
  const res = await withTryCatchResponse(addQuestion(questionData));

  if (res?.success) {
    redirect("/");
  }

  return res;
}

export async function getQuestionBySlugAction(slug: string) {
  const session = await getSession();
  const question = await getQuestionBySlug(slug, session?.id ?? null);
  if (!question) return null;

  return {
    ...question,
    createdAt:
      question.createdAt instanceof Date
        ? question.createdAt.toISOString()
        : question.createdAt,
  };
}

export async function editQuestionAction(questionData: EditQuestionType) {
  const res = await withTryCatchResponse(editQuestion(questionData));

  if (res?.success && "data" in res && res.data?.slug) {
    updateTag(cacheTags.questions.content(res.data.slug));
    revalidatePath(`/question/${res.data.slug}`);
  }

  return res;
}

export async function deleteQuestionAction(
  questionData: DeleteQuestionType,
  shouldRedirect?: boolean
) {
  const res = await withTryCatchResponse(deleteQuestion(questionData));

  if (res?.success) {
    if ("data" in res && res.data?.slug) {
      updateTag(cacheTags.questions.content(res.data.slug));
    }
    if (shouldRedirect) redirect("/");
  }

  return res;
}

export async function voteOnQuestionAction(
  questionId: string,
  voteType: VoteType
) {
  const res = await withTryCatchResponse(voteOnQuestion(questionId, voteType));

  return res;
}
