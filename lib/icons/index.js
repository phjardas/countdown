module.exports = [require('./heart')].reduce((a, b) => ({ ...a, [b.id]: b }), {});
