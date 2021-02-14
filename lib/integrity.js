const fs = require('fs');
const path = require('path');
const ssri = require('ssri');

async function handlerResponse(handler, params) {
  const data = (await handler(params)).body;
  const sri = ssri.fromData(data);
  return { data, integrity: sri.toString() };
}

const basedir = path.resolve(__dirname, '..');
const fileIntegrityCache = {};

async function fileIntegrity(filename) {
  if (filename in fileIntegrityCache) return fileIntegrityCache[filename];
  const sri = await ssri.fromStream(fs.createReadStream(path.resolve(basedir, filename)));
  const integrity = (fileIntegrityCache[filename] = sri.toString());
  return integrity;
}

module.exports = { handlerResponse, fileIntegrity };
