import QuestionForm from "@/components/question/questionForm";
import { httpMethod } from "@/lib/api/request";
import { serverReq } from "@/lib/api/with-session";
import { questionEndpoints } from "@/lib/domain/endpoints";
import type { Question } from "@/lib/queries/questions";
import { getSession } from "@/lib/auth/session";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Question | Undoubt",
};

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const { response: question } = await serverReq<Question>(
    questionEndpoints.bySlug(slug),
    { method: httpMethod.get }
  );
  if (!question) notFound();
  if (question.authorId !== session.id) redirect(`/question/${slug}`);

  return (
    <QuestionForm
      question={{
        id: question.id,
        title: question.title,
        description: question.description,
        slug: question.slug,
      }}
    />
  );
}
