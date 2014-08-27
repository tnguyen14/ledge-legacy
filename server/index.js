'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var compression = require('compression');

var app = connect();

app.use(compression());
app.use(serveStatic('dist/'));
app.listen(80);
