const handlers = {
  '': require('./home'),
  'manifest.json': require('./manifest'),
  'sw.js': require('./sw'),
  ...require('./image'),
};

async function handle(type, params) {
  try {
    const handler = handlers[type];
    return handler ? handler(params, handle) : { statusCode: 404 };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'content-type': 'text/plain;charset=utf-8',
      },
      body: error.message,
    };
  }
}

module.exports = handle;
