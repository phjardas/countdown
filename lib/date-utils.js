const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getDaysOfMonth(month) {
  const count = daysOfMonth[month];
  return Array.from(Array(count + 1).keys()).slice(1);
}

function getDayOfWeek(year, month, day) {
  const date = new Date(year, month, day);
  return (date.getDay() + 6) % 7;
}

module.exports = {
  getDaysOfMonth,
  getDayOfWeek,
};
