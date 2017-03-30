'use strict';

function logger () {

  function error(message) {
    atom.notifications.addError(message);
  }

  function log(message){
    atom.notifications.addInfo(message);
  }

  function warning(message) {
    atom.notifications.addWarning(message);
  }

  return {
    error: error,
    log: log,
    info:log,
    warning: warning
  };

}

module.exports = logger;
