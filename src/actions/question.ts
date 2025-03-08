"use server";

import { QuestionType } from "@/lib/types";
import { addQuestion } from "@/services/question";

export async function addQuestionAction(questionData: QuestionType) {
  return await addQuestion(questionData);
}
