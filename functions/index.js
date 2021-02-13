const { serve } = require('../lib/html');

exports.handler = (event) => serve(event.queryStringParameters);
