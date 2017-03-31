'use strict';

function wrapInTemplateFactory(
    logger,
    dialogFactory,
    utilities,
    editActionsFactory) {

    return function (vsEditor, callback) {

        function promptAndCall(callback, prompt) {
            if (prompt) {
                dialogFactory.open(prompt.prompt, callback);
            } else {
                callback();
            }
        }

        return function wrapInCondition(wrapSelection, errorMessage, prompt) {
            var selection = utilities.getSelection(vsEditor);

            function applyToDocument(value) {
                var text = wrapSelection(selection, value);
                var coords = utilities.buildCoords(vsEditor, 0);

                return editActionsFactory(vsEditor).applySetEdit(text, coords, callback);
            }

            if (selection.length === 1 && selection[0] === '') {
                logger.info(errorMessage);
            } else {
                promptAndCall(applyToDocument, prompt);
            }
        };

    }
}

module.exports = wrapInTemplateFactory;
