import Ember from 'ember';

var ObjectPromiseController = Ember.ObjectController.extend(Ember.PromiseProxyMixin);

function stringifyNumbers(content) {
  var displayText = content.displayText;
  if(typeof displayText == 'number') {
    content.displayText = displayText.toString();
  }
  return content;
}

export default Ember.Component.extend({
  layoutName: function () {
    var template = this.get('column.observePath') ? 'em-table-bounded-cell' : 'em-table-cell';
    return 'components/' + template;
  }.property('column.observePath'),

  classNames: ['cell-content'],

  value: null,
  observedPath: null,

  _addObserver: function (path) {
    this._removeObserver();
    this.get('row').addObserver(path, this, this._onValueChange);
    this.set('observedPath', path);
  },

  _removeObserver: function (path) {
    var path = this.get('observedPath');
    if(path) {
      this.get('row').removeObserver(path, this, this._onValueChange);
      this.set('observedPath', null);
    }
  },

  _normalizeContent: function (content) {
    return stringifyNumbers(content && typeof content == 'object' ? content : {
      displayText: content
    });
  },

  _pathObserver: function () {
    var path = this.get('column.contentPath');
    if(path && this.get('column.observePath')) {
      this._addObserver(path);
    }
  }.observes('row', 'column.contentPath', 'column.observePath').on('init'),

  _onValueChange: function (row, path) {
    this.set('value', row.get(path));
  },

  cellContent: function () {
    var cellContent = this.get('column').getCellContent(this.get('row'));

    if(cellContent && $.isFunction(cellContent.then)) {
      return ObjectPromiseController.create({
        promise: cellContent.then(this._normalizeContent)
      });
    }

    return this._normalizeContent(cellContent);
  }.property('row', 'column', 'value'),

  willDestroy: function () {
    this._removeObserver();
  }
});
