'use babel';

import { CompositeDisposable } from 'atom';
var container = require('./container');
var prettier = require('prettier');
var Dialog = require('./modules/shared/dialog');

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    let rename = container.build('renameFactory');

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:test-run': () => this.testRun(),
      'js-refactor-atom:rename': () => this.callWithEditor(rename, this.formatSource),
      'js-refactor-atom:reformat': this.formatSource
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  formatSource() {
    let editor;

    if(editor = atom.workspace.getActiveTextEditor()) {
      let source = editor.getText();
      let formattedSource = prettier.format(source);

      editor.setText(formattedSource);
    }
  },

  callWithEditor(action, callback) {
    let editor = atom.workspace.getActiveTextEditor();

    if(editor){
      action(editor, callback);
    }
  },

  testRun() {
    let editor;

    if(editor = atom.workspace.getActiveTextEditor()){
      let editActions = container.build('editActionsFactory')(editor);
      let utilities = container.build('utilities');
      let logger = container.build('logger');

      var prompt = {
        prompt: "Enter some info"
      };

      var dialog = new Dialog(prompt);

      dialog.onConfirmEvent(function (text) {
        logger.log('This is some info: ' + text);
        logger.error('Oh noes! Something bad happened!: ' + text);

        editActions.applySetEdit(text, utilities.buildCoords(editor), this.formatSource);
      });

      dialog.attach();


    }
  }

};
