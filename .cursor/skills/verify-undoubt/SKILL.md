---
name: verify-undoubt
description: "Drive the Undoubt web app in a browser and prove a user-facing feature. Use when a change touches the home feed, search, sign-in, asking a question, or the about page, and the proof has to be what a visitor sees."
---

# Verify Undoubt

Undoubt is a Next.js question-and-answer site. The primary surface is the web UI at `http://127.0.0.1:3000`. Server actions and the Postgres database sit behind that UI. There is no Playwright or Cypress harness in the repo. Drive the UI with the Cursor browser tools, using the accessible names in the feature map.

`pnpm dev` uses the shared `DATABASE_URI`, and port 3000 is one listener. Do not start a server for verification.

## Launch

The launch script has been removed. Do not run `pnpm dev`, and do not start or stop any process for verification. Drive the site only when the user already has it open at `http://127.0.0.1:3000/` and the home page shows `Recent Questions`. If it is not open, stop and say so.

## Drive

Open `http://127.0.0.1:3000/` in the Cursor browser. Prefer role and accessible name over coordinates. The feature files under `features/` are the recipes. Start from the baseline in `features/README.md`. Drive the entry point the file names. A path you could not reach is a failed proof, not a pass by another route.

Stable handles:

- Home heading text `Recent Questions`
- Question link accessible name `Read full question: <title>`
- Empty feed text `No Questions`
- Search button accessible name `Search questions` below `md`, `Search` from `md` up to below `lg`, and `Search Ctrl K` at `lg` and wider
- Search dialog name `Search`
- Search box placeholder `Got a doubt? Just search it`
- Header links `Ask` and `About` inside the nav named `Find and ask`
- Account nav named `Account`, with links `Login` and `Sign up` when signed out
- Login textboxes `Email` and `Password`, buttons `Login` and `Explore as Guest`, link `Forgot Password?`

## Evidence

Write proof under `.cursor/skills/verify-undoubt/evidence/<feature-id>/`. Keep the action and the state it produced. For a UI proof, save an accessibility snapshot and a screenshot that shows the Undoubt page, plus the feature id and the entry point. For a mutation, also confirm the result from a second view (reload the page, or open the question from the home feed). Do not prove a feature by calling a server action or writing a row directly.

Sign-in, ask, edit, and delete change the shared database. Search and the home feed read it. Guest sign-in uses the guest account the app already has. Do not create a new user during verification.

## Cleanup

Do not kill a process. There is no pid file and no helper script.
