# Simple Login Form

A basic login page with both client-side and server-side validation. It was built for a web security assignment and mimics a typical login page such as the one in OWASP Juice Shop.

## What it does

- Shows a login form with an email field and a password field.
- Validates the input in the browser before sending anything:
  - Both fields must be filled in (no empty submissions).
  - The email must contain an "@" character.
  - The password must be at least 8 characters long.
- Sends the input to a small Node.js server that runs the same checks again. This matters because client-side checks can be bypassed, so the server must never trust the browser.
- Shows a success or error message based on the server-side result.

## Project structure

- `index.html` is the login page and the client-side validation.
- `server.js` is a small Node.js server that serves the page and performs the server-side validation.
- `README.md` is this file.

## Requirements

- Node.js installed. You can check your version by running `node --version`.

## How to run

1. Open a terminal in the project folder.
2. Start the server:

   ```
   node server.js
   ```

3. Open a browser and go to:

   ```
   http://localhost:8080
   ```

4. Enter an email and a password, then submit the form.

## Notes

This project is for educational purposes. It validates input only and does not store accounts or passwords.
