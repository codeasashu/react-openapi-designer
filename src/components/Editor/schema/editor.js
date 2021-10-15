import React from 'react';
//import PropTypes from 'prop-types';
import classnames from 'classnames';
import {observer} from 'mobx-react-lite';
import {
  get,
  set,
  unset,
  has,
  isEmpty,
  cloneDeep,
  clone,
  merge,
  pick,
  pullAt,
  intersection,
  map,
} from 'lodash';
import {SchemaContext} from '../../Tree/context';
import TreeList from '../../Tree/List';
import {basename, extname} from '../../../Stores/schema/utils';
import SchemaRow from './row';
//import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
//import {TabList, TabPanel, Tabs} from 'react-tabs';
//import {Button, Icon} from '@blueprintjs/core';
//import Editor from './editor';
//import {StoresContext} from '../../Tree/context';
//import GenerateSchema from '../../../generate-schema';
const os = ['object', 'array'];

const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

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

const ki = / - copy( \d+)?$/;
const is = ['allOf', 'oneOf', 'anyOf'];

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));

function Ai(e, t, n) {
  let {newName: r, ext: i} = (n == null ? undefined : n.ignoreExtension)
    ? {
        newName: basename(t, true),
        ext: extname(t),
      }
    : {
        newName: t,
        ext: '',
      };

  const o = String(r).replace(ki, '');
  let a = 0;

  do {
    r = `${o} - copy${a++ == 0 ? '' : ' ' + a}`;
  } while (e.includes(r + i));

  return r + i;
}

const SchemaEditor = observer((props) => {
  const {
    store,
    rootName,
    getRefLabel,
    shouldRenderGoToRef,
    whitelistTypes,
    maxRows,
    className,
    innerClassName,
    customRowActionRenderer,
    refSelector,
  } = props;

  const transformed = store.transformed; //h
  const updateTransformed = store.updateTransformed; //f
  const treeStore = store.treeStore; //p

  const handleUpdateTransformed = React.useCallback(
    (e, t) => {
      //g
      updateTransformed('set', e, t);
    },
    [updateTransformed],
  );

  const propsChangeHandler = React.useCallback(
    (e, t) => {
      let n = e.length ? get(transformed, e) : transformed;
      n = cloneDeep(pick(n, ls));
      merge(n, t);
      updateTransformed('set', e, n);
    },
    [transformed, updateTransformed],
  );

  const removeHandler = React.useCallback(
    (e) => {
      const t = cloneDeep(transformed);
      const n = clone(e);
      const r = n.pop();
      pullAt(get(t, n), Number(r));
      updateTransformed('set', [], t);
    },
    [transformed, updateTransformed],
  );

  const addHandler = React.useCallback(
    (e, t, n, r) => {
      let i;
      let o = n;

      if (r) {
        o = o.concat(r);
      }

      if (t) {
        o = o.concat('0');
      }

      i = fs(is, e)
        ? {
            type: 'object',
            properties: {},
          }
        : {
            type: 'string',
          };

      o = fs(is, t)
        ? o.concat(t)
        : fs(is, e)
        ? o.concat(e)
        : o.concat('children');
      const a = cloneDeep(get(transformed, o)) || [];
      a.push(i);
      updateTransformed('set', o, a);
    },
    [updateTransformed, transformed],
  );

  const swapHandler = React.useCallback(
    (e, t, n) => {
      const r = e.slice(0, e.length - 1);
      const i = get(transformed, r).slice();
      i[n] = i.splice(t, 1, i[n])[0];
      updateTransformed('set', r, i);
    },
    [updateTransformed, transformed],
  );

  const cloneHandler = React.useCallback(
    (e) => {
      const t = e.slice(0, e.length - 1);
      const n = get(transformed, t).slice();
      const r = n[e[e.length - 1]];
      const i = cloneDeep(r);
      n.splice(n.indexOf(r), 0, i);

      if ('name' in r) {
        r.name = Ai(map(n, 'name'), r.name);
      }

      updateTransformed('set', t, n);
    },
    [updateTransformed, transformed],
  );

  const typeChangeHandler = React.useCallback(
    (e, t, n, r, i, o, a) => {
      Ja(
        {
          schema: transformed,
          onChange: updateTransformed,
        },
        e,
        t,
        n,
        r,
        i,
        o,
        a,
      );
    },
    [transformed, updateTransformed],
  );

  const rowRenderer = React.useCallback(
    (e, rowOptions) =>
      React.createElement(
        SchemaRow,
        Object.assign(
          {
            node: e,
          },
          e.metadata,
          e.metadata !== undefined &&
            e.metadata.refPath !== null && {
              refPath: String(e.metadata.refPath),
            },
          {
            rowOptions,
            store,
            customRowActionRenderer,
            refSelector,
            rootName,
            whitelistTypes,
            getRefLabel,
            shouldRenderGoToRef,
            addHandler,
            removeHandler,
            changeHandler: handleUpdateTransformed,
            typeChangeHandler,
            propsChangeHandler,
            isAutoFocusBlocked: store.isAutoFocusBlocked,
            setAutoFocusBlocked: (e) => (store.isAutoFocusBlocked = e),
            swapHandler,
            cloneHandler,
          },
        ),
      ),
    [
      store,
      customRowActionRenderer,
      refSelector,
      rootName,
      whitelistTypes,
      getRefLabel,
      shouldRenderGoToRef,
      addHandler,
      removeHandler,
      handleUpdateTransformed,
      typeChangeHandler,
      propsChangeHandler,
      swapHandler,
      cloneHandler,
    ],
  );

  return (
    <SchemaContext.Provider value={store}>
      <TreeList
        striped
        className={classnames('JsonSchemaEditor', className)}
        innerClassName={innerClassName}
        interactive={false}
        store={treeStore}
        rowRenderer={rowRenderer}
        maxRows={maxRows !== undefined ? maxRows + 0.5 : maxRows}
      />
    </SchemaContext.Provider>
  );
});

export default SchemaEditor;
