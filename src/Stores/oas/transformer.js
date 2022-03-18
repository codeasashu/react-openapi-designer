import {
  clone,
  cloneDeep,
  map,
  merge,
  uniq,
  isEmpty,
  includes,
  intersection,
} from 'lodash';

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));

const Ds = (e, t) => (e instanceof Array ? includes(e, t) : t === e);

const Es = ['type', 'types', 'description', 'example', 'pattern', 'default'];

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

const Transformer = (e) => {
  return {
    _jsonSchemaIsRequired: (e = {}, t) => includes(e.required, t),

    _cleanJsonSchema(t = {}) {
      if (e === 'oas2_0' && t['x-deprecated']) {
        t.deprecated = t['x-deprecated'];
        delete t['x-deprecated'];
      }

      if (
        (e === 'oas2_0' && t['x-nullable']) ||
        (e === 'oas3_0' && t.nullable)
      ) {
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

    _cleanStoplightSchema: (t = {}) => {
      return (
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
      );
    },

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
          } catch (e) {
            console.warn(e);
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
  };
};

export default Transformer;
