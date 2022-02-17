import {
  intersection,
  get,
  set,
  unset,
  pick,
  cloneDeep,
  has,
  isEmpty,
} from 'lodash';

const is = ['allOf', 'oneOf', 'anyOf'];
const os = ['object', 'array'];
const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);
const xs = {
  common: ['deprecated', 'enum', 'format', 'example', 'behavior'],
  number: [
    'minimum',
    'maximum',
    'multipleOf',
    'exclusiveMinimum',
    'exclusiveMaximum',
  ],
  integer: [
    'minimum',
    'maximum',
    'multipleOf',
    'exclusiveMinimum',
    'exclusiveMaximum',
  ],
  string: ['minLength', 'maxLength', 'pattern'],
  array: ['uniqueItems', 'maxItems', 'minItems'],
  object: ['additionalProperties', 'minProperties', 'maxProperties'],
};

const Cs = (e = {}, t = []) => {
  let n = e;

  if (!isEmpty(t)) {
    n = get(e, t, {});
  }

  let {type: r = []} = n;

  if (!Array.isArray(r)) {
    r = [r];
  }

  for (const [i, o] of Object.entries(xs)) {
    if (!r.includes(i) && i !== 'common') {
      for (const r of o) {
        if (has(n, r)) {
          unset(e, t.concat(r));
        }
      }
    }
  }

  return e;
};

const Ja = (e, t, n, r, i, o, a, s) => {
  let u = t || cloneDeep(e.schema) || {};
  const c = fs(is, n);
  const l = fs(is, r);
  const d = fs(os, n);
  const h = fs(os, r);
  const f = !t && i.length === 0;
  const p = n === '$ref';
  const g = r === '$ref';

  if (r !== n) {
    if (l) {
      if (c) {
        const e = get(u, i.concat([n]));
        set(u, i.concat([r]), e);
      } else if (d) {
        const e = get(u, i.concat(['children'])) || [];

        set(u, i.concat([r]), [
          {
            children: e,
            type: n,
          },
        ]);
      } else {
        const e = pick(
          get(u, i, {}),
          'name',
          'description',
          'default',
          'deprecated',
        );
        e[r] = [];

        if (f) {
          u = e;
        } else {
          set(u, i, e);
        }
      }

      unset(u, i.concat('type'));
    } else if (h) {
      if (c && r === 'object') {
        const e = get(u, i.concat([n, '0', 'children']));
        set(u, i.concat(['children']), e);
      }

      set(u, i.concat(['type']), r);
    } else {
      if (!g) {
        if (r) {
          set(u, i.concat(['type']), r);
        } else {
          unset(u, i.concat(['type']));
        }
      }
    }

    if (p && !ps('$ref', r)) {
      unset(u, i.concat(['$ref']));
    }

    if (c) {
      unset(u, i.concat([n]));
    }

    if (!(!d || h || fs(['object'], r))) {
      unset(u, i.concat(['children']));
    }

    Cs(u, i);
  }

  if (g && !a) {
    set(u, i.concat(['$ref']), String(s != null ? s : ''));
    unset(u, i.concat(['type']));
  }

  if (a) {
    Ja(e, u, o, a, i.concat(['children', '0']), null, null, s);
  } else {
    if (!fs(['object'], r)) {
      unset(u, i.concat(['children']));
    }
  }

  if (t) {
    return u;
  } else {
    return e.onChange('set', [], u);
  }
};

export default Ja;
