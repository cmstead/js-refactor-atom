'use strict';

function editorFactory (sourceLines, range) {

  function first (values) {
    return values[0];
  }

  function setFirst(values, value) {
    values[0] = value;
  }

  function lastIndexOf(values) {
    return values.length - 1;
  }

  function last (values) {
    return values[lastIndexOf(values)];
  }

  function setLast(values, value) {
    values[lastIndexOf(values)] = value;
  }

  function getText () {
    return sourceLines.join('\n');
  }

  function getSelectedText () {
    var startRow = range.start.row;
    var startCol = range.start.column;
    var endRow = range.end.row;
    var endCol = range.end.column;

    var lineLength = (endRow - startRow) + 1;
    var selectedLines = sourceLines.slice(startRow, lineLength);
    var endIndex = lineLength > 1 ? endCol : endCol - startCol;

    setFirst(selectedLines, first(selectedLines).substr(startCol));
    setLast(selectedLines, last(selectedLines).substr(0, endIndex));

    return selectedLines.join('\n');
  }

  function getSelectedBufferRange () {
    return range;
  }

  return {
    getText: getText,
    getSelectedText: getSelectedText,
    getSelectedBufferRange: getSelectedBufferRange
  }

}

module.exports = editorFactory;
