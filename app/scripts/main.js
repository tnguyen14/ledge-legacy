'use strict';

var Handlebars = require('handlebars');
var templates = require('../templates/all.js')(Handlebars);
var _ = require('lodash');

require('./handlebars-helpers.js');

var setupEvents = function() {
  $('.delete-transaction').on('click', function (e) {
    e.preventDefault();
    var transaction = $(e.target).closest('.transaction'),
      transactionId = transaction.data('id');
    $.ajax({
      url: '@@SERVERURL/accounts/toan/transactions/' + transactionId,
      type: 'DELETE',
      success: function () {
        // @TODO: reload balance
        transaction.remove();
      }
    });
  });
};

jQuery(document).ready(function($) {
  $.ajax({
    url: '@@SERVERURL/accounts/toan',
    success: function(data) {
      var balance = data.starting_balance;
      $('.accounts').append(templates.account({name: data.name, balance: balance}));
      _.each(data.categories, function (cat) {
        $('#category').append('<option value="' + cat + '">' + cat + '</option>');
      });
      _.each(data.transactions, function (tx) {
        var html = templates.transaction(tx);
        balance = balance - tx.amount;
        $('.transactions').append(html);
      });
      $('.balance .amount').html(Handlebars.helpers.printMoney(balance));
      setupEvents();
    }
  });
});
