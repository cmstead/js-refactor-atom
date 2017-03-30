"use strict";

function convertToMemberFunctionFactory(
  logger,
  editActionsFactory,
  utilities,
  convertToMemberFunctionAction
) {
  return function(editor, callback) {
    var canConvertToMember = convertToMemberFunctionAction.canConvertToMember;
    var refactorFunctionDef = convertToMemberFunctionAction.refactorFunctionDef;

    function applyRefactoring(editActions, selection, coords) {
      if (selection === null) {
        logger.log(
          "Cannot perform member function conversion on an empty selection."
        );
      } else if (!canConvertToMember(selection[0])) {
        logger.log(
          "No appropriate named function to convert did you select a line containing a function?"
        );
      } else {
        var refactoredSelection = refactorFunctionDef(selection);

        editActions.applySetEdit(refactoredSelection, coords, callback);
      }
    }

    (function convertToMemberFunction() {
      var editActions = editActionsFactory(editor);
      var selection = utilities.getSelection(editor);
      var coords = utilities.buildCoords(editor, 0);

      applyRefactoring(editActions, selection, coords);
    })();
  };
}

module.exports = convertToMemberFunctionFactory;
