'use strict';

var j = require('jfp');

function inlineVariableFactory(
    logger,
    editActionsFactory,
    extensionHelper,
    sourceUtils,
    utilities,
    inlineVariableAction) {

    return function (editor, callback) {

        function applyRefactor(selectionData, scopeData, lines) {
            var scopeBounds = j.deref('scopeBounds')(scopeData);
            var selectedVar = j.eitherString('')(j.deref('selection')(selectionData));

            var isAssignedVariable = inlineVariableAction.isAssigned(selectedVar);
            var valueInFunctionScope = inlineVariableAction.isValueInScope(scopeBounds, selectionData.selectionCoords);

            if (selectionData.selection === '') {
                logger.info('Cannot inline empty selection');
            } else if(!isAssignedVariable) {
                logger.info('Variable is either not local or unassigned, cannot inline');
            } else if (!valueInFunctionScope) {
                logger.info('Cannot inline variable if it is not inside a function');
            } else {
                buildAndApply(selectionData, scopeData, lines);
            }
        }

        function buildAndApply(selectionData, scopeData, lines) {
            var editActions = editActionsFactory(editor);

            var bounds = sourceUtils.getDocumentScopeBounds(scopeData.scopeBounds);
            var selection = selectionData.selection;

            var replacementSource = inlineVariableAction.getReplacementSource(selection, bounds, lines);


            editActions.applySetEdit(replacementSource, bounds, callback);
        }

        function getSelectionData(vsEditor) {
            var selection = utilities.getSelection(vsEditor)[0];
            var selectionCoords = utilities.buildCoords(vsEditor, 0);

            var lineOffset = inlineVariableAction.getWhitespaceOffset(j.eitherString('')(selection));

            selectionCoords.start[1] += lineOffset;

            return {
                selection: selection,
                selectionCoords: selectionCoords
            };
        }

        (function inlineAction() {
            var getScopeBounds = extensionHelper.returnOrDefault(null, sourceUtils.scopeDataFactory);
            var selectionData = getSelectionData(editor);

            var lines = utilities.getDocumentLines(editor);
            var scopeData = getScopeBounds(lines, selectionData);

            applyRefactor(selectionData, scopeData, lines);
        })();
    }
}

module.exports = inlineVariableFactory;
