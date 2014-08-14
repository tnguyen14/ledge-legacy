'use strict';

var templates = require('./templates');

exports.init = function () {
  $('.primary').empty().html(templates.budget.main);
  $.ajax({
    url: '@@SERVERURL/accounts/daily',
    success: function(data) {
      console.log(data);
    }
  });
};
