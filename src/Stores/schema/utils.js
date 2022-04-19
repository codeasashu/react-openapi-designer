import {
  isEmpty,
  map,
  includes,
  merge,
  clone,
  uniq,
  cloneDeep,
  intersection,
} from 'lodash';

export function Ts(e) {
  return Array.from(vs(e, [], 0, 0, {}));
}

export const basename = function (e, t) {
  var n = (function (e) {
    if (typeof e != 'string') {
      e += '';
    }

    var t;
    var n = 0;
    var r = -1;
    var o = true;

    for (t = e.length - 1; t >= 0; --t) {
      if (e.charCodeAt(t) === 47) {
        if (!o) {
          n = t + 1;
          break;
        }
      } else {
        if (r === -1) {
          o = false;
          r = t + 1;
        }
      }
    }

    if (r === -1) {
      return '';
    } else {
      return e.slice(n, r);
    }
  })(e);

  if (t && t === n.substr(t.length * -1)) {
    n = n.substr(0, n.length - t.length);
  }

  return n;
};

export const extname = function (e) {
  if (typeof e != 'string') {
    e += '';
  }

  var t = -1;
  var n = 0;
  var r = -1;
  var o = true;
  var i = 0;

  for (var a = e.length - 1; a >= 0; --a) {
    var s = e.charCodeAt(a);

    if (s !== 47) {
      if (r === -1) {
        o = false;
        r = a + 1;
      }

      if (s === 46) {
        if (t === -1) {
          t = a;
        } else {
          if (i !== 1) {
            i = 1;
          }
        }
      } else {
        if (t !== -1) {
          i = -1;
        }
      }
    } else if (!o) {
      n = a + 1;
      break;
    }
  }

  if (
    t === -1 ||
    r === -1 ||
    i === 0 ||
    (i === 1 && r - 1 === t && n + 1 === t)
  ) {
    return '';
  } else {
    return e.slice(t, r);
  }
};

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
        ? c
        : r.hasOwnProperty('$ref')
        ? '$ref'
        : r.type;
    f = r.enum;
    p = r.format;

    if (y === '$ref') {
      b = r.$ref;
    } else {
      w = Object(S.omit)(r, ls);
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

  _ = Object(S.omit)(e, ls);
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

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const Es = ['type', 'types', 'description', 'example', 'pattern', 'default'];
const Ds = (e, t) => (e instanceof Array ? includes(e, t) : t === e);

const js = (e) => {
  let t;

  if (e.allOf) {
    t = 'allOf';
  } else {
    if (e.anyOf) {
      t = 'anyOf';
    } else {
      if (e.oneOf) {
        t = 'oneOf';
      }
    }
  }

  return t;
};

export const Transformer = (e) => ({
  _jsonSchemaIsRequired: (e = {}, t) => includes(e.required, t),

  _cleanJsonSchema(t = {}) {
    if (e === 'oas2_0' && t['x-deprecated']) {
      t.deprecated = t['x-deprecated'];
      delete t['x-deprecated'];
    }

    if ((e === 'oas2_0' && t['x-nullable']) || (e === 'oas3_0' && t.nullable)) {
      if (t.type) {
        const e = Array.isArray(t.type) ? t.type : [t.type];
        t.type = uniq([...e, 'null']);
      } else {
        t.type = 'null';
      }

      delete t[e === 'oas2_0' ? 'x-nullable' : 'nullable'];
    }

    if (e === 'oas3_1') {
      if (typeof t.exclusiveMinimum == 'number' && t.minimum === undefined) {
        t.minimum = t.exclusiveMinimum;
        t.exclusiveMinimum = true;
      }

      if (typeof t.exclusiveMaximum == 'number' && t.maximum === undefined) {
        t.maximum = t.exclusiveMaximum;
        t.exclusiveMaximum = true;
      }
    }

    return t;
  },

  _reduceJsonSchema(e = {}) {
    let t = {};

    if ((e = this._cleanJsonSchema(e)).type) {
      t.type = e.type;
    }

    if (e.$ref) {
      t.$ref = e.$ref;
    } else if (e.type === 'object' || e.properties || e.patternProperties) {
      t = clone(e);
      t.type = t.type || 'object';
      t.children = [];
      let n = e.properties || [];

      if (e.patternProperties) {
        n = n ? merge(e.patternProperties, n) : e.patternProperties;
      }

      for (const r in n) {
        if (!Object.prototype.hasOwnProperty.call(n, r)) {
          continue;
        }

        const i = this._toStoplightSchema(n[r]);
        i.name = r;

        if (this._jsonSchemaIsRequired(e, r)) {
          i.required = true;
        }

        t.children.push(i);
      }
    } else {
      if (e.type === 'array' || e.items) {
        t = clone(e);
        t.type = t.type || 'array';

        if (Object.keys(e.items || []).length) {
          t.children = [this._toStoplightSchema(e.items)];
        } else {
          t.children = [];
        }
      } else {
        t = e;
      }
    }

    delete t.properties;
    delete t.patternProperties;
    delete t.items;
    delete t.required;
    return t;
  },

  _reduceJsonSchemaCombination(e, t) {
    const n = [];

    for (let r of e) {
      r = this._reduceJsonSchema(r);

      if (t) {
        r.type = t;
      }

      n.push(r);
    }

    return n;
  },

  _toStoplightSchema(e) {
    let t = e;

    if (isEmpty(t)) {
      return {};
    }

    let n = js(e);

    if (n) {
      const r = e.type;
      t[n] = this._reduceJsonSchemaCombination(e[n], r);
      delete t.type;
    } else {
      t = this._reduceJsonSchema(e);
    }

    if (t.readOnly === true) {
      t.behavior = 'Read Only';
      delete t.readOnly;
    }

    if (t.writeOnly === true) {
      t.behavior = 'Write Only';
      delete t.writeOnly;
    }

    return t;
  },

  toStoplightSchema(e) {
    if (typeof e == 'string') {
      e = JSON.parse(e);
    }

    return this._toStoplightSchema(cloneDeep(e));
  },

  _cleanStoplightSchema: (t = {}) => (
    e === 'oas2_0' &&
      t.deprecated &&
      ((t['x-deprecated'] = t.deprecated), delete t.deprecated),
    e !== 'oas3_1' &&
      (t.type === 'null'
        ? ((t[e === 'oas2_0' ? 'x-nullable' : 'nullable'] = true),
          delete t.type)
        : Array.isArray(t.type) &&
          t.type.includes('null') &&
          (t.type.splice(t.type.indexOf('null'), 1),
          (t[e === 'oas2_0' ? 'x-nullable' : 'nullable'] = true),
          t.type.length === 0
            ? delete t.type
            : t.type.length === 1 && (t.type = t.type[0]))),
    e === 'oas3_1' &&
      (typeof t.exclusiveMinimum == 'boolean' &&
        (t.exclusiveMinimum
          ? ((t.exclusiveMinimum = t.minimum), delete t.minimum)
          : delete t.exclusiveMinimum),
      typeof t.exclusiveMaximum == 'boolean' &&
        (t.exclusiveMaximum
          ? ((t.exclusiveMaximum = t.maximum), delete t.maximum)
          : delete t.exclusiveMaximum)),
    t
  ),

  _reduceStoplightSchema(e = {}) {
    let t = {};

    if ((e = this._cleanStoplightSchema(e)).type) {
      t.type = e.type;
    }

    if (e.$ref) {
      t.$ref = e.$ref;
    } else if (Ds(e.type, 'object')) {
      t = e;
      t.properties = {};
      t.patternProperties = {};
      t.required = [];

      if (e.children) {
        for (const n of e.children) {
          if (!n) {
            continue;
          }

          if (n.required) {
            t.required.push(n.name);
          }

          const e = this._toJsonSchema(clone(n));
          delete e.name;
          const r = n.name || '';
          let i = t.properties;

          if (r.startsWith('^')) {
            i = t.patternProperties;
          }

          i[r] = e;
        }
      }

      if (!Object.keys(t.properties).length) {
        delete t.properties;
      }

      if (!Object.keys(t.patternProperties).length) {
        delete t.patternProperties;
      }

      delete t.items;
    } else if (Ds(e.type, 'array')) {
      t = e;

      if (e.children instanceof Array) {
        if (e.children.length > 1) {
          t.items = [];

          for (const n of e.children) {
            if (n.required) {
              t.required.push(n.name);
            }

            const e = this._toJsonSchema(clone(n));
            delete e.name;
            t.items.push(e);
          }
        } else {
          t.items = this._toJsonSchema(e.children[0]);
        }
      } else {
        t.items = this._toJsonSchema(e.children);
      }

      delete t.properties;
      delete t.patternProperties;
    } else {
      let n = js(e);

      if (n) {
        t[n] = this._reduceStoplightSchemaCombination(e[n]);
      } else {
        t = e;
        delete t.required;
      }
    }

    if (isEmpty(t.required)) {
      delete t.required;
    }

    delete t.children;
    delete t.name;
    delete t._active;

    for (const e in t) {
      if (
        typeof t[e] == 'string' &&
        (!Es.includes(e) ||
          (e === 'default' &&
            fs(['boolean', 'integer', 'number', 'null'], t.type)))
      ) {
        try {
          t[e] = JSON.parse(t[e]);
        } catch (_) {
          // pass
        }
      }
    }

    return t;
  },

  _reduceStoplightSchemaCombination(e = []) {
    const t = [];

    for (const n of e) {
      t.push(this._reduceStoplightSchema(n));
    }

    return t;
  },

  _toJsonSchema(e) {
    let t = e;

    if (!t) {
      return {};
    }

    let n = js(t);

    if (n) {
      t[n] = this._reduceStoplightSchemaCombination(t[n]);
      const e = map(t[n], 'type');

      if (uniq(e).length === 1) {
        t.type = e[0];

        for (const e of t[n]) {
          delete e.type;
        }
      }

      delete t.required;
      delete t._active;
    } else {
      t = this._reduceStoplightSchema(t);
    }

    if (t.behavior === 'Write Only') {
      t.writeOnly = true;
      delete t.readOnly;
    }

    if (t.behavior === 'Read Only') {
      t.readOnly = true;
      delete t.writeOnly;
    }

    delete t.behavior;
    return t;
  },

  toJsonSchema(e) {
    return this._toJsonSchema(cloneDeep(e));
  },
});
