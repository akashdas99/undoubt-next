import { getAnswersByQuestionSlug } from "@/data/answer";
import AnswerCard from "./answerCard";

async function getCachedAnswersByQuestionSlug(slug: string) {
  return getAnswersByQuestionSlug(slug);
}

export default async function AnswerList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const { data: answers } = await getCachedAnswersByQuestionSlug(slug);

  return (
    <>
      {answers?.length === 0 ? (
        <p>No Answer</p>
      ) : (
        <div className="flex flex-col gap-5">
          {answers?.map((answer) => (
            <AnswerCard key={answer?.id} answer={answer} />
          ))}
        </div>
      )}
    </>
  );
}
