# Browse questions

Browse questions shows the latest questions on the home page, or the text `No Questions` when the feed is empty. Opening a title shows that question.

## Sub-features

- `browse-open` shows the home feed.
- `browse-open-question` opens one question from its title.
- `browse-empty` shows `No Questions` when the feed has no rows.

## How to get to it (user POV)

- Open `http://127.0.0.1:3000/`.
- Choose the Undoubt logo in the header from any other page.

## Driving it with the Cursor browser

Preconditions:

- The user already has `http://127.0.0.1:3000/` open and the page shows `Recent Questions`.
- Do not sign in during this recipe.

- **Open the feed.** Go to `http://127.0.0.1:3000/`. The heading `Recent Questions` is visible. The page shows either a link whose name starts with `Read full question:` or the text `No Questions`.
- **Open a question.** If a `Read full question:` link is present, choose the first one. The address becomes `/question/<slug>` and the same title is on the page.
- **Empty feed.** If the text is `No Questions`, record that as the end state for `browse-empty`. Do not invent a question to make `browse-open-question` pass.
- **Proof.** Save an accessibility snapshot to `evidence/browse-questions/home.aria.txt` and a screenshot to `evidence/browse-questions/home.png`. Both show `Recent Questions`.

## Gotchas

- The feed reads the shared database. An empty feed is a real result, not a failed launch.
- `Read full question` appears only when the description is clamped. Otherwise open the title link. Its accessible name is the question title.
- A skeleton of question cards is the loading state. Wait until `Recent Questions` is accompanied by a question link or `No Questions`.
- `Ask` is a different page. Do not treat it as the home feed.
