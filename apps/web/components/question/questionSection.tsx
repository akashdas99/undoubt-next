import { notFound } from "next/navigation";
import QuestionCard from "./questionCard";
import { getQuestionBySlug } from "@/data/question";

export default async function QuestionSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const question = await getQuestionBySlug(slug);
  if (!question) return notFound();
  return <QuestionCard question={question} />;
}
