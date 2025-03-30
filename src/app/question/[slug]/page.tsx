import AddAnswer from "@/components/answer/addAnswer";
import AnswerList from "@/components/answer/answerList";
import QuestionSection from "@/components/question/questionSection";
import { getSession } from "@/lib/session";
import { getQuestions } from "@/services/question";

export async function generateStaticParams() {
  const questions = await getQuestions();
  return questions.map((question) => ({ slug: question?.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getSession();
  return (
    <div className="px-[8vw] mt-8">
      <div className="flex flex-col gap-5">
        <QuestionSection slug={params?.slug} />
        {session && <AddAnswer />}
        <div className="active-neo section-heading mb-2 font-righteous text-xl">
          Recent Answers
        </div>
        <AnswerList slug={params?.slug} />
      </div>
    </div>
  );
}
