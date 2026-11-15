---
name: verify-question-vote
description: "Recorded finding on Undoubt question vote totals. Use when a change touches voteOnQuestion, recomputeStats, or the question_votes unique key, or when asked whether like and dislike totals match the vote rows."
---

# Verify question votes

A question's like and dislike totals are a promise to everyone who reads it. This note records one way those totals can disagree with the vote rows. The TLA+ model and its config have been removed. Do not recreate `QuestionVote.tla`, `QuestionVote.cfg`, or `check.mjs`, and do not download TLC, unless the user asks.

## Property

After every open vote transaction has committed, `question_stats.likes` equals the number of `question_votes` rows with `vote = 1`, and `dislikes` equals the number with `vote = -1`. Each user still has at most one vote value.

Harm: readers see the wrong total, and a later vote can preserve that wrong total.

## What the code does

`voteOnQuestion` in `apps/web/data/questionVote.ts` does two statements inside `db.transaction`:

1. Insert, update, or delete that user's `question_votes` row (`onConflictDoUpdate` on `userId, questionId`, or the delete in the remove branch).
2. `recomputeStats` writes `likes` and `dislikes` from `SELECT COUNT(*)` of that question's rows.

The count sees the user's own new vote and only votes that other transactions have already committed. Commit then stores that count. The count query does not read the stats row, so a stats-row lock wait does not recompute it.

Logged-out callers and a missing question return before either statement. They do not change votes or totals.

## Coverage

- `apps/web/data/questionVote.ts`: `voteOnQuestion`, `recomputeStats`
- `apps/web/db/schema/questionVotes.ts`: `userQuestionUnique`

Last read at commit `09776611625ffc6f3e8b6c7884cdfac92ca75d3c`. A change to `voteOnQuestion` or `recomputeStats` means this note may no longer describe the code.

## Recorded finding

Ada and Kai both like the same question before either transaction commits. Each count sees one like, because the other's vote is not committed yet. Ada's transaction commits and stores 1 like. Kai's transaction commits and stores 1 like. Two like rows exist, and the question shows 1 like.

The same shape applies to dislike, and to a like racing a remove.

This note does not cover three or more users, two questions, a crash between the two statements, or a measurement of PostgreSQL. It describes the two statement snapshots above. The unique key still keeps one vote row per user. This finding was not measured in the database.

## When the code changes

Read the new statements. If a vote write and the stats write can still separate, the finding still applies. If the product stores totals in the same statement as the vote write, the finding no longer describes the code. Update this note only after reading the new functions.
