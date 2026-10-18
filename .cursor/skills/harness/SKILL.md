---
name: harness
description: >-
  Agentic harness in Cursor only: plan with Grok, wait for explicit user
  approval, then build with Composer, verify with lint/types/build plus Sonnet
  diff review. Use when the user asks to run the harness, agentic pipeline,
  plan-build-verify loop, or plan with Grok and build with Composer.
---

# Agentic harness (skill-only)

Run **plan → build → verify** inside Cursor. No CLI package—this skill is the orchestrator. The **parent agent** (you) drives phases using **Task** subagents, shell commands, and optional artifacts under `.harness/`.

## Models

| Phase  | Model                      | Subagent type                 |
| ------ | -------------------------- | ----------------------------- |
| Plan   | `grok-4.7-medium`          | `generalPurpose` or Plan mode |
| Build  | `composer-2.5`             | `generalPurpose`              |
| Review | `claude-sonnet-5-5-medium` | `generalPurpose`              |

User may override models; default to the table above.

## Run ID and artifacts

At start, pick a run id: ISO timestamp safe for paths (e.g. `2026-10-02T18-00-00`).

Create `.harness/<runId>/` and write:

- `plan.md` — output of plan phase
- `report.md` — append status after each phase and at end

`.harness/` is gitignored.

## Workflow

```mermaid
flowchart LR
  task[User task] --> planPhase[Plan Grok]
  planPhase --> planFile[plan.md]
  planFile --> planApproval[User approves plan]
  planApproval -->|rejected or iterate| planPhase
  planApproval -->|approved| buildPhase[Build Composer]
  buildPhase --> cmdVerify[pnpm lint check-types build]
  cmdVerify -->|fail| fixLoop[Composer fix]
  fixLoop --> cmdVerify
  cmdVerify -->|pass| reviewPhase[Sonnet diff review]
  reviewPhase -->|issues| fixLoop
  reviewPhase -->|approved| done[report.md summary]
```

### 0. Intake

- Restate the user task in one sentence.
- Ask for **plan-only** if they only want a plan (stop after phase 1; no build approval needed).
- Otherwise the default run is **plan → user approval → build → verify** (approval is mandatory before any product code edits).
- Default **max fix iterations**: 3 (command failures or review rejections each count as one iteration toward the same cap).

### 1. Plan (Grok)

**Goal:** Read-only exploration; produce an actionable plan. No product code edits.

Options (pick one):

- **Recommended:** Spawn a Task subagent with `model: grok-4.7-medium`, thoroughness `medium`, prompt: explore repo, write plan to `.harness/<runId>/plan.md`, include files to touch, steps, and how to verify. Do not implement.
- **Alternative:** Switch to **Plan** mode yourself, produce the plan, save to `.harness/<runId>/plan.md`.

**Gate:** `plan.md` must be non-empty and match the user task. If plan-only, write `report.md` and summarize for the user—**stop**.

### 1b. Plan approval (required before build)

**Do not start phase 2 until the user explicitly approves the plan.**

After `plan.md` is written:

1. Present the plan summary (or point to `.harness/<runId>/plan.md` and any Cursor plan file if one was created).
2. **Stop** and wait for approval. Treat these as approval to build: e.g. “approve”, “go ahead”, “implement the plan”, “execute”, “ship it”, “LGTM”, or confirming the attached plan.
3. Treat these as **not** approval: silence, new requirements, “change the plan…”, questions only, or ambiguous “looks good but…”. Revise the plan (phase 1) and ask again.
4. Record in `report.md`: `plan_approval: pending` then `plan_approval: approved` with a short note of what the user said.

If the user rejects or requests plan changes, update `plan.md`, set `plan_approval: pending` again, and re-present—still **no build** until a clear approve.

**Exception:** User said plan-only at intake—skip this gate and never enter build.

### 2. Build (Composer)

**Prerequisite:** `plan_approval: approved` in `report.md` (or equivalent explicit user message in the same thread).

Spawn a **single** Task subagent with `model: composer-2.5` (or implement inline only after approval—prefer subagent for isolation).

Prompt must include:

- Full text of `plan.md` (or path + instruct read)
- Minimal diff; match repo conventions
- Do not edit `.harness/` except if the plan requires it

For fix iterations, **same thread is not available across Tasks**—each fix is a new Task with: original plan + `git diff` summary + failure logs or review JSON issues.

### 3. Verify (commands)

From repo root, run sequentially; stop on first failure:

```bash
pnpm lint
pnpm check-types
pnpm build
```

Capture output for fix prompts. On failure, if iterations remain, go to **Build fix** with command output; else write `report.md` and tell the user verification failed.

Skip diff review if the user asked for commands-only verification.

### 4. Review (Sonnet 5.5)

Spawn Task with `model: claude-sonnet-5-5-medium`, **read-only** (`tools` limited to read/grep if needed).

Provide:

- Full `plan.md`
- `git diff` (staged + unstaged)

Ask for **JSON only**:

```json
{ "approved": true, "issues": [] }
```

Parse `approved` and `issues`. If not approved and iterations remain, **Build fix** with issues list; else fail with report.

### 5. Done

Write `report.md`: task, models used, iterations, command results, review verdict, changed areas.

Summarize for the user: approved vs failed, key files, next steps.

## Fix prompt template (Composer Task)

```text
Implement fixes only. Original plan:
<plan.md contents>

Verification failed:
<command output OR review issues as bullets>

Keep scope minimal; do not change unrelated files.
```

## Principles

- Minimize scope; one plan, one build stream per iteration.
- Do not commit unless the user asks.
- Plan phase must not ship feature code.
- **Never build or edit product code between plan completion and explicit user approval** (unless plan-only was requested).
- Prefer subagents for plan/build/review so models match the table.

## When the user says "run harness"

1. Read this skill and execute the workflow.
2. After plan, **pause for approval** before Composer build—same expectation as Plan mode “approve plan then implement”.
3. Do not reference `pnpm harness` or `@cursor/sdk`—they are not part of this repo.
