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

`QuestionsService.vote` in `apps/api/src/questions/questions.service.ts` runs one transaction:

1. `SELECT ... FROM question_stats WHERE question_id = ? FOR UPDATE` locks that question's stats row.
2. It reads this user's current `question_votes.vote`, if any.
3. It inserts, updates, or deletes that vote only when the value changes. Repeating the same vote returns before either write.
4. It sets `likes = likes + delta` and `dislikes = dislikes + delta` on the locked stats row. A new like is `+1` like. A like changed to a dislike is `-1` like and `+1` dislike. A remove subtracts the previous side.

The stored total comes from the current stats row. The old count-snapshot finding does not describe this function. The unique key still keeps one vote row per user.

Logged-out callers are rejected by `SessionGuard`. A missing question returns before the transaction.

## Coverage

- `apps/api/src/questions/questions.service.ts`: `vote`, `voteDelta`
- `packages/db/src/schema/questionVotes.ts`: `userQuestionUnique`

Last read with the delta update in the working tree. A change to `vote` or `voteDelta` means this note may no longer describe the code.

## Recorded finding

The count-snapshot loss (two concurrent likes each storing 1) applied to `recomputeStats`. That function is gone. This delta path was not measured in PostgreSQL. A crash after the vote write and before the stats update can still leave the row and the total apart, because they are two statements in one transaction. PostgreSQL rolls both back if the transaction does not commit.

## When the code changes

Read the new statements. If a vote write and the stats write can still separate, the finding still applies. Putting both writes in one statement does not clear it: a total recomputed from a statement snapshot can still miss a concurrent vote. The finding no longer describes the code only when the stored total is taken from the current stats row. Update this note only after reading the new functions.
