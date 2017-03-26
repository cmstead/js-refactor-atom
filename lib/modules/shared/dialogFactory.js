'use strict';

var Dialog = require('./dialog');

function dialogFactory () {

  function open (prompt, callback) {
    var options = { prompt: prompt };
    var dialog = new Dialog(options);

    dialog.onConfirmEvent(function (text) {
      callback(text);
    });

    dialog.attach();

  }

  return {
    open: open
  };
}

module.exports = dialogFactory;
