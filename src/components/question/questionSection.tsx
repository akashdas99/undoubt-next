import { getQuestionBySlug } from "@/services/question";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import QuestionCard from "./questionCard";

const getCachedQuestionBySlug = (slug: string) =>
  unstable_cache(
    async () => getQuestionBySlug(slug),
    [`questionBySlug:${slug}`],
    {
      tags: [`questionBySlug:${slug}`],
      revalidate: 600,
    }
  );

export default async function QuestionSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const getQuestion = getCachedQuestionBySlug(slug);
  const question = await getQuestion();
  if (!question) return notFound();
  return <QuestionCard question={question} />;
}
