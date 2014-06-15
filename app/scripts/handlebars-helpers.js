'use strict';

var Handlebars = require('handlebars');
var moment = require('moment');

Handlebars.registerHelper('printDate', function (string) {
  console.log(string);
  console.log(moment(string).format('MMM-D-YY'));
  return moment(string).format('MMM-D-YY');
});
