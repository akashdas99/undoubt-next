# Ask a question

Ask a question shows the question form to a signed-in visitor. A signed-out visitor who chooses `Ask` is sent to login.

## Sub-features

- `ask-signed-out` redirects to login.
- `ask-open` shows the title field to a signed-in visitor.

## How to get to it (user POV)

- Choose `Ask` in the header nav named `Find and ask`.
- Open `http://127.0.0.1:3000/question`.

## Driving it with the Cursor browser

Preconditions:

- The user already has `http://127.0.0.1:3000/` open.
- For `ask-open`, complete guest sign-in first. For `ask-signed-out`, the account nav shows `Login`.

- **Signed out.** From the home page, choose `Ask`. The address becomes `/login` and the heading `Welcome Back` is visible.
- **Signed in.** After guest sign-in, choose `Ask`. The address is `/question` and a textbox with placeholder `Please enter a title for your question` is visible.
- **Proof.** Save an accessibility snapshot to `evidence/ask-question/form-or-login.aria.txt` and a screenshot to `evidence/ask-question/form-or-login.png`. Do not submit the form. A submitted question would be stored in the shared database.

## Gotchas

- Submitting the form is not part of this recipe. There is no disposable database to delete the question from.
- The edit page for an existing question is a different form. Do not open a question's edit link and call it ask.
- `Ask` in the header is hidden in a narrow window behind `Open menu`. Use the menu entry named `Ask` there.
