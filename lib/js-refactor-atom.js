'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    console.log('test run');

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:test-run': () => this.testRun()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  testRun() {
    let editor;

    if(editor = atom.workspace.getActiveTextEditor()){
      console.log(editor.getText());
      console.log(editor.getSelectedText());
      console.log(editor.getSelectedBufferRange());

      var range = {
        start: {
          column: 0,
          row: 3
        },
        end: {
          column: 26,
          row: 3
        }
      };

      editor.setSelectedBufferRange(range);
    }

    console.log('JsRefactorAtom was toggled!');
  }

};
