import { notFound } from "next/navigation";
import QuestionCard from "./questionCard";
import { getQuestionBySlug } from "@/data/question";

export default async function QuestionSection({
  params,
  userId,
}: {
  params: Promise<{ slug: string }>;
  userId: string | null;
}) {
  const { slug = "" } = await params;
  const question = await getQuestionBySlug(slug, userId);
  if (!question) return notFound();
  return <QuestionCard question={question} />;
}
