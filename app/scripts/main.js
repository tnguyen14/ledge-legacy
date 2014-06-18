'use strict';

var Handlebars = require('handlebars');
var templates = require('../templates/all.js')(Handlebars);
var _ = require('lodash');

var moment = require('moment-timezone');

require('./handlebars-helpers.js');

var balance = 0;

var updateBalance = function () {
  $('.balance .amount').html(Handlebars.helpers.printMoney(balance));
};

var addTransaction = function (transaction) {
  var html = templates.transaction(transaction);
  balance = balance - transaction.amount;
  $('.transactions').append(html);
};

var clearForm = function ($form) {
  $form.find('input, textarea, select').val('');
};

var setupEvents = function() {
  // add new transaction
  $('.new-transaction').on('submit', function (e) {
    e.preventDefault();
    var $form = $(e.target);
    var date = $form.find('#date').val(),
      description = $form.find('#description').val(),
      amount = +$form.find('#amount').val(),
      category = $form.find('#category').val();
    $.ajax({
      url: '@@SERVERURL/accounts/toan/transactions',
      type: 'POST',
      data: {
        date: moment.tz(date, 'America/New_York').format(),
        amount: amount,
        description: description,
        category: category
      },
      success: function (data) {
        addTransaction(data[0]);
        updateBalance();
        clearForm($form);
      }
    });
  });

  // delete transaction
  $('.transactions').on('click', '.delete-transaction', function (e) {
    e.preventDefault();
    var transaction = $(e.target).closest('.transaction'),
      transactionId = transaction.data('id');
    $.ajax({
      url: '@@SERVERURL/accounts/toan/transactions/' + transactionId,
      type: 'DELETE',
      success: function () {
        balance = balance + (+transaction.find('.amount').data('amount'));
        updateBalance();
        transaction.remove();
      }
    });
  });
};

jQuery(document).ready(function($) {
  $.ajax({
    url: '@@SERVERURL/accounts/toan',
    success: function(data) {
      balance = data.starting_balance;
      $('.accounts').append(templates.account({name: data.name, balance: balance}));
      _.each(data.categories, function (cat) {
        $('#category').append('<option value="' + cat + '">' + cat + '</option>');
      });
      _.each(data.transactions, function (tx) {
        addTransaction(tx);
      });
      updateBalance();
      setupEvents();
    }
  });
});
