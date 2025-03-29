import React from "react";
import QuestionCard from "./questionCard";
import { getQuestionBySlug } from "@/services/question";
import { notFound } from "next/navigation";

export default async function QuestionSection({ slug }: { slug: string }) {
  const question = await getQuestionBySlug(slug);
  if (!question) return notFound();
  return <QuestionCard question={question} />;
}
