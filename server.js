const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Server-side validation: same rules as the client, because the client can be bypassed
function validate(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return 'Invalid input.';
  }
  if (email === '' || password === '') {
    return 'Please fill in both fields.';
  }
  if (!email.includes('@')) {
    return 'Email must contain "@".';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  return '';
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
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

      const error = validate(email, password);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (error !== '') {
        res.end(JSON.stringify({ ok: false, message: error }));
      } else {
        res.end(JSON.stringify({ ok: true, message: 'Login validated successfully.' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
