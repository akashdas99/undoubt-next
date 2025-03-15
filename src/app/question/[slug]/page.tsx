import AddAnswer from "@/components/answer/addAnswer";
import AnswerCard from "@/components/answer/answerCard";
import QuestionCard from "@/components/question/questionCard";
import { getSession } from "@/lib/session";
import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import { getAnswersByQuestionSlug } from "@/services/answer";
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
  const answers: Array<
    Omit<Answer, "author"> & {
      author: User;
    }
  > = await getAnswersByQuestionSlug(params?.slug);
  const session = await getSession();

  if (!question) return notFound();
  return (
    <div className="px-[8vw] mt-8">
      <div className="flex flex-col gap-5">
        <QuestionCard question={question} />
        {session && <AddAnswer />}

        <div className="active-neo section-heading mb-2 font-righteous text-xl">
          Recent Answers
        </div>

        {answers.length === 0 ? (
          <p>No Questions</p>
        ) : (
          <div className="flex flex-col gap-5">
            {answers?.map((answer) => (
              <AnswerCard key={answer?._id?.toString()} answer={answer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
