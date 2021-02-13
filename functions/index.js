const { render } = require('../lib/html');

exports.handler = async function (event) {
  try {
    const { t } = event.queryStringParameters;
    const target = parseDate(t);

    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html;charset=utf-8',
      },
      body: render({ target }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'content-type': 'text/plain;charset=utf-8',
      },
      body: error.message,
    };
  }
};

function parseDate(s) {
  if (!s) throw statusError(400, 'Target date missing');

  const parts = s.split(/-/);
  if (parts.length < 3) throw new statusError(400, `Invalid target: ${t}`);
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
}

function statusError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
