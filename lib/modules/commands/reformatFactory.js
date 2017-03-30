'use strict';

var prettier = require('prettier');

function reformatFactory (logger) {

  return function (editor) {
    try{
      var source = editor.getText();
      var formattedSource = prettier.format(source);

      editor.setText(formattedSource);
    } catch (e) {
      // I don't want the user to have a nasty error thrown if their code is unparseable.
      console.warn('A formatting error occurred: ', e);
      logger.warning('Unable to format code, perhaps there is a syntax error?');
    }
  };

}

module.exports = reformatFactory;
