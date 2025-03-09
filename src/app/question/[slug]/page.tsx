import QuestionCard from "@/components/question/questionCard";
import { getQuestionBySlug, getQuestions } from "@/services/question";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const questions = await getQuestions();
  return questions.map((question) => ({ slug: question?.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const question = await getQuestionBySlug(params?.slug);
  console.log(question);
  if (!question) return notFound();
  return (
    <div className="px-[8vw] mt-8">
      <div className="flex flex-col gap-5">
        <QuestionCard question={question} />
      </div>
    </div>
  );
}
