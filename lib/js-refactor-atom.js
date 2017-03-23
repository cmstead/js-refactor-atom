'use babel';

import JsRefactorAtomView from './js-refactor-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  jsRefactorAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.jsRefactorAtomView = new JsRefactorAtomView(state.jsRefactorAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.jsRefactorAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'js-refactor-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.jsRefactorAtomView.destroy();
  },

  serialize() {
    return {
      jsRefactorAtomViewState: this.jsRefactorAtomView.serialize()
    };
  },

  toggle() {
    console.log('JsRefactorAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
