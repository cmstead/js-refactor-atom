'use strict';

function utilities() {

  function stringOrDefault (value) {
    return typeof value === 'string' ? value : '';
  }

  function tokenizeLines (source) {
    return stringOrDefault(source).split(/\r?\n/g);
  }

  function buildCoords(editor) {
    var range = editor.getSelectedBufferRange();

    return {
      start: [
        range.start.row,
        range.start.column
      ],
      end: [
        range.end.row,
        range.end.column
      ]
    };
  }

  function getDocumentSource (editor) {
    return editor.getText();
  }

  function getDocumentLines(editor) {
    return tokenizeLines(getDocumentSource(editor));
  }

  function getSelection(editor) {
    var source = editor.getSelectedText();
    return tokenizeLines(source);
  }

  return {
    buildCoords: buildCoords,
    getDocumentLines: getDocumentLines,
    getDocumentSource: getDocumentSource,
    getSelection: getSelection
  };

}

module.exports = utilities;
