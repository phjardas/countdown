const ssri = require('ssri');
const assets = require('./assets');

async function handlerResponse(handler, params) {
  const data = (await handler(params)).body;
  const sri = ssri.fromData(data);
  return { data, integrity: sri.toString() };
}

async function fileIntegrity(filename) {
  if (!(filename in assets)) throw new Error(`Unknown asset: ${filename}`);
  return assets[filename];
}

module.exports = { handlerResponse, fileIntegrity };
