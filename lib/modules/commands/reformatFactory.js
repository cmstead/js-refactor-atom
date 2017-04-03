'use strict';

var prettier = require('prettier');
var j = require('jfp');

function reformatFactory(logger) {
    function getTrailingCommaValue(commaFlag) {
        return Boolean(commaFlag) ? 'es5' : 'none;';
    }

    function buildOptions(defaults, config) {
        return {
            printWidth: j.eitherInt(defaults.printWidth.default)(config.printWidth),
            tabWidth: j.eitherInt(defaults.tabWidth.default)(config.tabWidth),
            singleQuote: j.eitherInt(defaults.singleQuote.default)(config.singleQuote),
            trailingComma: getTrailingCommaValue(config.trailingComma),
            bracketSpacing: j.eitherInt(defaults.bracketSpacing.default)(config.bracketSpacing)
        };
    }

    return function(editor, callback, config, defaults) {
        var formatConfig = buildOptions(defaults, config);

        try {
            var source = editor.getText();
            var formattedSource = prettier.format(source, formatConfig);

            editor.setText(formattedSource);
        } catch (e) {
            // I don't want the user to have a nasty error thrown if their code is unparseable.
            console.warn('A formatting error occurred: ', e);
            logger.warning('Unable to format code, perhaps there is a syntax error?');
        }
    };
}

module.exports = reformatFactory;
