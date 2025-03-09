"use server";

import { QuestionType } from "@/lib/types";
import { addQuestion } from "@/services/question";
import { redirect } from "next/navigation";

export async function addQuestionAction(questionData: QuestionType) {
  const result = await addQuestion(questionData);
  if (result?.error) return result;
  redirect("/");
}
