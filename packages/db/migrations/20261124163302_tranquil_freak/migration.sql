CREATE TABLE "user_stats" (
	"user_id" uuid PRIMARY KEY,
	"question_count" integer DEFAULT 0 NOT NULL,
	"answer_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "user_stats_counts_non_negative" CHECK ("question_count" >= 0 AND "answer_count" >= 0)
);
--> statement-breakpoint
CREATE INDEX "user_stats_contribution_idx" ON "user_stats" USING btree (("question_count" + "answer_count"));--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
--> statement-breakpoint
INSERT INTO user_stats (user_id, question_count, answer_count)
SELECT u.id,
  (SELECT COUNT(*)::int FROM questions q WHERE q.author_id = u.id),
  (SELECT COUNT(*)::int FROM answers a WHERE a.author_id = u.id)
FROM users u
ON CONFLICT (user_id) DO NOTHING;