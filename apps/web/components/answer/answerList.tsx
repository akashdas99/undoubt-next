import { getAnswersByQuestionSlug } from "@/data/answer";
import AnswerCard from "./answerCard";

export default async function AnswerList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const { data: answers } = await getAnswersByQuestionSlug(slug);

  return (
    <>
      {answers?.length === 0 ? (
        <p>No Answer</p>
      ) : (
        <div className="flex flex-col gap-md">
          {answers?.map((answer) => (
            <AnswerCard key={answer?.id} answer={answer} />
          ))}
        </div>
      )}
    </>
  );
}
