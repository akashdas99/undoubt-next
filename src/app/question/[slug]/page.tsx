import AddAnswer from "@/components/answer/addAnswer";
import AnswerList from "@/components/answer/answerList";
import QuestionSection from "@/components/question/questionSection";
import PageLoader from "@/components/ui/pageLoader";
import { getSession } from "@/lib/session";
import { getQuestions } from "@/services/question";
import { Suspense } from "react";

export const revalidate = 600;

export const dynamicParams = true;

export async function generateStaticParams() {
  const questions = await getQuestions();
  return questions.map((question) => ({ slug: question?.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getSession();

  return (
    <div className="px-[8vw] mt-8">
      <div className="flex flex-col gap-5">
        <Suspense fallback={<PageLoader />}>
          <QuestionSection slug={params?.slug} />
        </Suspense>
        {session && <AddAnswer />}

        <div className="active-neo section-heading mb-2 font-righteous text-xl">
          Recent Answers
        </div>
        <Suspense fallback={<PageLoader />}>
          <AnswerList slug={params?.slug} />
        </Suspense>
      </div>
    </div>
  );
}
