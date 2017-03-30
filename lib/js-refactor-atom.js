'use babel';

import { CompositeDisposable } from 'atom';
const container = require('./container');

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    let addExport = container.build('addExportFactory');
    let convertToMemberFunction = container.build('convertToMemberFunctionFactory');
    let convertToNamedFunction = container.build('convertToNamedFunctionFactory');
    let extractVariable = container.build('extractVariableFactory');
    let reformatAction = container.build('reformatFactory');
    let rename = container.build('renameFactory');

    let reformat = this.callWithEditor(reformatAction);

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:addExport': this.callWithEditor(addExport),
      'js-refactor-atom:convertToMemberFunction': this.callWithEditor(convertToMemberFunction),
      'js-refactor-atom:convertToNamedFunction': this.callWithEditor(convertToNamedFunction),
      'js-refactor-atom:extractVariable': this.callWithEditor(extractVariable, reformat),
      'js-refactor-atom:reformat': reformat,
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
