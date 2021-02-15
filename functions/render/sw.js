const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const etag = require('etag');

const template = promisify(fs.readFile)(path.resolve(__dirname, 'sw.tpl.js'), 'utf-8');

async function sw(params, handle) {
  const urls = JSON.stringify(
    await Promise.all([
      hashedResponse('', handle, params),
      hashedResponse('manifest.json', handle, params),
      hashedResponse(`android-chrome.png`, handle, params),
      hashedResponse(`favicon-16x16.png`, handle, params),
      hashedResponse(`favicon-32x32.png`, handle, params),
    ])
  );

  const body = (await template).replace('"%RESOURCES%"', urls).replace("'%RESOURCES%'", urls);

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/javascript;charset=utf-8',
      'content-length': Buffer.byteLength(body, 'utf-8'),
      'cache-control': 'public, max-age=604800',
      etag: etag(body),
    },
    body: body,
  };
}

async function noop() {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/javascript;charset=utf-8',
      'content-length': 0,
    },
    body: '',
  };
}

async function hashedResponse(type, handle, params) {
  const data = (await handle(type, params)).body;
  const revision = crypto.createHash('md5').update(data).digest('hex');
  return { url: `./${type}`, revision };
}

module.exports = process.env.NODE_ENV === 'production' ? sw : noop;
