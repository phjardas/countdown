const csso = require('csso');

const style = csso.minify(`
.heart {
  width: 1em;
  height: 1em;
  color: #ff0000;
  animation: heart-pulse 1s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .heart {
    animation: none;
  }
}

@keyframes heart-pulse {
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

const img = `<svg class="heart" viewBox="0 0 32 29.6" fill="currentColor"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" /></svg>`;

module.exports = {
  id: 'h',
  style,
  img,
};