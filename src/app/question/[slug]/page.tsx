import AddAnswer from "@/components/answer/addAnswer";
import AnswerCard from "@/components/answer/answerCard";
import AnswerList from "@/components/answer/answerList";
import QuestionCard from "@/components/question/questionCard";
import QuestionSection from "@/components/question/questionSection";
import { getSession } from "@/lib/session";
import { getQuestions } from "@/services/question";
import { Suspense } from "react";

export async function generateStaticParams() {
  const questions = await getQuestions();
  return questions.map((question) => ({ slug: question?.slug }));
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const session = await getSession();
  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="flex flex-col gap-5">
        <Suspense fallback={<QuestionCard isLoading={true} />}>
          <QuestionSection slug={params?.slug} />
        </Suspense>
        {session && <AddAnswer />}
        <div className="bordered-card p-[1em]">
          <div className="active-neo section-heading mb-2 font-righteous text-xl">
            Recent Answers
          </div>
          <Suspense fallback={<AnswerCard isLoading={true} />}>
            <AnswerList slug={params?.slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
