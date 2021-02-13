const pug = require("pug");

exports.handler = async function (event) {
  const { t } = event.queryStringParameters;

  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html;charset=utf-8",
    },
    body: template({ target: t }),
  };
};

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

const template = pug.compile(
  `
doctype html
style= styles
title Countdown
.page
  h1 Countdown
  p Target:
    strong= target
`,
  {
    globals: { styles },
  }
);
