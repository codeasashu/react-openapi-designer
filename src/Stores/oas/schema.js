import {makeObservable, computed, observable, reaction, action} from 'mobx';
import {isEmpty, set, omit, unset, intersection} from 'lodash';
import Transformer from './transformer';
import Tree from '../../Tree/Tree';
import TreeState from '../../Tree/State';
import TreeStore from '../../Tree/Store';

const ls = [
  '$ref',
  'type',
  'children',
  '$schema',
  'oneOf',
  'allOf',
  'anyOf',
  'definitions',
];

const is = ['allOf', 'oneOf', 'anyOf'];
const os = ['object', 'array'];
const ss = os.concat(is);

//Object(h.d)([p.observable], As.prototype, "transformed", undefined);
//Object(h.d)([p.observable.ref], As.prototype, "error", undefined);
//Object(h.d)([p.observable], As.prototype, "_lastUpdated", undefined);
//Object(h.d)([p.observable], As.prototype, "_externalUpdate", undefined);
//Object(h.d)([p.observable.ref], As.prototype, "_schema", undefined);
//Object(h.d)([p.observable], As.prototype, "_refLoading", undefined);
//Object(h.d)([p.observable], As.prototype, "_isAutoFocusBlocked", undefined);
//Object(h.d)([p.computed], As.prototype, "refLoading", null);
//Object(h.d)([p.computed], As.prototype, "schema", null);
//Object(h.d)([p.computed], As.prototype, "isAutoFocusBlocked", null);
//Object(h.d)([p.action.bound], As.prototype, "_handleUpdate", null);
//Object(h.d)([p.action.bound], As.prototype, "updateTransformed", null);
//Object(h.d)([p.action.bound], As.prototype, "_updateSchema", null);

class Schema {
  transformed = {};
  _lastUpdated = 0;
  _externalUpdate = false;
  _refLoading = false;
  _isAutoFocusBlocked = false;
  error = null;
  _schema = {};

  constructor(schema, spec) {
    // e = schema, t = spec (oas3_1)
    makeObservable(this, {
      transformed: observable,
      _lastUpdated: observable,
      _externalUpdate: observable,
      _refLoading: observable,
      _isAutoFocusBlocked: observable,
      error: observable.ref,
      _schema: observable.ref,
      refLoading: computed,
      schema: computed,
      isAutoFocusBlocked: computed,
      _handleUpdate: action.bound,
      updateTransformed: action.bound,
      _updateSchema: action.bound,
    });
    this.invalidSchema = null;

    this.transformer = Transformer(spec);
    this.spec = spec;
    this.schema = schema;
    const treeState = new TreeState(); //n

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
      //super.emit(Za.Change, e);
      console.log('emit Change', e);
    }
  }

  _setupReactions() {
    reaction(
      () => this._lastUpdated,
      action(() => {
        //super.emit(Za.Transformed, this.transformed);
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

function Ts(e) {
  return Array.from(vs(e, [], 0, 0, {}));
}

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

function* gs(e, t, n) {
  for (const [r, i] of Object.entries(e)) {
    const e = t.concat([r]);

    yield* vs(i, e, n, Number(r), {
      isCombinerChild: true,
    });
  }
}

const ms = (e) =>
  e.allOf ? 'allOf' : e.anyOf ? 'anyOf' : e.oneOf ? 'oneOf' : null;

function* vs(
  e,
  t,
  n,
  r,
  {
    isArrayChild: i = false,
    isCombinerChild: o = false,
    isLast: a = false,
    parent: s,
  },
) {
  var u;
  var c;

  if (Array.isArray(e)) {
    for (const [t, n] of e.entries()) {
      yield* vs(n, [String(t)], 0, t, {
        isLast: e.length - 1 === t,
        parent: s,
      });
    }

    return;
  }

  let l = [];
  const d = n === 0;

  let {type: h, enum: f, format: p} = e;

  let g = true;
  const m = d ? 'root' : e.name;
  let v;
  let y = null;
  let b = null;
  let _ = {};
  let w = {};
  const M = ms(e);
  const x = {};

  if (M) {
    h = M;
    v = e[M] ? e[M].length : 0;

    if (i) {
      g = false;
    }

    if (g) {
      const r = g ? n + 1 : n;
      l = [...gs(e[M], t.concat(M), r)];
    }
  } else if (ps('object', h)) {
    if (i) {
      g = false;
    }

    v = e.children ? e.children.length : 0;

    if (g && e.children) {
      const r = g ? n + 1 : n;

      for (const [n, i] of e.children.entries()) {
        l.push(
          ...vs(i, t.concat(['children', n]), r, n, {
            isLast: e.children.length - 1 === n,
            parent: x,
          }),
        );
      }
    }
  } else if (ps('array', h)) {
    const r = ((u = e.children) === null || u === undefined ? undefined : u[0])
      ? e.children[0]
      : {};
    y =
      (c = ms(r)) !== null && c !== undefined
        ? c //eslint-disable-next-line no-prototype-builtins
        : r.hasOwnProperty('$ref')
        ? '$ref'
        : r.type;
    f = r.enum;
    p = r.format;

    if (y === '$ref') {
      b = r.$ref;
    } else {
      w = omit(r, ls);
    }

    if (y !== '$ref' && (fs(is, y) || fs(os, y))) {
      l.push(
        ...vs(r, t.concat(['children', '0']), n + 1, 0, {
          isCombinerChild: true,
          parent: x,
        }),
      );

      v = e.children ? e.children.length : 0;
    }
  } else {
    if ((typeof e == 'object' && '$ref' in e) || e.$ref) {
      h = '$ref';
      b = e.$ref;
    }
  }

  _ = omit(e, ls);
  const N = JSON.stringify(t);

  Object.assign(x, {
    id: N,
    level: n,
    name: m,
    canHaveChildren:
      l.length > 0 ||
      (fs(ss, h) && !ps('array', h)) ||
      (fs(ss, y) && y !== null && !ps('array', y)),

    metadata: {
      key: N,
      level: n,
      type: h,
      index: r,
      path: t,
      name: m,
      value: null,
      childCount: v,
      subtype: y,
      refPath: b,
      enumValue: f,
      format: p,
      extraProps: _,
      subtypeExtraProps: w,
      isCombinerChild: o,
      isLast: a,
      parent: s,
    },
  });

  yield x;
  yield* l;
  return l;
}
//const Ls = Object(c.createContext)(new As({}));

export default Schema;
