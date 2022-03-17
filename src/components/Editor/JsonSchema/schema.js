import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import {
  get,
  clone,
  cloneDeep,
  pullAt,
  map,
  pick,
  merge,
  intersection,
} from 'lodash';
import TreeList from '../../Tree/List';
import SchemaRow from './row';
import {basename, extname} from '../../../utils/tree';
import Ja from '../../../utils/oas/ja';

const is = ['allOf', 'oneOf', 'anyOf'];
const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const ki = / - copy( \d+)?$/;
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

const Schema = observer(
  ({
    shouldRenderGoToRef,
    getRefLabel,
    refSelector,
    rootName,
    whitelistTypes,
    customRowActionRenderer,
    ...props
  }) => {
    const store = props.store;

    const swapHandler = (path, originalIndex, newIndex) => {
      const exceptLast = path.slice(0, path.length - 1);
      const parent = get(store.store.transformed, exceptLast).slice();
      parent[newIndex] = parent.splice(originalIndex, 1, parent[newIndex])[0];
      store.store.updateTransformed('set', exceptLast, parent);
    };

    const cloneHandler = (e) => {
      const t = e.slice(0, e.length - 1);
      const n = get(store.store.transformed, t).slice();
      const r = n[e[e.length - 1]];
      const i = cloneDeep(r);
      n.splice(n.indexOf(r), 0, i);

      if ('name' in r) {
        r.name = Ai(map(n, 'name'), r.name);
      }

      store.store.updateTransformed('set', t, n);
    };

    const typeChangeHandler = (
      e,
      type,
      selectedTypes,
      path,
      subtype,
      selectedSubTypes,
      selectedRefPath,
    ) => {
      // (e, t, n, r, i, o, a) => {
      console.log(
        'typeChangeHandler',
        e,
        type,
        selectedTypes,
        path,
        subtype,
        selectedSubTypes,
        selectedRefPath,
      );
      Ja(
        {
          schema: store.store.transformed,
          onChange: store.store.updateTransformed,
        },
        e,
        type,
        selectedTypes,
        path,
        subtype,
        selectedSubTypes,
        selectedRefPath,
      );
    };

    const propsChangeHandler = (path, updatedSchema) => {
      let schema = path.length
        ? get(store.store.transformed, path)
        : store.store.transformed;
      schema = cloneDeep(pick(schema, ls));
      merge(schema, updatedSchema);
      store.store.updateTransformed('set', path, schema);
    };

    const changeHandler = (e, t) => {
      store.store.updateTransformed('set', e, t);
    };

    const removeHandler = (e) => {
      const t = cloneDeep(store.store.transformed);
      const n = clone(e);
      const r = n.pop();
      pullAt(get(t, n), Number(r));
      store.store.updateTransformed('set', [], t);
    };

    const addHandler = (e, t, n, r) => {
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
      const a = cloneDeep(get(store.store.transformed, o)) || [];
      console.log('newNode11', i, a, o);
      a.push(i);
      store.store.updateTransformed('set', o, a);
    };

    const rowRenderer = (node, rowOptions) => {
      return (
        <SchemaRow
          node={node}
          {...node.metadata}
          rowOptions={rowOptions}
          store={store}
          customRowActionRenderer={customRowActionRenderer}
          refSelector={refSelector}
          rootName={rootName}
          whitelistTypes={whitelistTypes}
          getRefLabel={getRefLabel}
          shouldRenderGoToRef={shouldRenderGoToRef}
          addHandler={addHandler}
          removeHandler={removeHandler}
          changeHandler={changeHandler}
          typeChangeHandler={typeChangeHandler}
          propsChangeHandler={propsChangeHandler}
          isAutoFocusBlocked={store.isAutoFocusBlocked}
          setAutoFocusBlocked={(e) => (store.isAutoFocusBlocked = e)}
          swapHandler={swapHandler}
          cloneHandler={cloneHandler}
        />
      );
    };

    return (
      <TreeList
        store={store.store.treeStore}
        generateContextMenu={() => console.log('generateContextMenu')}
        rowRenderer={rowRenderer}
        className={classnames('SidebarTreeList', props.className)}
        rowHeight={() => 30}
        initialScrollOffset={0}
      />
    );
  },
);

Schema.propTypes = {
  relativeJsonPath: PropTypes.array,
  props: PropTypes.any,
  shouldRenderGoToRef: PropTypes.bool,
  getRefLabel: PropTypes.func,
  refSelector: PropTypes.func,
  rootName: PropTypes.string,
  whitelistTypes: PropTypes.array,
  customRowActionRenderer: PropTypes.func,
};

export default Schema;
