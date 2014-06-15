'use strict';

var Handlebars = require('handlebars');
var templates = require('../../.tmp/templates/templates.js')(Handlebars);

jQuery(document).ready(function($) {
  console.log(templates);
  $.ajax({
    url: 'http://localhost:3000/accounts/toan',
    success: function(data) {
      var balance = data.starting_balance;
      $('.account-name').html(data.name);
      _.each(data.categories, function (cat) {
        $('#category').append('<option value="' + cat + '">' + cat + '</option>');
      });
      _.each(data.transactions, function (tx) {
        var html = templates.transaction(tx);
        $('.transactions').append(html);
      });
      $('.balance').append(balance);
      console.log('yay!');
      setupEvents();
    }
  });

});

var setupEvents = function() {
  $('.delete-transaction').on('click', function (e) {
    console.log($(e.target).closest('.transaction').data('id'));
  });
}
