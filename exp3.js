const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && req.url === '/api/get-data') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "GET request received successfully!" }));
  } else if (req.method === 'POST' && req.url === '/api/post-data') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.statusCode = 201; // Created
        res.end(JSON.stringify({ 
          message: "POST request received successfully!", 
          receivedData: data 
        }));
      } catch (error) {
        res.statusCode = 400; // Bad Request
        res.end(JSON.stringify({ message: "Invalid JSON format" }));
      }
    });
  } else {
    res.statusCode = 404; // Not Found
    res.end(JSON.stringify({ message: "Endpoint not found" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});