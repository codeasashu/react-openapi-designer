import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
import {StoresContext} from '../../Context';
import TreeList from '../../Tree/List';
import SchemaRow from './row';
import {basename, extname} from '../../../utils/tree';

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

const Schema = ({
  relativeJsonPath,
  shouldRenderGoToRef,
  getRefLabel,
  refSelector,
  rootName,
  whitelistTypes,
  customRowActionRenderer,
  ...props
}) => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNodeId} = stores.uiStore;
  const storeId = relativeJsonPath
    ? [activeSourceNodeId, ...relativeJsonPath].join('/')
    : activeSourceNodeId;

  const store = stores.jsonSchemaCollection.lookup(storeId, {
    id: storeId,
    relativeJsonPath,
    sourceNodeId: activeSourceNodeId,
  });

  console.log('store11', store.store.treeStore);

  const swapHandler = (e, t, n) => {
    const r = e.slice(0, e.length - 1);
    const i = get(store.transformed, r).slice();
    i[n] = i.splice(t, 1, i[n])[0];
    store.updateTransformed('set', r, i);
  };

  const cloneHandler = (e) => {
    const t = e.slice(0, e.length - 1);
    const n = get(store.transformed, t).slice();
    const r = n[e[e.length - 1]];
    const i = cloneDeep(r);
    n.splice(n.indexOf(r), 0, i);

    if ('name' in r) {
      r.name = Ai(map(n, 'name'), r.name);
    }

    store.updateTransformed('set', t, n);
  };

  const typeChangeHandler = (e, t, n, r, i, o, a) => {
    console.log('propsChangeHandler', e, t, n, r, i, o, a);
  };

  const propsChangeHandler = (path, updatedSchema) => {
    let schema = path.length ? get(store.transformed, path) : store.transformed;
    schema = cloneDeep(pick(schema, ls));
    merge(schema, updatedSchema);
    store.updateTransformed('set', path, schema);
  };

  const changeHandler = (e, t) => {
    store.updateTransformed('set', e, t);
  };

  const removeHandler = (e) => {
    const t = cloneDeep(store.transformed);
    const n = clone(e);
    const r = n.pop();
    pullAt(get(t, n), Number(r));
    store.updateTransformed('set', [], t);
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
    const a = cloneDeep(get(store.transformed, o)) || [];
    a.push(i);
    store.updateTransformed('set', o, a);
  };

  const rowRenderer = (node, rowOptions) => {
    return (
      <SchemaRow
        node={node}
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
      innerPadding={15}
      initialScrollOffset={0}
      autoSize={true}
    />
  );
};

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
