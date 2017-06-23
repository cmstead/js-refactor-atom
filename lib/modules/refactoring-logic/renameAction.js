'use strict';

var esrefactor = require('esrefactor');

function renameAction(scopeFinder) {
    function addLineLength(result, line) {
        return result + (line.length + 1);
    }

    function getTokenIndex(selectionCoords, sourceLines) {
        var selectionPrefixLines = sourceLines.slice(0, selectionCoords.start[0]);
        return selectionPrefixLines.reduce(addLineLength, 0) + selectionCoords.start[1];
    }

    function renameVar(tokenIndex, source, value) {
        var context = new esrefactor.Context(source);
        var id = context.identify(tokenIndex + 1);
        return context.rename(id, value);
    }

    function getFunctionSource(contentList, coords) {
        var lines = contentList.slice(coords.start[0], coords.end[0] + 1);

        lines[0] = lines[0].slice(coords.start[1]);
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, coords.end[1]);

        return lines.join('\n');
    }

    function performRename(fileSource, functionSource, varName, newName) {
      let pattern = new RegExp('([^\.\w\_])(' + varName + ')([^\.\w\_])', 'gi');
      let replace = '$1' + newName + '$3';
      let updatedSource = functionSource.replace(pattern, replace);

      return fileSource.replace(functionSource, updatedSource);

    }

    function adjustNameSelection (selectionCoords) {
      return {
        start: [
          selectionCoords.start[0],
          selectionCoords.start[1]
        ],
        end: [
          selectionCoords.end[0],
          selectionCoords.end[1] - 1
        ]
      };
    }

    function rename(selectionCoords, sourceLines, name) {
        let fileSource = sourceLines.join('\n');

        let variableDef = scopeFinder.findVariableAndCoords(fileSource, adjustNameSelection(selectionCoords));
        let varName = variableDef.variableName;
        let varCoords = variableDef.variableCoords;

        let functionCoords = scopeFinder.findFunctionCoords(fileSource, varCoords);
        let functionSource = getFunctionSource(sourceLines, functionCoords);

        if (varName !== '') {
            return performRename(fileSource, functionSource, varName, name);
        } else {
            return functionSource;
        }
    }

    return {
        rename: rename
    };
}

module.exports = renameAction;
