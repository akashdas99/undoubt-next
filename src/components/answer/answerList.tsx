import { unstable_cache } from "next/cache";
import AnswerCard from "./answerCard";
import { getAnswersByQuestionSlug } from "@/data/answer";

const getCachedAnswersByQuestionSlug = (slug: string) =>
  unstable_cache(
    async () => getAnswersByQuestionSlug(slug),
    [`answersByQuestionSlug:${slug}`],
    {
      tags: [`answersByQuestionSlug:${slug}`],
      revalidate: 600,
    }
  );
export default async function AnswerList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const getAnswers = getCachedAnswersByQuestionSlug(slug);

  const { data: answers } = await getAnswers();

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
