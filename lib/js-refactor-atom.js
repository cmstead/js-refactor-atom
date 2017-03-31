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
    let inlineVariable = container.build('inlineVariableFactory');
    let negateExpression = container.build('negateExpressionFactory');
    let reformatAction = container.build('reformatFactory');
    let rename = container.build('renameFactory');
    let shiftParamsLeft = container.build('shiftParamsLeftFactory');
    let shiftParamsRight = container.build('shiftParamsRightFactory');
    let wrapInArrowFunction = container.build('wrapInArrowFunctionFactory');
    let wrapInAsyncFunction = container.build('wrapInAsyncFunctionFactory');
    let wrapInCondition = container.build('wrapInConditionFactory');
    let wrapInExecutedFunction = container.build('wrapInExecutedFunctionFactory');
    let wrapInFunction = container.build('wrapInFunctionFactory');
    let wrapInGenerator = container.build('wrapInGeneratorFactory');
    let wrapInIIFE = container.build('wrapInIIFEFactory');
    let wrapInTryCatch = container.build('wrapInTryCatchFactory');

    let reformat = this.callWithEditor(reformatAction);

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:addExport': this.callWithEditor(addExport),
      'js-refactor-atom:convertToMemberFunction': this.callWithEditor(convertToMemberFunction),
      'js-refactor-atom:convertToNamedFunction': this.callWithEditor(convertToNamedFunction),
      'js-refactor-atom:extractVariable': this.callWithEditor(extractVariable, reformat),
      'js-refactor-atom:inlineVariable': this.callWithEditor(inlineVariable, reformat),
      'js-refactor-atom:negateExpression': this.callWithEditor(negateExpression),
      'js-refactor-atom:reformat': reformat,
      'js-refactor-atom:rename': this.callWithEditor(rename),
      'js-refactor-atom:shiftParamsLeft': this.callWithEditor(shiftParamsLeft),
      'js-refactor-atom:shiftParamsRight': this.callWithEditor(shiftParamsRight),
      'js-refactor-atom:wrapInArrowFunction': this.callWithEditor(wrapInArrowFunction, reformat),
      'js-refactor-atom:wrapInAsyncFunction': this.callWithEditor(wrapInAsyncFunction, reformat),
      'js-refactor-atom:wrapInCondition': this.callWithEditor(wrapInCondition, reformat),
      'js-refactor-atom:wrapInExecutedFunction': this.callWithEditor(wrapInExecutedFunction, reformat),
      'js-refactor-atom:wrapInFunction': this.callWithEditor(wrapInFunction, reformat),
      'js-refactor-atom:wrapInGenerator': this.callWithEditor(wrapInGenerator, reformat),
      'js-refactor-atom:wrapInIIFE': this.callWithEditor(wrapInIIFE, reformat),
      'js-refactor-atom:wrapInTryCatch': this.callWithEditor(wrapInTryCatch, reformat)
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
