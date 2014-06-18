'use strict';

var Handlebars = require('handlebars');
var moment = require('moment');

Handlebars.registerHelper('printDate', function (string) {
  return moment(string).format('MMM-DD-YY ZZ');
});

Handlebars.registerHelper('printMoney', function (amount) {
  return '$' + (+amount).toFixed(2);
});
