'use strict';

var j = require('jfp');

function addExportFactory(
    logger
    // selectionFactory,
    // editActionsFactory,
    // utilities,
    // addExportAction
  ) {

    return function (editor, callback) {

        // function applyRefactoring (selection, lines, refactorData){
        //     if (refactorData.functionName === '') {
        //         logger.log('No appropriate named function to export did you select a line containing a function?');
        //     } else {
        //         editActionsFactory(editor)
        //             .applySetEdit(refactorData.text, refactorData.coords, callback);
        //     }
        // }
        //
        return function applyExport() {
            // var selection = utilities.getSelection(editor);
            // var lines = utilities.getDocumentLines(editor);
            // var refactorData = addExportAction.getRefactorData(selection, lines);
            //
            // applyRefactoring(selection, lines, refactorData);
        }

    };
}

module.exports = addExportFactory;
