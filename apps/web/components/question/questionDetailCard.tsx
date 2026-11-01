import { getQuestionContentBySlug } from "@/data/question";
import { cacheTags } from "@/lib/cache/tags";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import TextEditorContent from "../ui/textEditorContent";
import { QuestionCardHeader } from "./questionCardHeader";

export default async function QuestionDetailCard({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  "use cache";
  cacheTag(cacheTags.questions.content(slug));
  cacheLife("days");

  const question = await getQuestionContentBySlug(slug);
  if (!question) notFound();

  const headerQuestion = {
    id: question.id,
    authorId: question.authorId,
    slug: question.slug,
    author: question.author,
    createdAt:
      question.createdAt instanceof Date
        ? question.createdAt.toISOString()
        : question.createdAt,
  };

  return (
    <Card size="sm" className="relative border border-border/60">
      <QuestionCardHeader question={headerQuestion} />
      <CardContent>
        <div className="space-y-xs">
          <div className="text-lg leading-tight font-semibold">
            {question.title}
          </div>
          {question.description && (
            <TextEditorContent
              content={question.description}
              className="text-sm leading-5 text-muted-foreground"
            />
          )}
        </div>
      </CardContent>
      {children}
    </Card>
  );
}
