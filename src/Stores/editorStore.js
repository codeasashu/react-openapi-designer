import {
  flow,
  reaction,
  makeObservable,
  observable,
  computed,
  action,
} from 'mobx';
import monacoEditorStore from './monacoEditorStore';
import {eventTypes, NodeCategories} from '../utils/tree';

class EditorStore {
  _editors = [];
  _activeEditorId;

  constructor(e) {
    makeObservable(this, {
      _editors: observable.shallow,
      _activeEditorId: observable,
      activeEditor: computed,
      assignEditor: action,
    });
    this.stores = e;
    this._editors = {};
    this._positions = {};

    this.doDeactivate = flow(function* () {
      this._activeDisposables.dispose();

      for (const e of Object.keys(this._editors)) {
        yield this._editors[e].dispose();
        delete this._editors[e];
      }

      for (const e of Object.keys(this._positions)) {
        delete this._positions[e];
      }
    }).bind(this);

    this.handleNodeRemoved = flow(function* (e) {
      const t = this._editors[e];

      if (t !== undefined) {
        yield t.dispose();
        delete this._positions[e];
        delete this._editors[e];
      }
    }).bind(this);

    this.handleActiveEditorChange = flow(function* (e) {
      const t = this.stores.uiStore.activeSourceNode;

      if (t != null) {
        if (e) {
          if (e.state !== 'activated') {
            yield e.activate();
          }
        } else {
          const e = new monacoEditorStore(this.stores, t);

          try {
            yield e.activateMonaco();
            const n = this._positions[t.id];

            if (n !== undefined) {
              requestAnimationFrame(() => {
                var t;

                if (
                  !((t = e.monacoCodeStoreEditor) === null || t === undefined)
                ) {
                  t.setPosition(n);
                }
              });

              delete this._positions[t.id];
            }
          } finally {
            this._editors[t.id] = e;
          }
        }
      }
    }).bind(this);

    this.handleActiveSourceNodeChange = flow(function* (e) {
      let t;

      if (
        this.activeEditor &&
        this.activeEditor.state === 'activated' &&
        e &&
        e.id !== this._activeEditorId
      ) {
        yield this.activeEditor.deactivate();
      }

      if (e !== undefined) {
        t = this._editors[e.id];

        if (!t) {
          t = this._editors[e.id] = new monacoEditorStore(this.stores, e);
        }

        if (t.state !== 'isDeactivating') {
          yield t.activateMonaco();
        }

        this._activeEditorId = e.id;
      } else {
        this._activeEditorId = undefined;
      }
    }).bind(this);
  }

  async doActivate() {
    reaction(
      () => this.stores.uiStore.activeSourceNode,
      this.handleActiveSourceNodeChange.bind(this),
      {
        fireImmediately: true,
      },
    );

    reaction(() => this.activeEditor, this.handleActiveEditorChange);

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidPatchSourceNodeProp,
      action((e) => {
        if (e.prop === 'data.parsed') {
          this.refresh();
        }
      }),
    );

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidMoveNode,
      async ({id: e}) => {
        var t;
        var n;
        const r = this.stores.graphStore.getNodeById(e);

        if (NodeCategories.Source !== (r == null ? undefined : r.category)) {
          return;
        }

        const i =
          (n =
            (t = this._editors[e]) === null || t === undefined
              ? undefined
              : t.monacoCodeStoreEditor) === null || n === undefined
            ? undefined
            : n.getPosition();
        await this.handleNodeRemoved(e);

        if (e === this.stores.uiStore.activeSourceNodeId && i != null) {
          this._positions[e] = i;
        }
      },
    );

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidRemoveNode,
      ({id: e}) => {
        this.handleNodeRemoved(e);
      },
    );
  }

  get activeEditor() {
    if (this._activeEditorId !== undefined) {
      return this._editors[this._activeEditorId];
    } else {
      return null;
    }
  }

  refresh() {
    for (const e of Object.values(this._editors)) {
      e.refresh();
    }
  }

  assignEditor(e) {
    if (e.id in this._editors) {
      return this._editors[e.id];
    }

    const t = new monacoEditorStore(this.stores, e);
    this._editors[e.id] = t;
    return t;
  }
}

export default EditorStore;
