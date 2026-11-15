# Sign in

Sign in lets a visitor enter an email and password, or continue as the guest account, and land on the home feed signed in.

## Sub-features

- `sign-in-open` shows the login form.
- `sign-in-guest` enters with `Explore as Guest` when the app has a guest account.
- `sign-in-reject` keeps the visitor on the form when the password is wrong.

## How to get to it (user POV)

- Choose `Login` in the header when signed out.
- Open `http://127.0.0.1:3000/login`.
- Choose `Ask` or open `/profile` while signed out. Both send the visitor to `/login`.

## Driving it with the Cursor browser

Preconditions:

- The user already has `http://127.0.0.1:3000/` open.
- The account nav shows `Login`. If it shows a profile menu, the browser is already signed in. Stop and report that precondition.

- **Open the form.** Go to `http://127.0.0.1:3000/login`. The heading `Welcome Back` is visible, with textboxes `Email` and `Password`, and buttons `Login` and `Explore as Guest`.
- **Reject a bad password.** Fill `Email` with `verify-not-a-user@example.com` and `Password` with `wrong-password`, then choose `Login`. The page stays on `/login` and shows an error.
- **Guest entry.** Choose `Explore as Guest`. The address becomes `/` and the account nav no longer shows `Login`. If the button does nothing, the guest account is not configured. Record that as a failed `sign-in-guest` and do not type a password from outside the app.
- **Proof.** Save an accessibility snapshot to `evidence/sign-in/after.aria.txt` and a screenshot to `evidence/sign-in/after.png`.

## Gotchas

- Guest sign-in writes a session cookie in this browser and uses the shared user row. Do not register a new account.
- `/question` and `/profile` are the only routes the proxy sends to login. A question page is public.
- Wrong-password proof is the error on the login page, not a home feed.
