"use server";

import { QuestionType } from "@/lib/types";
import { addQuestion } from "@/services/question";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addQuestionAction(questionData: QuestionType) {
  const result = await addQuestion(questionData);
  if (result?.error) return result;
  revalidateTag("questions");
  redirect("/");
}
