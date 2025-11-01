"use server";

import { addQuestion } from "@/data/question";
import { withTryCatchResponse } from "@/lib/utils";
import { QuestionType } from "@/validations/question";
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
