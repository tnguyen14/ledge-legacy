'use strict';

var _ = require('lodash');
var Handlebars = require('handlebars');
var moment = require('moment-timezone');
var templates = require('./templates');

var balance = 0;
var updateBalance = function () {
  $('.balance .amount').html(Handlebars.helpers.printMoney(balance));
};

var addTransaction = function (transaction) {
  var html = templates.transaction(transaction);
  balance = balance - transaction.amount;
  $('.transactions').append(html);
};

var updateTransaction = function (transaction) {
  var $transaction = $('.transactions').find('.transaction[data-id="' + transaction._id + '"]');
  var oldAmt = +$transaction.find('.amount').data('value');
  balance = balance + oldAmt - transaction.amount;
  var newTransaction = templates.transaction(transaction);
  $transaction.html($(newTransaction).html());
};

var clearForm = function ($form) {
  $form.find('input, textarea, select').val('');
};

var getTransactionData = function ($form) {
  var date = $form.find('#date').val(),
    description = $form.find('#description').val(),
    amount = +$form.find('#amount').val(),
    category = $form.find('#category').val();

  return {
    date: moment.tz(date, 'America/New_York').toDate(),
    amount: amount,
    description: description,
    category: category
  };
};

var setupEvents = function() {
  // add new transaction
  $('.new-transaction').on('submit', function (e) {
    e.preventDefault();
    var $form = $(e.target);
    var data = getTransactionData($form);
    var action = ($form.data('action') === 'add') ? 'add' : 'edit';
    var transactionId = $form.data('transactionid');
    var uri = (action === 'add') ? '' : '/' + transactionId;
    var actionType = (action === 'add') ? 'POST' : 'PUT';

    $.ajax({
      url: '@@SERVERURL/accounts/toan/transactions' + uri,
      type: actionType,
      data: data,
      success: function (data) {
        if (action === 'add') {
          _.map(data, addTransaction);
        } else {
          if (!data.hasOwnProperty('_id')) {
            _.extend(data, {_id: transactionId});
          }
          updateTransaction(data);
        }
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

  // edit transaction
  $('.transactions').on('click', '.edit-transaction', function (e) {
    e.preventDefault();
    var $form = $('.new-transaction'),
      $transaction = $(e.target).closest('.transaction'),
      transactionId = $transaction.data('id');
    $form.attr('data-action', 'edit');
    $form.attr('data-transactionId', transactionId);
    $form.find('h4').html('Edit transaction ' + transactionId);
    $form.find('#date').val(moment($transaction.find('.date').data('value')).format('YYYY-MM-DD'));
    $form.find('#description').val($transaction.find('.description').html());
    $form.find('#amount').val($transaction.find('.amount').html().split('$')[1]);
    $form.find('#category').val($transaction.find('.category').html());
    $form.find('input[type="submit"]').val('Save');
  });
};

exports.init = function () {
  $('.primary').empty().html(templates.checking);
  var $accounts = $('.accounts');
  $accounts.html('Loading...');
  $.ajax({
    url: '@@SERVERURL/accounts/toan',
    success: function(data) {
      balance = data.starting_balance;
      $accounts.empty().append(templates.account({name: data.name, balance: balance}));
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
};
