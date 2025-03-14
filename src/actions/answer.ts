"use server";

import { AnswerType } from "@/lib/types";
import { addAnswer } from "@/services/answer";
import { redirect } from "next/navigation";

export async function addAnswerAction(slug: string, answerData: AnswerType) {
  const result = await addAnswer(slug, answerData);
  if (result?.error) return result;
  redirect("/");
}
