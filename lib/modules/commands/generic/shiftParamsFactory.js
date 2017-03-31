'use strict';

function shiftParamsFactory(
    logger,
    editActionsFactory,
    utilities,
    variableOrderAction) {

    return function (direction, vsEditor, callback) {

        function applyRefactor(editActions, selection) {
            var coords = utilities.buildCoords(vsEditor, 0);

            if (selection.length === 1 && selection[0] === '') {
                logger.info('Cannot shift parameters on an empty selection.');
            } else {
                var parameterShift = pickShiftDirection(direction.toLowerCase());
                var text = parameterShift(selection[0]);
                editActions.applySetEdit(text, coords, callback);
            }
        }

        function pickShiftDirection(direction) {
            return direction === 'left' ? variableOrderAction.shiftParamsLeft : variableOrderAction.shiftParamsRight
        }

       (function () {
            var editActions = editActionsFactory(vsEditor);
            var selection = utilities.getSelection(vsEditor);

            applyRefactor(editActions, selection);
        })();

    };

}

module.exports = shiftParamsFactory;
