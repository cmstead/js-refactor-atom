'use strict';

var prettier = require('prettier');

function reformatFactory () {

  return function (editor) {
    var source = editor.getText();
    var formattedSource = prettier.format(source);

    editor.setText(formattedSource);
  };

}

module.exports = reformatFactory;
