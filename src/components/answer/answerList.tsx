import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import { getAnswersByQuestionSlug } from "@/services/answer";
import React from "react";
import AnswerCard from "./answerCard";

export default async function AnswerList({ slug }: { slug: string }) {
  const answers: Array<
    Omit<Answer, "author"> & {
      author: User;
    }
  > = await getAnswersByQuestionSlug(slug);

  return (
    <>
      {answers.length === 0 ? (
        <p>No Questions</p>
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
