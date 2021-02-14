const http = require('http');
const path = require('path');
const static = require('node-static');

const port = 3000;

const staticServer = new static.Server(path.resolve(__dirname, 'public'));
const render = require('./functions/render').handler;
const renderPrefix = '/r/';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname.startsWith(renderPrefix)) {
    try {
      const event = { path: url.pathname };
      const response = await render(event);
      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(error.message);
    }
  } else {
    staticServer.serve(req, res);
  }
});

server.listen(port);
