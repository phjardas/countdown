const { parseParams } = require('../lib/params');

exports.handler = async (event) => {
  try {
    const params = parseParams(event);
    const manifest = {
      name: params.title,
      short_name: params.title,
      icons: [
        {
          src: `/i/${params.icon.id}/android-chrome.png`,
          sizes: '1024x1024',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
      lang: 'de',
      start_url: `/s/${params.s}`,
      theme_color: params.primary,
      background_color: '#ffffff',
      display: 'standalone',
    };

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application.json;charset=utf-8',
      },
      body: JSON.stringify(manifest),
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
