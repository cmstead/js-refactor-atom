var coreAtom = require('atom');

var TextEditor = coreAtom.TextEditor;
var CompositeDisposable = coreAtom.CompositeDisposable;
var Disposable = coreAtom.Disposable;
var Emitter = coreAtom.Emitter;
var Range = coreAtom.Range;
var Point = coreAtom.Point;

var typeUtils = require('./typeUtils')();
var stringOrDefault = typeUtils.either('string')('');

var Dialog = (function() {
  function Dialog(arg) {
    var baseName;
    var blurHandler;
    var extension;
    var selectionEnd;
    var selectionStart;

    var ref = typeof arg === 'object' && arg != null ? arg : {};
    var initialPath = stringOrDefault(ref.initialPath);
    var select = stringOrDefault(ref.select);
    var iconClass = stringOrDefault(ref.iconClass);
    var prompt = stringOrDefault(ref.prompt);

    this.emitter = new Emitter();
    this.disposables = new CompositeDisposable();
    this.element = document.createElement('div');
    this.element.classList.add('tree-view-dialog');
    this.promptText = document.createElement('label');
    this.confirmEventActions = [];

    if (iconClass) {
      this.promptText.classList.add(iconClass);
    }

    this.promptText.textContent = prompt;
    this.element.appendChild(this.promptText);

    this.miniEditor = new TextEditor({
      mini: true
    });

    blurHandler = (function(_this) {
      return function() {
        if (document.hasFocus()) {
          return _this.close();
        }
      };
    })(this);

    this.miniEditor.element.addEventListener('blur', blurHandler);

    this.disposables.add(new Disposable((function(_this) {
      return function() {
        return _this.miniEditor.element.removeEventListener('blur', blurHandler);
      };
    })(this)));

    this.disposables.add(this.miniEditor.onDidChange((function(_this) {
      return function() {
        return _this.showError();
      };
    })(this)));

    this.element.appendChild(this.miniEditor.element);
    this.errorMessage = document.createElement('div');
    this.errorMessage.classList.add('error-message');
    this.element.appendChild(this.errorMessage);

    atom.commands.add(this.element, {

      'core:confirm': (function(_this) {
        return function() {
          return _this.onConfirm(_this.miniEditor.getText());
        };
      })(this),

      'core:cancel': (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this)

    });

    this.miniEditor.setText(initialPath);

    if (select) {
      extension = path.extname(initialPath);
      baseName = path.basename(initialPath);
      selectionStart = initialPath.length - baseName.length;
      if (baseName === extension) {
        selectionEnd = initialPath.length;
      } else {
        selectionEnd = initialPath.length - extension.length;
      }
      this.miniEditor.setSelectedBufferRange(Range(Point(0, selectionStart), Point(0, selectionEnd)));
    }

  }

  Dialog.prototype = {
    attach: function() {
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.miniEditor.element.focus();
      return this.miniEditor.scrollToCursorPosition();
    },

    close: function() {
      var panelToDestroy;
      panelToDestroy = this.panel;
      this.panel = null;
      if (panelToDestroy != null) {
        panelToDestroy.destroy();
      }
      this.emitter.dispose();
      this.disposables.dispose();
      this.miniEditor.destroy();
      return atom.workspace.getActivePane().activate();
    },

    cancel: function() {
      var ref;
      this.close();
      return (ref = document.querySelector('.tree-view')) != null ? ref.focus() : void 0;
    },

    onConfirmEvent: function (callback) {
      this.confirmEventActions.push(callback);
    },

    onConfirm: function (text) {
      this.confirmEventActions.map(function (callback) {
        callback(text);
      });

      this.close();
    },

    showError: function(message) {
      if (message == null) {
        message = '';
      }
      this.errorMessage.textContent = message;
      if (message) {
        this.element.classList.add('error');
        return window.setTimeout(((function(_this) {
          return function() {
            return _this.element.classList.remove('error');
          };
        })(this)), 300);
      }
    }
  };

  return Dialog;

})();

module.exports = Dialog;
