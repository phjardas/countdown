const { parseParams } = require('./params');
const handle = require('./handle');

exports.handler = async function handler(event) {
  const parts = event.path
    .replace(/.*\/r\//, '')
    .split('/')
    .filter((s) => s.length);
  const params = parseParams(parts[0]);
  const type = parts.length > 1 ? parts[1] : '';
  return handle(type, params);
};
