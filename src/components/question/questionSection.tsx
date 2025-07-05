import React from "react";
import QuestionCard from "./questionCard";
import { getQuestionBySlug } from "@/services/question";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

const getCachedQuestionBySlug = (slug: string) =>
  unstable_cache(
    async () => getQuestionBySlug(slug),
    [`questionBySlug:${slug}`],
    {
      tags: [`questionBySlug:${slug}`],
      revalidate: 600,
    }
  );

export default async function QuestionSection({ slug }: { slug: string }) {
  const getQuestion = getCachedQuestionBySlug(slug);
  const question = await getQuestion();
  if (!question) return notFound();
  return <QuestionCard question={question} />;
}
