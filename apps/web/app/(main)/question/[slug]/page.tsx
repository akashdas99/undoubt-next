import AddAnswer from "@/components/answer/addAnswer";
import AnswerList from "@/components/answer/answerList";
import { QuestionCardSkeleton } from "@/components/question/questionCardSkeleton";
import QuestionDeleteModal from "@/components/question/questionDeleteModal";
import QuestionSection from "@/components/question/questionSection";
import { getAllQuestions, getQuestionBySlug } from "@/data/question";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateStaticParams() {
  const questions = await getAllQuestions();
  return questions.map((question) => ({ slug: question?.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestionBySlug(slug);

  if (!question) {
    return {
      title: "Question Not Found | Undoubt",
      description: "The question you are looking for does not exist.",
    };
  }

  // Strip HTML tags from description for meta description
  const plainDescription = question.description
    .replace(/<[^>]*>/g, "")
    .substring(0, 160);

  return {
    title: `${question.title} | Undoubt`,
    description: plainDescription || question.title,
    openGraph: {
      title: question.title,
      description: plainDescription || question.title,
      type: "article",
      authors: [question.author.name],
    },
  };
}
export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="mx-auto my-xl w-full max-w-content px-xl">
      <div className="flex flex-col gap-md">
        <Suspense fallback={<QuestionCardSkeleton />}>
          <QuestionSection params={params} />
        </Suspense>
        <QuestionDeleteModal redirectOnDelete />
        <AddAnswer />
        <div className="bordered-card p-md">
          <div className="active-neo section-heading mb-xs font-display text-title">
            Recent Answers
          </div>
          <AnswerList params={params} />
        </div>
      </div>
    </div>
  );
}
