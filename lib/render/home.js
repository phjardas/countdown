const csso = require('csso');
const pug = require('pug');
const colorConvert = require('color-convert');

const { getCalendar } = require('../date-utils');

module.exports = (params) => {
  const primaryRGB = colorConvert.hex.rgb(params.primary);
  const calendar = getCalendar(params);
  const body = template({ params, primaryRGB, calendar, getMonthName });

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html;charset=utf-8',
      'content-length': body.length,
    },
    body: body,
  };
};

function getMonthName({ month }) {
  const names = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return names[month - 1];
}

const styles = csso.minify(`
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

body {
  color: var(--color);
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  line-height: 1;
}

h1 {
  color: #999;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.page {
  margin: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(1, 1fr);
}

.month {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.month-name {
  color: #999;
  margin-bottom: 0.5rem;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.weeks {
  display: flex;
  flex-direction: column;
}

.week {
  display: flex;
}

.day {
  position: relative;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day.current:before {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: var(--primary-light);
}
.day.muted {
  color: var(--muted);
}
.day.target {
  color: var(--primary);
}

.remaining {
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;
}

.duration-part {
  white-space: nowrap;
}

.duration-part-count {
  font-weight: 500;
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

  .calendar {
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem;
  }

  .remaining {
    margin-bottom: 4rem;
  }
}
`).css;

const template = pug.compile(
  `
doctype html
meta(charset="utf-8")
title= params.title
meta(name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no")
link(rel="manifest" href="/r/"+params.s+"/manifest.json")
link(rel="apple-touch-icon" sizes="180x180" href="/i/"+params.icon.id+"/apple-touch-icon.png")
link(rel="icon" type="image/png" sizes="32x32" href="/i/"+params.icon.id+"/favicon-32x32.png")
link(rel="icon" type="image/png" sizes="16x16" href="/i/"+params.icon.id+"/favicon-16x16.png")
link(rel="mask-icon" href="/i/"+params.icon.id+"/safari-pinned-tab.svg" color=params.primary)
meta(name="msapplication-TileColor" content=params.primary)
meta(name="theme-color" content=params.primary)
style.
  html{--primary:#{params.primary};--primary-light:rgba(#{primaryRGB[0]},#{primaryRGB[1]},#{primaryRGB[2]},.2)}${styles}
style= params.icon.style
.page
  h1= params.title
  if calendar.past
    p Schon vorbei!
  else
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
                    div.day(class=((day.past || day.future) ? 'muted' : (day.current ? 'current' : (day.target ? 'target' : ''))))
                      if day.target
                        | !{params.icon.img}
                      else
                        span= day.date
`.trim()
);
