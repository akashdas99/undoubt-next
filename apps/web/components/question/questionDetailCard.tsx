import { apiRequest, httpMethod } from "@/lib/api/request";
import { cacheTags } from "@/lib/cache/tags";
import { questionEndpoints } from "@/lib/domain/endpoints";
import type { QuestionContent } from "@/lib/queries/questions";
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

  const { response: question } = await apiRequest<QuestionContent>(
    questionEndpoints.content(slug),
    { method: httpMethod.get }
  );
  if (!question) notFound();

  return (
    <Card size="sm" className="relative">
      <QuestionCardHeader question={question} />
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
