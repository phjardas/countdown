const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const etag = require('etag');
const home = require('./home');
const manifest = require('./manifest');
const { handlerResponse, fileIntegrity } = require('./integrity');

const template = promisify(fs.readFile)(path.resolve(__dirname, 'sw.tpl.js'), 'utf-8');

module.exports = async (params) => {
  const urls = await Promise.all([
    hashedResponse('.', home, params),
    hashedResponse('./manifest.json', manifest, params),
    hashedFile(`i/${params.icon.id}/android-chrome.png`),
    hashedFile(`i/${params.icon.id}/favicon-16x16.png`),
    hashedFile(`i/${params.icon.id}/favicon-32x32.png`),
  ]);

  const body = (await template).replace('"%RESOURCES%"', JSON.stringify(urls));

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/javascript;charset=utf-8',
      'content-length': Buffer.byteLength(body, 'utf-8'),
      //'cache-control': 'public, max-age=604800',
      etag: etag(body),
    },
    body: body,
  };
};

async function hashedResponse(url, handler, params) {
  const { revision, integrity } = await handlerResponse(handler, params);
  return { url, revision, integrity };
}

async function hashedFile(filename) {
  const url = `/${filename}`;
  const { revision, integrity } = await fileIntegrity(url);
  return { url, revision, integrity };
}
