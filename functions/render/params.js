const icons = require('./icons');

module.exports.parseParams = function parseParams(s, query) {
  if (!s) throw statusError(400, 'Missing configuration');

  try {
    const params = parse(s);

    return {
      s,
      target: parseDate(params.t),
      title: params.l || 'Countdown',
      icon: parseIcon(params.i),
      primary: `#${params.p || 'ff0000'}`,
      preview: 'p' in query,
    };
  } catch (error) {
    throw statusError(400, `Invalid configuration '${s}': ${error.message}`);
  }
};

function parse(s) {
  const json = Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('ascii');
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`Could not parse JSON '${json}'`);
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
