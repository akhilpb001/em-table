import Ember from 'ember';

import ColumnDef from 'em-table/utils/column-definition';

function createColumn(columnCount) {
  var columns = [];

  // Generate columns
  for(var i = 0; i < columnCount; i++) {
    columns.push({
      id: 'col' + i,
      headerTitle: 'Column ' + i,
      contentPath: 'col' + i,
      observePath: true
    });
  }

  columns[1].headerTitle = "Header that would be clipped with ellipsis.";

  return ColumnDef.make(columns);
}

function createData(columnCount, rowCount) {
  var data = [],
      row;

  // Generate static part of data
  for(var j = 0; j < rowCount; j++) {
    row = Ember.Object.create();
    for(var i = 0; i < columnCount; i++) {
      row.set('col' + i, 'Column ' + i + ' - Data ' + j);
    }
    data.push(row);
  }

  // Null data
  data[3].set('col0', null);

  // data that would be clipped with ellipsis
  data[3].set('col1', "Data that would be clipped with ellipsis.");

  // Generate dynamic part of data
  setInterval(function () {
    var row = parseInt(Math.random() * rowCount),
        col = parseInt(Math.random() * columnCount),
        value = data[row].get("col" + col);

    if(value) {
      value = value.split(" : ")[0],
      value = value + " : " + parseInt(Math.random() * 100);

      data[row].set("col" + col, value);
    }
  }, 1000);

  return Ember.A(data);
}

export default Ember.Controller.extend({
  columns: createColumn(5),
  rows: createData(5, 8)
});
