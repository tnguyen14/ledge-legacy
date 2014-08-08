'use strict';

var budget = require('./budget'),
  checking = require('./checking');

jQuery(document).ready(function($) {
  // default to budget
  budget.init();

  // simple routing based on menu navigation
  $('.nav li').on('click', function (e) {
    var $this = $(e.delegateTarget),
      section = $this.data('section');
    $this.addClass('active');
    $this.siblings('.active').removeClass('active');
    switch (section) {
      case 'checking':
        checking.init();
        break;
      case 'budget':
        budget.init();
        break;
    }
  });
});
