'use strict';

var templates = require('./templates');

exports.init = function () {
  $('.primary').empty().html(templates.budget);
};
