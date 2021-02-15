const csso = require('csso');
const fs = require('fs');
const path = require('path');

const id = 's';

const style = csso.minify(`
.icon-${id} {
  animation: icon-${id}-pulse 1s ease infinite;
}

@keyframes icon-${id}-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
`).css;

const svg = fs.readFileSync(path.resolve(__dirname, `${id}.svg`), 'utf-8');
const img = svg.replace('<svg', `<svg class="icon icon-${id}"`);

module.exports = { id, style, img };
