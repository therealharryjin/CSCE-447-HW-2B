# SQL Login (Part 3)

A small login backed by a SQLite database. It is used to test a SQL injection attack. The login query uses a parameterized query, so the injection does not work.

## What it does

- Shows a login form with an email field and a password field and a single "Log in" button.
- The server checks the credentials against a SQLite users table using a parameterized query.
- Because the query uses placeholders, user input is always treated as data and cannot change the query, so SQL injection is blocked.

## Requirements

- Node.js version 22.5 or newer, because it uses the built-in `node:sqlite` module. No install step is needed.

## How to run

1. Open a terminal in this folder.
2. Start the server:

   ```
   node server.js
   ```

3. Open a browser and go to:

   ```
   http://localhost:8081
   ```

## How to test the attack

1. In the email field, enter the payload `' OR 1=1--` and type anything in the password field.
2. Click "Log in". The attack fails and the message is "Login failed: invalid credentials."
3. The attack fails because the parameterized query matches the payload as a plain string instead of running it as SQL.

## The fix

The login uses a parameterized query (prepared statement) instead of building SQL by joining strings. This keeps user input as data so it can never change the structure of the query. An unsafe version that joins strings would let `' OR 1=1--` log in without a valid password.
