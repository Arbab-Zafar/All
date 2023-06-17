const http = require('http');
const fs = require('fs')

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('Hello World');
  if (req.url == "/") {
    res.statusCode = 200;
    const data = fs.readFileSync('index.html')
    res.end(data.toString());
  }
  else if (req.url == "/transactions") {
    res.statusCode = 200;
    const data = fs.readFileSync('transactions.html')
    res.end(data.toString());
  }
  else {
    res.statusCode = 404;
    res.end('Page Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});