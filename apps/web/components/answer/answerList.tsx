import { cacheTag } from "next/cache";
import AnswerCard from "./answerCard";
import { getAnswersByQuestionSlug } from "@/data/answer";

async function getCachedAnswersByQuestionSlug(slug: string) {
  "use cache";
  cacheTag(`answersByQuestionSlug:${slug}`);
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
