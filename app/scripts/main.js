'use strict';

jQuery(document).ready(function($) {
  $.ajax({
    url: 'http://localhost:3000/accounts/toan',
    success: function(data) {
      var balance = data.starting_balance;
      $('.account-name').html(data.name);
      _.each(data.categories, function (cat) {
        $('#category').append('<option value="' + cat + '">' + cat + '</option>');
      });
      _.each(data.transactions, function (tx) {
        var html = '<tr>';
        html += '<td>' + tx.date + '</td>';
        html += '<td>' + tx.description + '</td>';
        html += '<td>' + tx.amount + '</td>';
        html += '<td>' + tx.category + '</td>';
        html += '</tr>';
        balance -= tx.amount;
        $('.transactions').append(html);
      });
      $('.balance').append(balance);
    }
  });
});
