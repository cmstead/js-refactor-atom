'use strict';

function sourceUtils(
    scopeFinder,
    utilities) {

    function scopeDataFactory(lines, selectionData) {
      var scopeBounds = scopeFinder.findScopeCoords(lines.join('\n'), selectionData.selectionCoords);

      return {
          scopeBounds: scopeBounds
      };
    }

    function matchInLine(regex, line) {
        return typeof line === 'string' && line.match(regex) !== null;
    }

    function matchInSource(regex, lines) {
        return matchInLine(regex, lines.join(''))
    }

    function buildEsprimaCoords(coords) {
        return {
            start: [coords.start.line, coords.start.column],
            end: [coords.end.line, coords.end.column],
        };
    }

    function getDocumentScopeBounds(scopeBounds) {
        var start = scopeBounds.start;
        var end = scopeBounds.end;

        return {
            start: [start[0], start[1] + 1],
            end: [end[0], end[1] + 1]
        };
    }

    function getScopeLines(lines, bounds) {
        var scopeLines = null;
        var startLine = bounds.start[0]

        if (bounds.end[0] === lines.length - 1) {
            scopeLines = lines.slice(bounds.start[0]);
        } else {
            scopeLines = lines.slice(bounds.start[0], bounds.end[0] + 1);
        }

        var lastIndex = scopeLines.length - 1;

        scopeLines[0] = scopeLines[0].substr(bounds.start[1]);
        scopeLines[lastIndex] = scopeLines[lastIndex].substr(0, bounds.end[1] + 1);

        return scopeLines;
    }

    return {
        buildEsprimaCoords: buildEsprimaCoords,
        getDocumentScopeBounds: getDocumentScopeBounds,
        getScopeLines: getScopeLines,
        matchInLine: matchInLine,
        matchInSource: matchInSource,
        scopeDataFactory: scopeDataFactory
    }
}

module.exports = sourceUtils;
