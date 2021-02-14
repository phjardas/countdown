import { Workbox, messageSW } from 'workbox-window';

function renderDuration(ms) {
  let remaining = Math.floor(ms / 1000);
  const weeks = Math.floor(remaining / 3600 / 24 / 7);
  remaining -= weeks * 3600 * 24 * 7;
  const days = Math.floor(remaining / 3600 / 24);
  remaining -= days * 3600 * 24;
  const hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  const minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;
  const seconds = remaining;

  return [
    weeks && [weeks, `Woche${weeks === 1 ? '' : 'n'}`],
    days && [days, `Tag${days === 1 ? '' : 'e'}`],
    hours && [hours, `Stunde${hours === 1 ? '' : 'n'}`],
    minutes && [minutes, `Minute${minutes === 1 ? '' : 'n'}`],
    seconds && [seconds, `Sekunde${seconds === 1 ? '' : 'n'}`],
  ].filter(Boolean);
}

// FIXME timezone
function createNow() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

function getRemainingTime({ target, now }) {
  const nowDate = new Date(now.year, now.month - 1, now.date, now.hour || 0, now.minute || 0, now.second || 0);
  const targetDate = new Date(target.year, target.month - 1, target.date, target.hour || 0, target.minute || 0, target.second || 0);
  return targetDate.getTime() - nowDate.getTime();
}

document.addEventListener('DOMContentLoaded', () => {
  const target = window.__calendar.target;
  const div = document.getElementById('remaining');

  function update() {
    const now = createNow();
    const remaining = getRemainingTime({ target, now });
    const duration = renderDuration(remaining);
    const html = 'Noch ' + duration.map((d) => d.join(' ')).join(' ');
    div.innerHTML = html;
  }

  setInterval(update, 1000);
  update();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const wb = new Workbox('/r/' + __calendar.s + '/sw.js');
    let registration;
    const reload = () => {
      wb.addEventListener('controlling', () => window.location.reload());

      if (registration && registration.waiting) {
        messageSW(registration.waiting, { type: 'SKIP_WAITING' });
      }
    };
    wb.addEventListener('waiting', reload);
    wb.addEventListener('externalwaiting', reload);
    wb.register().then((reg) => (registration = reg));
  });
}
