module.exports = [require('./h'), require('./s')].reduce((a, b) => ({ ...a, [b.id]: b }), {});
