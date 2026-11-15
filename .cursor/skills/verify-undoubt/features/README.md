# Undoubt verification map

This directory is the maintained source for verifying the user-facing behavior of Undoubt. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Use Undoubt only when the user already has it open at `http://127.0.0.1:3000/` and the home page shows `Recent Questions`.
- Do not start `pnpm dev` and do not stop a process.
- The database is the one the app is already configured to use. There is no disposable data directory.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors or screen coordinates.
- Treat every command as literal.
- Drive the browser with the Cursor browser tools.
- Do not start a second `pnpm dev`. The database and port 3000 are shared.
- Leave files under `evidence/` in place during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an accessibility snapshot and a screenshot with Undoubt visible.
- A mutation proof includes a second view after reload.
- Record the feature id and the entry point with every artifact.
- Report an unreachable path with the attempted step and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with the Cursor browser` starts with `Preconditions:` and uses labeled bullets that pair each user action with a browser step and an observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

## Features

- [Browse questions](./browse-questions.md) covers the home feed, a question title, and the empty feed.
- [Search questions](./search-questions.md) covers opening search, typing, and the empty result.
- [Sign in](./sign-in.md) covers the login form and guest entry.
- [Ask a question](./ask-question.md) covers the signed-in ask form and the signed-out redirect.
- [Read about](./read-about.md) covers the about page from the header.
