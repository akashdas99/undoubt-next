import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import { getAnswersByQuestionSlug } from "@/services/answer";
import { unstable_cache } from "next/cache";
import AnswerCard from "./answerCard";

const getCachedAnswersByQuestionSlug = (slug: string) =>
  unstable_cache(
    async () => getAnswersByQuestionSlug(slug),
    [`answersByQuestionSlug:${slug}`],
    {
      tags: [`answersByQuestionSlug:${slug}`],
      revalidate: 600,
    }
  );
/**
 * Render a list of answers for the provided question slug.
 *
 * @param params - A promise that resolves to an object with a `slug` string identifying the question
 * @returns A React fragment that contains either a paragraph with "No Answer" when there are no answers, or a vertically spaced list of `AnswerCard` components—one for each answer
 */
export default async function AnswerList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const getAnswers: () => Promise<
    Array<
      Omit<Answer, "author"> & {
        author: User;
      }
    >
  > = getCachedAnswersByQuestionSlug(slug);

  const answers = await getAnswers();

  return (
    <>
      {answers.length === 0 ? (
        <p>No Answer</p>
      ) : (
        <div className="flex flex-col gap-5">
          {answers?.map((answer) => (
            <AnswerCard key={answer?._id?.toString()} answer={answer} />
          ))}
        </div>
      )}
    </>
  );
}
