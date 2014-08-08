'use strict';

var Handlebars = require('handlebars');
require('./handlebars-helpers.js');
var templates = require('templates/all.js')(Handlebars);

module.exports = templates;
