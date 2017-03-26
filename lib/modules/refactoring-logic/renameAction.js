'use strict';

var esrefactor = require('esrefactor');

function renameAction() {
  function addLineLength (result, line) {
    return result + (line.length + 1);
  }

  function getTokenIndex (selectionCoords, sourceLines) {
    var selectionPrefixLines = sourceLines.slice(0, selectionCoords.start[0]);
    return selectionPrefixLines.reduce(addLineLength, 0) + selectionCoords.start[1];
  }

  function renameVar(tokenIndex, source, value) {
    var context = new esrefactor.Context(source);
    var id = context.identify(tokenIndex + 1);
    return context.rename(id, value);
  }

  function rename(selectionCoords, sourceLines, name){
    var tokenIndex = getTokenIndex(selectionCoords, sourceLines);
    return renameVar(tokenIndex, sourceLines.join('\n'), name);
  }

  return {
    rename: rename
  };

}

module.exports = renameAction;
