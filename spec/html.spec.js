const { render } = require('../lib/html');

describe('html', () => {
  it('should render', () => {
    const html = render({ target: { year: 2021, month: 4, date: 19 }, now: { year: 2021, month: 2, date: 13 } });
    console.log(html);
  });
});
