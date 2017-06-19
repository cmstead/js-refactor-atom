'use strict';

var babylon = require('babylon');
var babelCore = require('babel-core');

var j = require('jfp');

const babylonPlugins = [
    'estree',
    'jsx',
    'flow',
    'doExpressions',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportExtensions',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'templateInvalidEscapes'
];

function scopeFinder() {
    function coordsFromVsCodeToAst(vsCodeCoords) {
        return {
            start: [vsCodeCoords.start[0] + 1, vsCodeCoords.start[1]],
            end: [vsCodeCoords.end[0] + 1, vsCodeCoords.end[1]]
        };
    }

    function coordsFromAstToVsCode(astCoords) {
        return {
            start: [astCoords.start.line - 1, astCoords.start.column],
            end: [astCoords.end.line - 1, astCoords.end.column]
        };
    }

    function coordsBodyToContent(bodyCoords) {
        return {
            start: {
                line: bodyCoords.start.line,
                column: bodyCoords.start.column
            },
            end: {
                line: bodyCoords.end.line,
                column: bodyCoords.end.column
            }
        };
    }

    function coordsWithin(coords, node) {
        return (coords.start[0] >= node.loc.start.line ||
            (coords.start[0] === node.loc.start.line &&
              coords.start[1] === node.loc.start.column)) &&
            (coords.end[0] <= node.loc.end.line ||
                (coords.end[0] === node.loc.end.line && coords.end[1] ===
                  node.loc.end.column));
    }

    function isRootScope(node) {
        return node.type === 'Program';
    }

    function getAst(source) {
        try {
            return babylon.parse(source, { sourceType: 'script', plugins: babylonPlugins });
        } catch (e) {
            return babylon.parse(source, { sourceType: 'module', plugins: babylonPlugins });
        }
    }

    function findScopeCoords(source, inputCoords) {
        let ast = getAst(source);
        var selectionCoords = coordsFromVsCodeToAst(inputCoords);

        var matchedScope = null;
        var lastScope = null;

        babelCore.traverse(ast, {
            enter: function(nodePath) {
                lastScope = /(Function|MethodDefinition)/.test(nodePath.type) ? nodePath.node : lastScope;
                matchedScope = coordsWithin(selectionCoords, nodePath.node) ? lastScope : matchedScope;
            }
        });

        let body = typeof matchedScope.body !== 'undefined' ? matchedScope.body : matchedScope.value.body;

        return j.compose(coordsFromAstToVsCode, coordsBodyToContent)(body.loc);
    }

    return {
        findScopeCoords: findScopeCoords
    };
}

module.exports = scopeFinder;
