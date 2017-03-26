'use strict';

function editActionsFactory (
  atomUtils) {

  return function (editor) {

    function funcOrDefault(fn) {
      return typeof fn === 'function' ? fn : function () {};
    }


    function applySetEdit (content, coords, callback) {
      editor.setTextInBufferRange(atomUtils.buildRange(coords), content);
      funcOrDefault(callback)();
    }

    function applyDeleteEdit (coords, callback) {
      editor.setTextInBufferRange(atomUtils.buildRange(coords), '');
      funcOrDefault(callback)();
    }

    function updateSource(content, callback) {
      editor.setText(content);
      funcOrDefault(callback)();
    }

    return {
      applyDeleteEdit: applyDeleteEdit,
      applySetEdit: applySetEdit,
      updateSource: updateSource
    };

  };

}

module.exports = editActionsFactory;
