const { parseParams } = require('../lib/params');
const renderers = require('../lib/render');

exports.handler = async (event) => {
  try {
    const parts = event.path.replace(/^\/.netlify\/functions\/render\//, '').split('/');
    return { statusCode: 200, body: JSON.stringify({ parts }, null, 2) };
    const params = parseParams(parts[0]);
    const type = parts.length > 1 ? parts[1] : 'index.html';
    const renderer = renderers[type];
    if (!renderer) return { statusCode: 404 };

    return renderer(params);
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
