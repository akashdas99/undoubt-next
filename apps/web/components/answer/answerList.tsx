import { apiRequest, httpMethod } from "@/lib/api/request";
import { answerEndpoints } from "@/lib/domain/endpoints";
import AnswerCard from "./answerCard";

export default async function AnswerList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const { response: list } = await apiRequest<{
    data: Array<{
      id: string;
      description: string;
      authorId: string;
      questionId: string;
      createdAt: Date | string;
      updatedAt: Date | string;
      author: { name: string; profilePicture: string | null };
    }>;
  }>(answerEndpoints.list(slug), { method: httpMethod.get });
  const answers = list?.data;

  return (
    <>
      {answers?.length === 0 ? (
        <p>No Answer</p>
      ) : (
        <div className="flex flex-col gap-md">
          {answers?.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={{
                ...answer,
                createdAt: new Date(answer.createdAt),
                updatedAt: new Date(answer.updatedAt),
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
