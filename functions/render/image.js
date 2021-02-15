const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const colorConvert = require('color-convert');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = {
  'android-chrome.png': imageRenderer({ type: 'image/png', size: 1024, iconFactor: 0.65, background: 0xffffffff }),
  'apple-touch-icon.png': imageRenderer({ type: 'image/png', size: 180, iconFactor: 0.8, background: 0xffffffff }),
  'favicon-16x16.png': imageRenderer({ type: 'image/png', size: 16 }),
  'favicon-32x32.png': imageRenderer({ type: 'image/png', size: 32 }),
};

function imageRenderer({ size, type, iconFactor = 1, background = 0x00000000 }) {
  return async (params) => {
    const icon = await Jimp.read(path.resolve(__dirname, `icons/${params.icon.id}/${params.icon.id}.png`));
    const primary = colorConvert.hex.rgb(params.primary);

    const data = await new Promise(
      (resolve, reject) =>
        new Jimp(size, size, background, (err, image) => {
          if (err) return reject(err);
          icon.color([
            { apply: 'red', params: [primary[0]] },
            { apply: 'green', params: [primary[1]] },
            { apply: 'blue', params: [primary[2]] },
          ]);
          icon.contain(size * iconFactor, size * iconFactor);
          image.composite(icon, (size * (1 - iconFactor)) / 2, (size * (1 - iconFactor)) / 2);
          image.getBuffer(type, (e, b) => (e ? reject(e) : resolve(b)));
        })
    );

    return {
      statusCode: 200,
      headers: {
        'content-type': type,
        'content-length': Buffer.byteLength(data),
      },
      isBase64Encoded: true,
      body: data.toString('base64'),
    };
  };
}
