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
    const event = { path: `/.netlify/functions${url.pathname.replace(renderPrefix, '/render/')}` };
    const response = await render(event);
    res.writeHead(response.statusCode, response.headers);
    res.end(response.body);
  } else {
    staticServer.serve(req, res);
  }
});

server.listen(port);
