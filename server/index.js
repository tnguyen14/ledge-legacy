'use strict';

var restify = require('restify');
var serveStatic = require('serve-static');

var server = restify.createServer({
  name: 'ledge-client',
  version: '0.0.1'
});

server.use(restify.gzipResponse());
server.get(/.*/, serveStatic('dist/'));
server.listen(process.env.PORT || 4000, function () {
  console.log('%s listening at %s', server.name, server.url);
});
