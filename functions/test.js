exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html;charset=utf-8",
    },
    body: "<h1>Function</h1>",
  };
};
