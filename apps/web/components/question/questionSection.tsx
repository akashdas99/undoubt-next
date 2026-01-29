import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import QuestionCard from "./questionCard";
import { getQuestionBySlug } from "@/data/question";

async function getCachedQuestionBySlug(slug: string) {
  "use cache";
  cacheTag(`questionBySlug:${slug}`);
  return getQuestionBySlug(slug);
}

export default async function QuestionSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const question = await getCachedQuestionBySlug(slug);
  if (!question) return notFound();
  return <QuestionCard question={question} />;
}
