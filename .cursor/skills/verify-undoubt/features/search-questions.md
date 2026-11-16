# Search questions

Search questions opens a dialog, takes a phrase, and lists matching question titles or says that nothing matched.

## Sub-features

- `search-open` opens the search dialog.
- `search-type` shows the prompt before a phrase is debounced.
- `search-empty` shows `No results for your search.` when the phrase matches nothing.

## How to get to it (user POV)

- Choose the `Search` button in the header on a wide window.
- Choose the icon button named `Search questions` on a narrow window.
- Press `Ctrl+K` while the page is focused.

## Driving it with the Cursor browser

Preconditions:

- The user already has `http://127.0.0.1:3000/` open.
- Start from `http://127.0.0.1:3000/`.

- **Open search.** Choose `Search` or `Search questions`. A dialog named `Search` appears.
- **See the prompt.** Before typing, the dialog shows `Type something to begin your search.`
- **Search with no match.** Type `zzzz-verify-no-match` into the box whose placeholder is `Got a doubt? Just search it`. After the short pause, the dialog shows `No results for your search.`
- **Proof.** Save an accessibility snapshot to `evidence/search-questions/empty.aria.txt` and a screenshot to `evidence/search-questions/empty.png`. Both show that empty sentence.

## Gotchas

- The result list waits about 300ms after the last keystroke. A snapshot taken during that pause can still show the prompt or a spinner.
- The wide and narrow triggers are different buttons. Use the one that is visible. Do not report the hidden one as a failure.
- Matching titles come from the shared database. This recipe uses a phrase that should match nothing so it does not depend on a particular question.
