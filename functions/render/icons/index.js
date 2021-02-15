module.exports = [require('./h')].reduce((a, b) => ({ ...a, [b.id]: b }), {});
