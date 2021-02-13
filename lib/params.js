const icons = require('./icons');

module.exports.parseParams = function parseParams({ path }) {
  const s = path.replace(/.*\/([^/]+)$/, '$1');
  const params = parse(s);

  return {
    s,
    target: parseDate(params.t),
    title: params.l || 'Countdown',
    icon: parseIcon(params.i),
    primary: `#${params.p || 'ff0000'}`,
  };
};

function parse(s) {
  if (!s) throw statusError(400, 'Missing configuration');
  try {
    return JSON.parse(Buffer.from(s.replaceAll('-', '+').replaceAll('/', '_'), 'base64').toString('ascii'));
  } catch (error) {
    throw statusError(400, `Invalid configuration: ${s}`);
  }
}

function parseDate(s) {
  if (!s) throw statusError(400, 'Target date missing');
  const parts = s.split(/-/);
  if (parts.length < 3) throw new statusError(400, `Invalid target: ${s}`);
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    date: parseInt(parts[2], 10),
  };
}

function parseIcon(id = 'h') {
  const icon = icons[id];
  if (!icon) throw statusError(400, `Invalid icon: ${id}`);
  return icon;
}

function statusError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
