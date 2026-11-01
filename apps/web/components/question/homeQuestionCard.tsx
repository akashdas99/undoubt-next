"use client";

import { useIsClamped } from "@/hooks/useIsClamped";
import { Question } from "@/lib/queries/questions";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import TextEditorContent from "../ui/textEditorContent";
import { QuestionCardFooter } from "./questionCardFooter";
import { QuestionCardHeader } from "./questionCardHeader";
import QuestionVoteButton from "./questionVoteButton";

function getFirstImage(html?: string) {
  return html?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

function HomeQuestionCard({ question }: { question: Question }) {
  const href = `/question/${question.slug}`;
  const { ref: descRef, isClamped } = useIsClamped<HTMLDivElement>(true);
  const thumbnail = getFirstImage(question.description);

  return (
    <Card size="sm" className="relative border border-border/60">
      <QuestionCardHeader question={question} />
      <CardContent>
        <div className="flex items-start gap-md">
          <div className="min-w-0 flex-1 space-y-xs">
            <div className="text-lg leading-tight font-semibold">
              <Link
                href={href}
                className="line-clamp-2 outline-none after:absolute after:inset-0 after:content-['']"
              >
                {question.title}
              </Link>
            </div>
            {question.description && (
              <div className="pointer-events-none relative [&_a]:pointer-events-auto">
                <div
                  ref={descRef}
                  className="line-clamp-2 text-sm text-muted-foreground"
                >
                  <TextEditorContent
                    content={question.description}
                    className="text-sm leading-5 [&_*]:mt-0 [&_*]:leading-5"
                  />
                </div>
                {isClamped && (
                  <Link
                    href={href}
                    aria-label={`Read full question: ${question.title}`}
                    className="group/more pointer-events-auto relative z-10 mt-xxs inline-flex items-center gap-xxs rounded-sm text-xs font-medium text-primary outline-none hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Read full question
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover/more:translate-x-xxs"
                    />
                  </Link>
                )}
              </div>
            )}
          </div>
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              className="size-3xl shrink-0 rounded-sm object-cover"
            />
          )}
        </div>
      </CardContent>
      <QuestionCardFooter
        question={question}
        showShare
        renderVote={() => (
          <QuestionVoteButton
            questionId={question.id}
            likes={question.likes ?? 0}
            dislikes={question.dislikes ?? 0}
            userVote={question.userVote}
          />
        )}
      />
    </Card>
  );
}

const MemoHomeQuestionCard = React.memo(HomeQuestionCard);

MemoHomeQuestionCard.displayName = "HomeQuestionCard";

export default MemoHomeQuestionCard;
