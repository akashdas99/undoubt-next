import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import { getAnswersByQuestionSlug } from "@/services/answer";
import React from "react";
import AnswerCard from "./answerCard";
import { unstable_cache } from "next/cache";
import { getUser } from "@/services/user";

const getCachedAnswersByQuestionSlug = (slug: string) =>
  unstable_cache(
    async () => getAnswersByQuestionSlug(slug),
    [`answersByQuestionSlug:${slug}`],
    {
      tags: [`answersByQuestionSlug:${slug}`],
      revalidate: 600,
    }
  );
export default async function AnswerList({ slug }: { slug: string }) {
  const getAnswers = getCachedAnswersByQuestionSlug(slug);
  const answers: Array<
    Omit<Answer, "author"> & {
      author: User;
    }
  > = await getAnswers();
  const data: User = await getUser();

  return (
    <>
      {answers.length === 0 ? (
        <p>No Answer</p>
      ) : (
        <div className="flex flex-col gap-5">
          {answers?.map((answer) => (
            <AnswerCard
              key={answer?._id?.toString()}
              answer={answer}
              isAuthor={
                data?._id?.toString() === answer?.author?._id?.toString()
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
