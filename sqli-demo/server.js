// SQL-backed login for Part 3 (run locally).
// The query uses parameter placeholders, so user input is always treated as
// data and SQL injection is not possible.

const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 8081;

// In-memory database seeded with one account.
const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)');
db.exec("INSERT INTO users (email, password) VALUES ('admin@juice.com', 'SuperSecret123')");

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => resolve(body));
  });
}

// SAFE: placeholders (?) keep the input as data, never as SQL.
// A payload like ' OR 1=1-- is matched as a literal string, so it cannot
// change the structure of the query.
function login(email, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
  return stmt.get(email, password);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) { res.writeHead(500); res.end('Server error'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/login') {
    const body = await readBody(req);
    let email = '';
    let password = '';
    try {
      const parsed = JSON.parse(body);
      email = parsed.email;
      password = parsed.password;
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Invalid request.' }));
      return;
    }

    const row = login(email, password);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (row) {
      res.end(JSON.stringify({ ok: true, message: 'Logged in as ' + row.email + ' (access granted)' }));
    } else {
      res.end(JSON.stringify({ ok: false, message: 'Login failed: invalid credentials.' }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('SQL login running at http://localhost:' + PORT);
});
