const fs = require('fs');
const path = require('path');

const iconIds = fs
  .readdirSync(path.resolve(__dirname))
  .filter((f) => f.endsWith('.svg'))
  .map((f) => f.replace(/\.svg$/, ''));

const icons = {};

function loadIcon(id) {
  if (id in icons) return icons[id];
  const svg = fs.readFileSync(path.resolve(__dirname, `${id}.svg`), 'utf-8');
  return (icons[id] = svg.replace('<svg', `<svg class="icon icon-pulse"`).trim());
}

module.exports = {
  iconIds,
  loadIcon,
};
