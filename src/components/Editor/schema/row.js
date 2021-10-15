import React from 'react';
import {
  isEmpty,
  intersection,
  pickBy,
  isEqual,
  compact,
  flattenDeep,
} from 'lodash';
import {eventTypes} from '../../../utils/tree';
import {PropTypes} from 'mobx-react';

const Os = (
  e,
  {type: t, subtype: n, ref: r, extraProps: i, subtypeExtraProps: o},
) => {
  let a = compact(flattenDeep([t]));
  let s = compact(flattenDeep([n]));

  if (a.length === 0) {
    a = null;
  } else {
    if (a.length === 1) {
      a = a[0];
    }
  }

  if (s.length === 0) {
    s = null;
  } else {
    if (s.length === 1) {
      s = s[0];
    }
  }

  let u = r;

  if (!(ps('$ref', t) || ps('$ref', n))) {
    u = null;
  }

  e(a, s, u, i, o);
};

const Is = (e, t) => {
  const n = Object.assign({}, e);
  t = Array.isArray(t) ? t : [t];
  const r = pickBy(n, (e, n) => t.includes(n));

  if (r.enum) {
    n.enum = JSON.parse(r.enum, r.enum);
  } else {
    if (!(r.enum === undefined || r.enum)) {
      delete n.enum;
    }
  }

  if (r.additionalProperties) {
    delete n.additionalProperties;
  }

  if (r.deprecated === false) {
    delete n.deprecated;
  }

  for (const [e, t] of Object.entries(r)) {
    if (!['boolean', 'number'].includes(typeof t) && isEmpty(t)) {
      delete n[e];
    }
  }

  return n;
};
const is = ['allOf', 'oneOf', 'anyOf'];
const os = ['object', 'array'];
const as = ['string', 'number', 'integer', 'boolean', 'null', '$ref'];
const ss = os.concat(is);
const us = as.concat(os);
const cs = ss.concat(as);

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

const ds = [
  'additionalProperties',
  'maxProperties',
  'minProperties',
  'uniqueItems',
  'maxItems',
  'minItems',
  'maxLength',
  'minLength',
  'pattern',
  'maximum',
  'minimum',
  'multipleOf',
  'enum',
  'format',
  'deprecated',
  'behavior',
  'example',
  'default',
];

const hs = {
  text: {
    object: 'text-blue-6 dark:text-blue-4',
    any: 'text-blue-5',
    array: 'text-green-6 dark:text-green-4',
    allOf: 'text-orange-5',
    oneOf: 'text-orange-5',
    anyOf: 'text-orange-5',
    null: 'text-orange-5',
    integer: 'text-red-7 dark:text-red-6',
    number: 'text-red-7 dark:text-red-6',
    boolean: 'text-red-4',
    binary: 'text-green-4',
    string: 'text-green-7 dark:text-green-5',
    $ref: 'text-purple-6 dark:text-purple-4',
  },

  bg: {
    object: 'bg-blue-6',
    any: 'bg-blue-5',
    array: 'bg-green-6',
    allOf: 'bg-orange-5',
    oneOf: 'bg-orange-5',
    anyOf: 'bg-orange-5',
    null: 'bg-orange-5',
    integer: 'bg-red-7',
    number: 'bg-red-7',
    boolean: 'bg-red-4',
    binary: 'bg-green-4',
    string: 'bg-green-7',
    $ref: 'bg-purple-6',
  },
};

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

class SchemaRow extends React.Component {
  constructor() {
    super(...arguments);

    this.handleAdd = (e, t) => {
      const {
        addHandler: n,

        store: {treeStore: r},
      } = this.props;

      const {type: i, subtype: o, path: a} = t;

      if (!this.isExtensible) {
        return;
      }

      const s = i;
      let u = '';
      const c = a;
      let l = [];

      if (fs(ss, o) && !ps('array', o)) {
        u = o;
        l = ['children'];
      }

      r.toggleExpand(e, true);
      return n(s, u, c, l);
    };

    this.handleRefClick = () => {
      var e;

      this.props.store.emit(
        Za.GoToRef,
        String((e = this.props.refPath) !== null && e !== undefined ? e : ''),
      );
    };

    this.handleSaveDetails = (e, t, n, r, i) => {
      const {
        path: o,
        type: a,
        subtype: s,
        refPath: u,
        extraProps: c,
        subtypeExtraProps: l,
        propsChangeHandler: d,
        typeChangeHandler: h,
      } = this.props;

      if (Object(S.isEqual)(l, i)) {
        if (!Object(S.isEqual)(c, r)) {
          d(o, r);
        }
      } else {
        d(o.concat(['children', '0']), i);
      }

      if (!(Object(S.isEqual)(a, e) && Object(S.isEqual)(s, t) && u === n)) {
        h(
          null,
          a,
          e,
          o,
          s,
          t,
          typeof n != 'string' ? (u != null ? u : null) : n,
        );
      }
    };

    this.renderValidationSelector = () => {
      const {
        type: e,
        subtype: t,
        refPath: n,
        extraProps: r,
        subtypeExtraProps: i,
      } = Ps(this.props);

      return React.createElement(Gs, {
        type: e,
        subtype: t,
        extraProps: r,
        subtypeExtraProps: i,
        spec: this.props.store.spec,

        handleUpdateProp: (o, a, s) => {
          let u = {};

          switch (o) {
            case 'extraProps':
              u = r;
              break;
            case 'subtypeExtraProps':
              u = i;
          }

          if (s === '') {
            delete u[a];
          } else {
            u[a] = s;
          }

          Os(this.handleSaveDetails, {
            type: e,
            subtype: t,
            ref: n,
            extraProps: o === 'extraProps' ? Is(u, a) : r,
            subtypeExtraProps: o === 'subtypeExtraProps' ? Is(u, a) : i,
          });

          this.props.store.emit(eventTypes.StoreEvents.ExtraPropUpdate, {
            field: a,
            value: s,
          });
        },
      });
    };
  }

  shouldComponentUpdate(e) {
    return !isEqual(e, this.props);
  }

  isExtensible(e, t) {
    if (e) {
      if (!(fs(ss, e) && !ps('array', e))) {
        if (fs(ss, t)) {
          return !ps('array', t);
        }
      }
    }
  }
}

SchemaRow.propTypes = {
  store: PropTypes.object,
};

export default SchemaRow;
