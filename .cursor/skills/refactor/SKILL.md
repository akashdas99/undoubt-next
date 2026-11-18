---
name: refactor
description: "Refactor by deleting duplicate code, placing each feature in one folder, reading the docs of libraries already in use, and keeping the result SOLID and KISS. Use when the user asks to refactor, dedupe, simplify, extract, or restructure a feature."
---

# Refactor

Behavior stays the same. Structure gets smaller and easier to follow.

## Read the library first

Before adding state, a flag, or a helper, read the docs for every package the file already imports. Use the value or method the library already returns.

`useForm` from react-hook-form exposes `formState.isSubmitting` for the whole submit, including the time spent in `onSubmit`. A local `loading` or `isPending` flag that flips around the same submit duplicates that. Bind the button to `isSubmitting` and delete the flag.

Do the same check for any other library in the change. Next.js docs live in `apps/web/node_modules/next/dist/docs/`. Other package docs live in that package's `node_modules` entry or its published docs. Prefer the documented API over a hand-rolled equivalent.

## Order

1. Find the repeated behavior. Import the existing function. Extend it when the new case is the same behavior with a different input.
2. Delete the copies in the same change. Leave no second path that does the same work.
3. Keep the shared function free of one caller's redirect, cache, or UI. Pass that work in as an optional callback when callers differ.
4. Stop when a further extract would add a file that only one caller uses.

Copy logic only when the two paths are different and sharing them would couple unrelated callers.

## One folder per feature

A feature's components, helpers, and types live in one folder named for that feature. A file that only that feature uses stays in that folder. A function two features call moves to the shared module they both already import.

One component per file. A skeleton that only represents that component may stay beside it in its own file.

## SOLID

- **Single responsibility.** A module does one job. `postAuthForm` posts and maps field errors. The form decides what happens after success.
- **Open/closed.** Add a new caller by passing data or a callback. Do not add a branch inside the shared function for one screen.
- **Liskov.** A substitute accepts the same inputs and keeps the same success and failure outcomes.
- **Interface segregation.** Take the smallest argument list that callers need. Make a callback optional when some callers have no extra success work.
- **Dependency inversion.** The shared function receives router, cache, or UI work from the caller. It does not import those itself.

## KISS

Prefer the shorter call over a new wrapper, layer, or config object. Three repeated lines at two call sites can stay at the call sites when extracting them hides a sequence the reader needs to see. A boolean return that every caller checks is a branch to delete. Put the success work in the callback and return nothing.
