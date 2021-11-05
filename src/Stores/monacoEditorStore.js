import {
  action,
  reaction,
  flow,
  makeObservable,
  observable,
  computed,
} from 'mobx';
import * as monaco from 'monaco-editor';
import MonacoCodeStore from './monacoCodeStore';
//import * as yaml from 'yaml';
import yaml from 'js-yaml';
import {nodeOperations} from '../utils/tree';
//
const DiagnosticSeverityClassNameMap = {
  ERROR: 'MonacoGlyphDecoration--error',
  WARNING: 'MonacoGlyphDecoration--warning',
  INFORMATION: 'MonacoGlyphDecoration--info',
  HINT: 'MonacoGlyphDecoration--hint',
};

class MonacoEditorStore {
  isMonacoActivated = false;
  language;
  monacoCodeStoreEditor;

  constructor(stores, node, codeStoreOptions) {
    makeObservable(this, {
      isMonacoActivated: observable,
      language: observable,
      monacoCodeStoreEditor: observable.ref,
      activeSymbol: computed,
      _uri: computed,
      deactivateMonaco: action,
      setHighlightPosition: action,
    });
    this.stores = stores;
    this.isMonacoActivated = false;
    this._deltaDecorations = [];
    this._collabDecorations = [];
    this._contentWidgets = new Map();

    this.activate = async () => {
      this.refresh();

      reaction(
        () => ({
          path: this.node.path,
          editor: this.monacoCodeStoreEditor,
        }),
        action(() => {
          const {language} = this.node;

          if (language !== undefined) {
            monaco.editor.setModelLanguage(this.monacoCodeStore.model, 'yaml');
            //this.language = this.node.language;
            this.language = 'yaml';
          }
        }),
        {
          fireImmediately: true,
        },
      );
    };

    this._monacoChangeToJsonPatch = (e) => ({
      op: nodeOperations.Text,
      value: e.text,
      length: e.rangeLength,
      offset: e.rangeOffset,
    });

    this.activateMonaco = flow(function* () {
      if (!this.isMonacoActivated) {
        this.monacoCodeStoreEditor = this.monacoCodeStore.editor;

        yield this._setMonacoDeltaDecorations(
          this.activeSymbol,
          this.node.data.diagnostics,
        );

        this.monacoStore.onDidUpdateValue((e) => {
          const data = yaml.load(e);
          if (this.monacoCodeStore.value !== e) {
            this.stores.graphStore.graph.patchSourceNodeProp(
              this.node.id,
              'data.parsed',
              [
                {
                  op: nodeOperations.Replace,
                  value: data,
                  path: [],
                },
              ],
            );
          }
        });

        this.monacoStore.onModelContentChanged((e) => {
          if (e.changes && e.changes.length) {
            if (this.node.data.raw !== this.monacoCodeStore.value) {
              for (const t of e.changes) {
                this.stores.graphStore.graph.patchSourceNodeProp(
                  this.node.id,
                  'data.raw',
                  [this._monacoChangeToJsonPatch(t)],
                );
              }
            }
          }
        });

        reaction(
          () => ({
            activeSymbol: this.activeSymbol,
            editor: this.monacoCodeStoreEditor,
          }),
          ({activeSymbol: t}) => {
            this._setMonacoDeltaDecorations(t);
          },
          {
            delay: 250,
          },
        );

        reaction(
          () => this.monacoCodeStoreEditor,
          (e) => {
            const {CtrlCmd: t, Shift: n} = monaco.KeyMod;

            const {KEY_Z: r, KEY_Y: i} = monaco.KeyCode;

            const o = () => {};

            if (!(e == null)) {
              e.addCommand(r | t, o);
            }

            if (!(e == null)) {
              e.addCommand(r | (n | t), o);
            }

            if (!(e == null)) {
              e.addCommand(i | t, o);
            }
          },
          {
            fireImmediately: true,
          },
        );

        this.monacoStore.focus();

        this.monacoCodeStore.model.updateOptions({
          insertSpaces: true,
          tabSize: 2,
        });

        this.isMonacoActivated = true;
      }
    }).bind(this);

    this._getSymbolLocation = (e) => {
      if (e && e.relativeJsonPath && this.monacoCodeStoreEditor) {
        return this.stores.graphStore.getLocationForJsonPath(
          this.node.id,
          e.relativeJsonPath,
          true,
        );
      }
    };

    this._getCursorPosition = () => {
      var e;
      const t =
        (e = this.monacoCodeStoreEditor) === null || e === undefined
          ? undefined
          : e.getPosition();

      if (t) {
        return {
          line: t.lineNumber - 1,
          character: t.column - 1,
        };
      }
    };

    this.layout = (e) => {
      if (this.monacoCodeStoreEditor) {
        this.monacoCodeStoreEditor.layout(e);
      }
    };

    this.scrollTo = (e) => {
      if (this.monacoCodeStoreEditor) {
        this.monacoCodeStoreEditor.focus();

        this.monacoCodeStoreEditor.setPosition({
          column: e.start.character + 1,
          lineNumber: e.start.line + 1,
        });

        this.monacoCodeStoreEditor.revealRangeAtTop({
          startLineNumber: Math.max(e.start.line - 1, 1),
          startColumn: e.start.character + 1,
          endLineNumber: e.end.line + 1,
          endColumn: e.end.character + 1,
        });
      }
    };

    this.scrollIntoView = (e) => {
      if (!this.monacoCodeStoreEditor) {
        return;
      }

      this.monacoCodeStoreEditor.focus();

      this.monacoCodeStoreEditor.setPosition({
        column: e.start.character + 1,
        lineNumber: e.start.line + 1,
      });

      const t = e.start.line + 1;
      const n = e.end.line + 1;
      const r = this.monacoCodeStoreEditor.getVisibleRanges();

      for (const e of r) {
        if (t >= e.startLineNumber && e.endLineNumber >= n) {
          return;
        }
      }

      this.monacoCodeStoreEditor.revealRangeAtTop({
        startLineNumber: Math.max(e.start.line - 1, 1),
        startColumn: e.start.character + 1,
        endLineNumber: e.end.line + 1,
        endColumn: e.end.character + 1,
      });
    };

    this.scrollToSymbol = async (e = this.activeSymbol) => {
      const t = await this._getSymbolLocation(e);
      const n = this._getCursorPosition();

      if (!t) {
        return;
      }

      const {
        range: {start: r, end: i},
      } = t;

      if (
        n &&
        n.line >= r.line &&
        i.line >= n.line &&
        n.character >= r.character &&
        i.character >= n.character
      ) {
        this.scrollTo({
          start: n,
          end: n,
        });
      } else {
        this.scrollTo(t.range);
      }
    };

    const {id, data, language} = node;

    //this._mux = Object(ia.createMutex)()
    this.node = node;
    this.language = 'yaml';

    this.monacoCodeStore = new MonacoCodeStore({
      id,
      path: this._uri,
      value: yaml.dump(data.parsed, {
        noRefs: true,
      }),
      lang: language,
    });

    const codeStore = this.monacoCodeStore;
    this.monacoStore = codeStoreOptions || {
      value: codeStore.value,
      onModelContentChanged: codeStore.onModelContentChanged,
      onDidUpdateValue: codeStore.onDidUpdateValue,
      highlightPaths: codeStore.highlightPaths,

      focus: () => {
        if (codeStore.editor) {
          codeStore.editor.focus();
        }
      },

      format: () => {
        if (codeStore.editor) {
          codeStore.editor.focus();
          codeStore.editor.getAction('editor.action.formatDocument').run();
        }
      },
    };
  }

  setHighlightPosition(position, paths) {
    if (
      !this._highlightPosition ||
      this._highlightPosition.start.line !== position.start.line ||
      this._highlightPosition.end.line !== position.end.line
    ) {
      this._highlightPosition = position;
      this.monacoStore.highlightPaths([position], paths ? 0 : undefined);
    }
  }

  get value() {
    return this.monacoStore.value;
  }

  async dispose() {
    await this.deactivate();
  }

  get activeSymbol() {
    return this.stores.uiStore.activeSymbolNode;
  }

  get _uri() {
    const {uri: e, spec: t = ''} = this.node;

    try {
      return monaco.Uri.from({
        scheme: 'file',
        path: e,
        query: 'oas3.1',
      }).toString();
    } catch (n) {
      console.error('Could not create monaco URI', n);
      return `file:${e}?${t}`;
    }
  }

  deactivateMonaco() {
    if (this.isMonacoActivated) {
      this.isMonacoActivated = false;
    }
  }

  static diagnosticsToDecoration(e) {
    const t = e.range ? e.range.start.line + 1 : 0;
    const n = e.range ? e.range.start.character + 1 : 0;

    return {
      range: new monaco.Range(t, n, t, n),

      options: {
        glyphMarginClassName:
          'MonacoGlyphDecoration ' + DiagnosticSeverityClassNameMap[e.severity],

        glyphMarginHoverMessage: {
          value: e.message,
        },
      },
    };
  }

  static symbolToDecoration({range: e}) {
    const t = e ? e.start.line + 1 : 0;
    const n = e ? e.start.character + 1 : 0;
    const r = e ? e.end.line + 1 : 0;
    const i = e ? e.end.character + 1 : 0;

    return {
      range: new monaco.Range(t, n, r, i),

      options: {
        isWholeLine: true,
        linesDecorationsClassName: 'MonacoLineDecoration',
      },
    };
  }

  async _setMonacoDeltaDecorations(e, t = []) {
    if (this.monacoCodeStoreEditor) {
      //const n = t.map(Ya.diagnosticsToDecoration)
      //if (e) {
      //const t = await this._getSymbolLocation(e)
      //if (t) {
      //n.unshift(Ya.symbolToDecoration(t))
      //}
      //}
      //this._deltaDecorations = this.monacoCodeStoreEditor.deltaDecorations(this._deltaDecorations, n)
    }
  }

  replaceContent(e) {
    const t = this.monacoCodeStore.model.getFullModelRange();

    this.monacoCodeStore.model.pushEditOperations(
      [],
      [
        {
          range: t,
          text: e,
        },
      ],
      [],
    );
  }

  refresh() {
    if (this.monacoCodeStore.model.getValue() !== this.node.data.parsed) {
      const value = yaml.dump(this.node.data.parsed, {
        noRefs: true,
      });
      this.monacoCodeStore.model.setValue(value || '');
    }

    this.monacoCodeStore.model.setEOL(monaco.editor.EndOfLineSequence.LF);
  }

  undo() {
    var e;

    if (!((e = this.monacoCodeStore.editor) === null || e === undefined)) {
      e.trigger('monaco', 'undo', null);
    }
  }

  redo() {
    var e;

    if (!((e = this.monacoCodeStore.editor) === null || e === undefined)) {
      e.trigger('monaco', 'redo', null);
    }
  }
}

export default MonacoEditorStore;
