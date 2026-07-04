CREATE TABLE "question_stats" (
	"question_id" uuid PRIMARY KEY NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"dislikes" integer DEFAULT 0 NOT NULL,
	"answers_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "question_stats" ADD CONSTRAINT "question_stats_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "question_stats" ("question_id", "likes", "dislikes", "answers_count")
SELECT q."id",
  COUNT(v."id") FILTER (WHERE v."vote" = 1),
  COUNT(v."id") FILTER (WHERE v."vote" = -1),
  (SELECT COUNT(*) FROM "answers" a WHERE a."question_id" = q."id")
FROM "questions" q LEFT JOIN "question_votes" v ON v."question_id" = q."id"
GROUP BY q."id"
ON CONFLICT ("question_id") DO NOTHING;