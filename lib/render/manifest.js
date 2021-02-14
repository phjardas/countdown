module.exports = async (params) => {
  const manifest = JSON.stringify({
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
    start_url: `/r/${params.s}`,
    theme_color: params.primary,
    background_color: '#ffffff',
    display: 'standalone',
  });

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'content-length': manifest.length,
    },
    body: manifest,
  };
};
