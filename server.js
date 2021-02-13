const http = require('http');
const querystring = require('querystring');
const { serve } = require('./lib/html');

const port = 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === '/') {
    const params = querystring.decode(url.search.substring(1));
    serve(params).then((response) => {
      if (response.headers) {
        Object.keys(response.headers).forEach((header) => res.setHeader(header, response.headers[header]));
      }
      res.writeHead(response.statusCode);
      res.end(response.body);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port);
