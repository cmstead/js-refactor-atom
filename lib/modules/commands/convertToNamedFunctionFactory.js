"use strict";

function convertToNamedFunctionFactory(
  logger,
  editActionsFactory,
  utilities,
  convertToNamedFunctionAction
) {
  return function(editor, callback) {
    var canRefactorToNamed = convertToNamedFunctionAction.canRefactorToNamed;
    var buildRefactorString = convertToNamedFunctionAction.buildRefactorString;

    function applyRefactor(editActions, selection, coords) {
      if (selection === null) {
        logger.log(
          "Cannot perform named function conversion on an empty selection."
        );
      } else if (!canRefactorToNamed(selection[0])) {
        logger.log("No appropriate anonymous or member function to convert.");
      } else {
        var refactorString = buildRefactorString(selection);

        editActions.applySetEdit(refactorString, coords, callback);
      }
    }

    (function convertToNamedFunction() {
      var editActions = editActionsFactory(editor);
      var selection = utilities.getSelection(editor);
      var coords = utilities.buildCoords(editor, 0);

      applyRefactor(editActions, selection, coords);
    })();
  };
}

module.exports = convertToNamedFunctionFactory;
