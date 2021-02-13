const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getDaysOfMonth(month) {
  const count = daysOfMonth[month - 1];
  return Array.from(Array(count + 1).keys()).slice(1);
}

function getDayOfWeek(year, month, day) {
  const date = new Date(year, month - 1, day);
  return (date.getDay() + 6) % 7;
}

function getCalendar(target, now) {
  const months = [];

  for (let date = now; compare(date, target) <= 0; date = nextMonth(date)) {
    const days = getDaysOfMonth(date.month);
    const max = days[days.length - 1];
    const padStart = getDayOfWeek(date.year, date.month, days[0]);

    const dateFactory = (d) =>
      d
        ? {
            date: d,
            current: compare({ ...date, date: d }, now) === 0,
            past: compare({ ...date, date: d }, now) < 0,
            target: compare({ ...date, date: d }, target) === 0,
            future: compare({ ...date, date: d }, target) > 0,
          }
        : null;

    const weeks = [[...Array(padStart).map(dateFactory), ...days.slice(0, 7 - padStart).map(dateFactory)]];

    for (let day = 7 - padStart; day < max; day += 7) {
      const week = days.slice(day, day + 7);
      if (week.length < 7) week.push(...Array(7 - week.length));
      weeks.push(week.map(dateFactory));
    }

    months.push({
      year: date.year,
      month: date.month,
      weeks,
    });
  }

  return {
    target,
    now,
    multiYear: target.year !== now.year,
    months,
  };
}

function compare(a, b) {
  if (a.year < b.year) return -1;
  if (a.year > b.year) return 1;
  if (a.month < b.month) return -1;
  if (a.month > b.month) return 1;
  const ad = a.date || 1;
  const bd = b.date || 1;
  if (ad < bd) return -1;
  if (ad > bd) return 1;
  return 0;
}

function nextMonth(date) {
  return date.month === 12 ? { year: date.year + 1, month: 1 } : { year: date.year, month: date.month + 1 };
}

function x() {
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

module.exports = {
  getCalendar,
};
