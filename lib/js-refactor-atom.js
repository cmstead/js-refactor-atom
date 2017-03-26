'use babel';

import { CompositeDisposable } from 'atom';
const container = require('./container');
const prettier = require('prettier');

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    let rename = container.build('renameFactory');

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:reformat': this.formatSource,
      'js-refactor-atom:rename': this.callWithEditor(rename, this.formatSource)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  // Extract this to formatFactory
  formatSource() {
    let editor;

    if(editor = atom.workspace.getActiveTextEditor()) {
      let source = editor.getText();
      let formattedSource = prettier.format(source);

      editor.setText(formattedSource);
    }
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
