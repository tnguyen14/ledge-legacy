'use strict';

var budget = require('./budget'),
  checking = require('./checking');

jQuery(document).ready(function($) {
  // default to budget
  budget.init();
});
