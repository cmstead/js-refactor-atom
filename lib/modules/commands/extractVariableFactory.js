'use strict';

var j = require('jfp');

function extractVariableFactory(
    logger,
    editActionsFactory,
    extensionHelper,
    sourceUtils,
    utilities,
    extractVariableAction) {

    return function (editor, callback) {

        function applyRefactor(selectionData, scopeData, lines) {
            var scopeBounds = j.deref('scopeBounds')(scopeData);
            var valueInScope = extractVariableAction.isValueInScope(scopeBounds, selectionData.selectionCoords);

            if (selectionData.selection === '') {
                logger.info('Cannot extract empty selection as a variable');
            } else if (!valueInScope) {
                logger.info('Cannot extract variable if it is not inside a function');
            } else {
                logger.input({ prompt: 'Name of your variable' }, function (name) {
                    buildAndApply(selectionData, scopeData, name, lines);
                });
            }
        }

        function buildAndApply(selectionData, scopeData, name, lines) {
            var bounds = sourceUtils.getDocumentScopeBounds(scopeData.scopeBounds);
            var selection = selectionData.selection;
            var scopeSource = sourceUtils.getScopeLines(lines, bounds).join('\n');
            var replacementSource = scopeSource.replace(selection, name);

            var editActions = editActionsFactory(editor);

            var varCoords = extractVariableAction.buildVarCoords(scopeData);
            var variableString = extractVariableAction.buildVariableString(name, selectionData);

            editActions.applySetEdit(replacementSource, bounds).then(function () {
                editActions.applySetEdit(variableString, varCoords, callback);
            });
        }


        function getSelectionData(editor) {
            return {
                selection: utilities.getSelection(editor)[0],
                selectionCoords: utilities.buildCoords(editor, 0)
            };
        }

        (function extractAction() {
            var getScopeBounds = extensionHelper.returnOrDefault(null, sourceUtils.scopeDataFactory);
            var selectionData = getSelectionData(editor);


            var lines = utilities.getDocumentLines(editor);
            var scopeData = getScopeBounds(lines, selectionData);

            applyRefactor(selectionData, scopeData, lines);
        })();
    }
}

module.exports = extractVariableFactory;
