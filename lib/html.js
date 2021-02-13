const pug = require('pug');
const { getCalendar } = require('./date-utils');
const styles = require('./styles');

module.exports.render = function render({ target, now }) {
  const calendar = getCalendar({ target, now });
  return template({ calendar, styles });
};

const template = pug.compile(`
doctype html
style= styles
title Countdown
.page
  .calendar
    each month in calendar.months
      .calendar-month
        h2.calendar-month-name= month.month
        .calendar-weeks
          each week in month.weeks
            .calendar-week
              each day in week
                if !day
                  .calendar-day.calendar-day-pad
                else
                  div.calendar-day(class=((day.past || day.future) ? 'calendar-day-muted' : ''))= day.date
pre= JSON.stringify(calendar, null, 2)
`);
