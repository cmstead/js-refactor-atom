'use babel';

import { CompositeDisposable } from 'atom';
const container = require('./container');

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    let rename = container.build('renameFactory');
    let addExport = container.build('addExportFactory');
    let reformatAction = container.build('reformatFactory');

    let reformat = this.callWithEditor(reformatAction);

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:reformat': reformat,
      'js-refactor-atom:addExport': this.callWithEditor(addExport),
      'js-refactor-atom:rename': this.callWithEditor(rename)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  callWithEditor(action, callback) {
    return function () {
      let editor = atom.workspace.getActiveTextEditor();

      if(editor){
        action(editor, callback);
      }
    };
  }

};
