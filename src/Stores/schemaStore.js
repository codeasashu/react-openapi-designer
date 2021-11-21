import {action, reaction} from 'mobx';
import {unset, set, isEmpty} from 'lodash';
import EventEmitter from '../EventEmitter';
import {Ts, ks} from './schema/utils';
import TreeState from '../Tree/State';
import TreeStore from '../Tree/Store';
import Tree from '../Tree/Tree';
import {eventTypes} from '../datasets/tree';

class SchemaStore extends EventEmitter {
  constructor(e, t) {
    super();
    this.invalidSchema = null;
    this.transformed = {};
    this.error = null;
    this._lastUpdated = 0;
    this._externalUpdate = false;
    this._schema = {};
    this._refLoading = false;
    this._isAutoFocusBlocked = false;
    //this._disposables = new r.DisposableCollection();

    this.dispose = () => {
      this._disposables.dispose();
    };

    this.transformer = ks(t);
    this.spec = t;
    this.schema = e;
    const treeState = new TreeState();

    this.tree = new Tree(
      {
        expanded: (e) => TreeStore.isNodeExpanded(e, treeState.expanded, 4),
      },
      Tree.toTree(Ts(this.transformed)),
    );

    this.treeStore = new TreeStore(this.tree, treeState, {
      defaultExpandedDepth: 4,
    });

    this._setupReactions();
  }

  _onSchemaChange(e) {
    if (!this._externalUpdate) {
      super.emit(eventTypes.StoreEvents.Change, e);
    }
  }

  _setupReactions() {
    reaction(
      () => this._lastUpdated,
      action(() => {
        super.emit(eventTypes.StoreEvents.Transformed, this.transformed);
        this.tree.setRoot(Tree.toTree(Ts(this.transformed)));
      }),
    );

    reaction(() => this._lastUpdated, this._handleUpdate, {
      name: 'updated',
      delay: 500,
    });
  }

  get refLoading() {
    return this._refLoading;
  }

  set refLoading(e) {
    this._refLoading = e;
  }

  get schema() {
    return this._schema;
  }

  get isAutoFocusBlocked() {
    return this._isAutoFocusBlocked;
  }

  set isAutoFocusBlocked(e) {
    this._isAutoFocusBlocked = e;
  }

  set schema(e) {
    this._updateSchema(e, {
      external: true,
    });
  }

  _handleUpdate() {
    if (!this._externalUpdate) {
      this._schema = this.transformer.toJsonSchema(this.transformed);
      this._onSchemaChange(this._schema);
    }
  }

  updateTransformed(e, t, n) {
    switch (((this._externalUpdate = false), e)) {
      case 'set':
        if (isEmpty(t)) {
          this.transformed = n;
        } else {
          set(this.transformed, t, n);
        }

        this._lastUpdated = new Date().getTime();
        break;
      case 'unset':
        unset(this.transformed, t);
        this._lastUpdated = new Date().getTime();
        break;
      default:
        console.warn(`'${e}' transformation not supported by jsonSchemaStore`);
    }
  }

  _updateSchema(e, t = {}) {
    const {external: n, immediate: r} = t;

    try {
      let t = e || {};

      if (typeof t == 'string') {
        t = JSON.parse(t);
      }

      if (JSON.stringify(this.schema) !== JSON.stringify(t)) {
        this._externalUpdate = !!n;
        this._schema = t;
        this.transformed = this.transformer.toStoplightSchema(
          t || '{\n    "type": "object"\n}',
        );

        if (r) {
          this._onSchemaChange(this.schema);
        } else {
          this._lastUpdated = new Date().getTime();
        }
      }

      if (this.error) {
        this.invalidSchema = null;
        this.error = null;
      }
    } catch (t) {
      this.invalidSchema = e;
      this.error = t;
    }
  }
}

//Object(h.d)([p.observable], As.prototype, 'transformed', undefined);
//Object(h.d)([p.observable.ref], As.prototype, 'error', undefined);
//Object(h.d)([p.observable], As.prototype, '_lastUpdated', undefined);
//Object(h.d)([p.observable], As.prototype, '_externalUpdate', undefined);
//Object(h.d)([p.observable.ref], As.prototype, '_schema', undefined);
//Object(h.d)([p.observable], As.prototype, '_refLoading', undefined);
//Object(h.d)([p.observable], As.prototype, '_isAutoFocusBlocked', undefined);
//Object(h.d)([p.computed], As.prototype, 'refLoading', null);
//Object(h.d)([p.computed], As.prototype, 'schema', null);
//Object(h.d)([p.computed], As.prototype, 'isAutoFocusBlocked', null);
//Object(h.d)([p.action.bound], As.prototype, '_handleUpdate', null);
//Object(h.d)([p.action.bound], As.prototype, 'updateTransformed', null);
//Object(h.d)([p.action.bound], As.prototype, '_updateSchema', null);

export default SchemaStore;
//const Ls = Object(c.createContext)(new As({}));
