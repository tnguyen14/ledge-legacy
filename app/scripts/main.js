'use strict';

var Handlebars = require('handlebars');
var templates = require('../../.tmp/templates/templates.js')(Handlebars);
var _ = require('lodash');

var setupEvents = function() {
  $('.delete-transaction').on('click', function (e) {
    e.preventDefault();
    var transaction = $(e.target).closest('.transaction'),
      transactionId = transaction.data('id');
    $.ajax({
      url: '@@SERVERURL/accounts/toan/transactions/' + transactionId,
      type: 'DELETE',
      success: function(data) {
        // @TODO: reload balance
        transaction.remove();
      }
    });
  });
};

// var money = function (amount) {
//   return '$' + amount.toFixed(2);
// };

jQuery(document).ready(function($) {
  $.ajax({
    url: '@@SERVERURL/accounts/toan',
    success: function(data) {
      var balance = data.starting_balance;
      $('.account-name').html(data.name);
      _.each(data.categories, function (cat) {
        $('#category').append('<option value="' + cat + '">' + cat + '</option>');
      });
      _.each(data.transactions, function (tx) {
        var html = templates.transaction(tx);
        balance = balance - tx.amount;
        $('.transactions').append(html);
      });
      $('.balance').append(balance);
      setupEvents();
    }
  });
});
