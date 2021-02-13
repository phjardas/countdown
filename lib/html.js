const pug = require('pug');
const { getCalendar } = require('./date-utils');
const styles = require('./styles');

module.exports.serve = async function serve(params) {
  try {
    const target = parseDate(params.t);

    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html;charset=utf-8',
      },
      body: render({ target }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'content-type': 'text/plain;charset=utf-8',
      },
      body: error.message,
    };
  }
};

function parseDate(s) {
  if (!s) throw statusError(400, 'Target date missing');

  const parts = s.split(/-/);
  if (parts.length < 3) throw new statusError(400, `Invalid target: ${s}`);
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    date: parseInt(parts[2], 10),
  };
}

function statusError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function render({ target, now }) {
  const calendar = getCalendar({ target, now });
  return template({ calendar, styles, getMonthName });
}

function getMonthName({ month }) {
  const names = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return names[month - 1];
}

const heart = `<svg class="heart" viewBox="0 0 32 29.6" fill="currentColor"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" /></svg>`;

const template = pug.compile(`
doctype html
meta(charset="utf-8")
title Countdown
meta(name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no")
style= styles
.page
  .remaining
    | Noch 
    each part of calendar.remaining.duration
      span.duration-part
        span.duration-part-count= part[0]
        |  #{part[1]} 
  .calendar
    each month in calendar.months
      .month
        h2.month-name
          | #{getMonthName(month)}
          if (calendar.multiYear)
            |  #{month.year}
        .weeks
          each week in month.weeks
            .week
              each day in week
                if !day
                  .day.pad
                else
                  div.day(class=((day.past || day.future) ? 'muted' : ''))
                    if day.target
                      ${heart}
                    else
                      span= day.date
`);
