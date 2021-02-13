const pug = require("pug");
const { getDaysOfMonth, getDayOfWeek } = require("../lib/date-utils");

exports.handler = async function (event) {
  try {
    const { t } = event.queryStringParameters;
    const target = parseDate(t);
    const now = createNow();
    const months = getMonths(target, now);

    return {
      statusCode: 200,
      headers: {
        "content-type": "text/html;charset=utf-8",
      },
      body: template({ target, now, months, styles }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        "content-type": "text/plain;charset=utf-8",
      },
      body: error.message,
    };
  }
};

function parseDate(s) {
  if (!s) throw statusError(400, "Target date missing");

  const parts = s.split(/-/);
  if (parts.length < 3) throw new statusError(400, `Invalid target: ${t}`);
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
}

// FIXME timezone
function createNow() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDaysOfMonth(),
  };
}

function getMonths(target, now) {
  return Array.from(Array(target.month).keys())
    .slice(now.month - 1)
    .map((month) => {
      const days = getDaysOfMonth(month);
      const max = days[days.length - 1];
      const padStart = getDayOfWeek(target.year, month, days[0]);
      const weeks = [[...Array(padStart), ...days.slice(0, 7 - padStart)]];

      for (let day = 7 - padStart; day < max; day += 7) {
        const week = days.slice(day, day + 7);
        if (week.length < 7) week.push(...Array(7 - week.length));
        weeks.push(week);
      }

      return { month, weeks };
    });
}

function statusError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  --color: #444;
  --muted: #ccc;
  --bg: white;
}

html,
body {
  height: 100%;
  min-height: 100%;
}

body {
  color: var(--color);
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

.page {
  margin: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}


/* dark theme */
@media (prefers-color-scheme: dark) {
  html {
    --color: #ccc;
    --muted: #666;
    --bg: radial-gradient(#2d4053, #26323d);
  }
}

/* responsive */
@media (min-width: 600px) {
  .page {
    margin: 4rem auto;
    width: calc(600px - 4rem);
  }
}
`;

const template = pug.compile(`
doctype html
style= styles
title Countdown
.page
  h1 Countdown
  pre= JSON.stringify({target,now,months}, null, 2)
`);
