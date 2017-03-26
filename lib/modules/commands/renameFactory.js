'use strict';

function renameFactory (
  dialogFactory,
  editActionsFactory,
  logger,
  renameAction,
  utilities) {

  return function (editor, callback){

    (function () {
      var editActions = editActionsFactory(editor);
      var selectionCoords = utilities.buildCoords(editor);
      var sourceLines = utilities.getDocumentLines(editor);

      dialogFactory.open('New variable name', function (name) {
        var result = renameAction.rename(selectionCoords, sourceLines, name);

        editActions.updateSource(result, callback);
      });
    })();

  };

}

module.exports = renameFactory;
