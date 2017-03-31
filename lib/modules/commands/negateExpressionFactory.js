'use strict';

function negateExpressionFactory(
    logger,
    editActionsFactory,
    utilities,
    negateExpressionAction) {

    return function (vsEditor, callback) {

        function applyRefactoring(selection, lines, coords) {

            if (selection.length === 1 && selection[0] === '') {
                logger.log('Cannot negate empty selection, be sure to select expression to negate');
            } else {
                var negatedExpression = negateExpressionAction.negateExpression(selection[0]);

                editActionsFactory(vsEditor)
                    .applySetEdit(negatedExpression, coords, callback);
            }
        }

        (function applyNegateExpression() {
            var selection = utilities.getSelection(vsEditor);
            var lines = utilities.getDocumentLines(vsEditor);
            var coords = utilities.buildCoords(vsEditor, 0);

            applyRefactoring(selection, lines, coords);
        })();

    };

}

module.exports = negateExpressionFactory;
