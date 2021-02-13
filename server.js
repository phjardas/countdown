const http = require('http');
const fs = require('fs');
const path = require('path');
const static = require('node-static');

const port = 3000;

const staticServer = new static.Server(path.resolve(__dirname, 'public'));

const handlers = fs.readdirSync(path.resolve(__dirname, 'functions')).map((s) => ({
  ...require(`./functions/${s}`),
  prefix: `/${s.replace(/\.js$/, '')}/`,
}));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const handler = handlers.find((h) => url.pathname.startsWith(h.prefix));

  if (handler) {
    const event = { path: url.pathname.replace(handler.prefix, '') };
    const response = await handler.handler(event);
    if (response.headers) {
      Object.keys(response.headers).forEach((header) => res.setHeader(header, response.headers[header]));
    }
    res.writeHead(response.statusCode);
    res.end(response.body);
  } else {
    staticServer.serve(req, res);
  }
});

server.listen(port);
