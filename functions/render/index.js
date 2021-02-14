const { parseParams } = require('./params');
const renderers = {
  'index.html': require('./home'),
  'manifest.json': require('./manifest'),
  'sw.js': require('./sw'),
};

exports.handler = async (event) => {
  try {
    const parts = event.path
      .replace(/.*\/r\//, '')
      .split('/')
      .filter((s) => s.length);
    const params = parseParams(parts[0]);
    const type = parts.length > 1 ? parts[1] : 'index.html';
    const renderer = renderers[type];
    return renderer ? renderer(params) : { statusCode: 404 };
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
