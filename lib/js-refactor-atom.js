'use babel';

import { CompositeDisposable } from 'atom';
const container = require('./container');

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    let rename = container.build('renameFactory');
    let reformat = container.build('reformatFactory');

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:reformat': this.callWithEditor(reformat),
      'js-refactor-atom:rename': this.callWithEditor(rename, reformat)
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
