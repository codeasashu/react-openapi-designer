import * as monaco from 'monaco-editor';
import EventEmitter from '../Tree/EventEmitter';

class MonacoCodeStore {
  constructor(e) {
    this.rawViewState = null;
    this.valueEmitter = new EventEmitter();
    this.changeEmitter = new EventEmitter();
    //this.disposables = new r.DisposableCollection()
    this.decorations = [];

    this.highlightPaths = (e = [], t) => {
      if (!this.editor) {
        return;
      }

      const n = [];

      for (const r in e) {
        // eslint-disable-next-line no-prototype-builtins
        if (!e.hasOwnProperty(r)) {
          continue;
        }

        const o = e[r];

        const a = {
          startLineNumber: o.start.line,
          startColumn: 0,
          endLineNumber: o.end ? o.end.line : o.start.line,
          endColumn: 0,
        };

        if (parseInt(r) === t) {
          this.editor.revealRangeAtTop(
            Object.assign(Object.assign({}, a), {
              startLineNumber: Math.max(o.start.line - 2, 0),
            }),
            monaco.editor.ScrollType.Smooth,
          );
        }

        n.push({
          range: a,

          options: {
            isWholeLine: true,
            className: 'CodeEditor-line--active',
          },
        });
      }

      this.decorations = this.editor.deltaDecorations(this.decorations, n);
    };

    this.onModelDidChangeContent = (e) => {
      this.changeEmitter.emit('modelContentChanged', e);
      this.valueEmitter.emit('didUpdate', this.model.getValue());
    };

    this.id = e.id;
    this.path = e.path;
    this.lang = e.lang || 'yaml';
    this.model = this.createModel(e.value || '');
    this.setupSubscriptions();
  }

  get value() {
    return this.model.getValue();
  }

  get onDidUpdateValue() {
    return (e) => this.valueEmitter.on('didUpdate', e);
  }

  get onModelContentChanged() {
    return (e) => this.changeEmitter.on('modelContentChanged', e);
  }

  setValue(e) {
    console.log('setting val', e);
    if (e !== this.model.getValue()) {
      this.model.setValue(e);
    }
  }

  restoreViewState() {
    if (this.editor && this.rawViewState) {
      this.editor.restoreViewState(this.rawViewState);
    }
  }

  saveViewState() {
    if (this.editor) {
      this.rawViewState = this.editor.saveViewState();
    }
  }

  createModel(e) {
    const t = monaco.editor.createModel(
      e,
      this.lang,
      this.path ? monaco.Uri.parse(this.path) : undefined,
    );
    return t;
  }

  setupSubscriptions() {
    this.model.onDidChangeContent(this.onModelDidChangeContent);
  }
}

export default MonacoCodeStore;
