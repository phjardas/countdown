import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute('%RESOURCES%');

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    skipWaiting();
  }
});
