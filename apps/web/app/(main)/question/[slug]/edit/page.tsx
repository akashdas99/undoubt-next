import QuestionForm from "@/components/question/questionForm";
import { getQuestionBySlug } from "@/data/question";
import { getSession } from "@/lib/session";
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

  const question = await getQuestionBySlug(slug);
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
