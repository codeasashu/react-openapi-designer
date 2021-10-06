import React from 'react';
import {isEqual, get, has} from 'lodash';
import {nodeOperations} from './tree';
import {StoresContext} from '../components/Tree/context';

function usePatchOperation() {
  const stores = React.useContext(StoresContext);
  const {activeSourceNode} = stores.uiStore;

  const handlePatch = React.useCallback(
    (path, operations) => {
      const nodeid = activeSourceNode.id;
      if (nodeid !== undefined) {
        stores.graphStore.graph.patchSourceNodeProp(nodeid, path, operations);
      }
    },
    [activeSourceNode && activeSourceNode.id],
  );

  return React.useCallback(
    ((handlePatch, activeSourceNode) => (op, source, destn) => {
      const o = {
        op,
      };

      switch (op) {
        case nodeOperations.Move:
          o.from = source;
          o.path = destn;

          if (isEqual(source, destn)) {
            return;
          }

          break;
        case nodeOperations.Add:
        case nodeOperations.Replace:
          o.path = source;
          o.value = destn;

          if (
            isEqual(get(activeSourceNode, ['data', 'parsed', ...source]), destn)
          ) {
            return;
          }

          break;
        case nodeOperations.Remove:
          o.path = source;

          if (!has(activeSourceNode, ['data', 'parsed', ...source])) {
            return;
          }

          break;
        default:
          return;
      }

      handlePatch('data.parsed', [o]);
    })(handlePatch, activeSourceNode),
    [handlePatch, activeSourceNode && activeSourceNode.id],
  );
}

const getValue = (
  sourceNode,
  relativeJsonPath,
  valueInPath,
  dataProp = ['parsed'],
) => {
  return valueInPath
    ? relativeJsonPath[relativeJsonPath.length - 1]
    : get(sourceNode, ['data', ...dataProp, ...relativeJsonPath]);
};

const getValueFromStore = (relativeJsonPath, valueInPath, dataProp) => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNode} = stores.uiStore;
  return getValue(activeSourceNode, relativeJsonPath, valueInPath, dataProp);
};

export {usePatchOperation, getValueFromStore};
