import React from 'react';
import {isEqual, get, has, compact} from 'lodash';
import {NodeCategories, nodeOperations, NodeTypes} from '../datasets/tree';
import {StoresContext} from '../components/Context';
import {replaceHash} from './schema';
import {decodeUriFragment} from '../utils';

export const usePatchOperationAt = (path) => {
  const patchSourceNode = usePatchOperation();

  return React.useCallback(
    (operation, jsonPath) => {
      let initialPath = jsonPath;

      if (nodeOperations.Move === operation) {
        initialPath = path.slice(0, -1).concat(jsonPath);
      }

      patchSourceNode(operation, path, initialPath);
    },
    [path, patchSourceNode],
  );
};

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

export const getValue = (
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
  const values = getValue(
    activeSourceNode,
    relativeJsonPath,
    valueInPath,
    dataProp,
  );
  return Array.isArray(values) ? compact(values) : values;
};

const usePrevious = (value) => {
  const prev = React.useRef(value);

  React.useEffect(() => {
    prev.current = value;
  });

  return prev.current;
};

export {usePatchOperation, getValueFromStore, usePrevious};

const refMenus = () => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNode} = stores.uiStore;
  const graphStore = stores.graphStore;
  const nodesString = Object.keys(graphStore.graph.dom.nodes).toString();

  return React.useMemo(() => {
    let menus;
    return () => {
      if (!activeSourceNode) {
        return [];
      }

      if (menus) {
        return menus;
      }

      const menuItems = Object.values(graphStore.graph.dom.nodes)
        .filter(
          (t) =>
            t.category === NodeCategories.SourceMap &&
            t.type === NodeTypes.Model,
        )
        .reduce((prev, node) => {
          const nodeLabel =
            node !== activeSourceNode
              ? ((activeSourceNode, node) => {
                  // r
                  let parentNodeUri; //n
                  let nodeUri; // r

                  switch (node.category) {
                    case NodeCategories.SourceMap:
                      parentNodeUri = node.parentSourceNode.uri;
                      nodeUri = node.uri.replace(parentNodeUri, '');
                  }

                  if (!parentNodeUri) {
                    return '';
                  }

                  let formattedNodeUri = nodeUri ? `#${nodeUri}` : ''; //o

                  // if (!formattedNodeUri.startsWith('.')) {
                  //   formattedNodeUri = './' + formattedNodeUri;
                  // }

                  if (formattedNodeUri.startsWith('./' + prev.path)) {
                    formattedNodeUri = formattedNodeUri.replace(
                      './' + prev.path,
                      '',
                    );
                  }

                  return formattedNodeUri;
                })(activeSourceNode, node)
              : node.path;

          const nodePath =
            (NodeCategories.Source === node.category
              ? 'Schemas'
              : ((node) => {
                  //i
                  switch (node.category) {
                    case NodeCategories.Source:
                    case NodeCategories.Virtual:
                      return node.path;
                    case NodeCategories.SourceMap:
                      return node.parentSourceNode.path;
                  }
                })(node)) || 'Other';

          if (!Object.prototype.hasOwnProperty.call(prev, nodePath)) {
            prev[nodePath] = [];
          }

          prev[nodePath].push({
            label:
              NodeCategories.Source === node.category
                ? nodeLabel
                : decodeUriFragment(replaceHash(nodeLabel)),
            value: nodeLabel,
            id: `${node.id}+${nodeLabel}`,
          });

          return prev;
        }, {});

      menus = Object.entries(menuItems).map(([label, items]) => ({
        label,
        items,
      }));

      return menus;
    };
  }, [activeSourceNode, graphStore.graph.dom.nodes, nodesString]);
};

function inString(e, t) {
  let n = e || '';
  let r = t || '';
  n = n.toLowerCase();
  r = r.toLowerCase();
  return r.includes(n);
}

function nodeNameMatcher(node, searchTerm) {
  // e, t
  if (!node) {
    return [];
  }

  if (!searchTerm) {
    return node;
  }

  if (!Array.isArray(node)) {
    const matchingItems =
      node.items &&
      node.items.filter(
        (item) => item.value && inString(searchTerm, String(item.value)),
      );

    if (matchingItems && matchingItems.length) {
      return Object.assign(Object.assign({}, node), {
        items: matchingItems,
      });
    } else {
      return null;
    }
  }

  return node.map((n) => nodeNameMatcher(n, searchTerm)).filter(Boolean);
}

export const getRefProviders = () => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNode} = stores.uiStore;
  const modelMenus = refMenus();

  return [
    {
      name: 'External',
      default: true,
      getRefLabel: (e) => e || '',
      getItemLabel: (e) => e.label || e.value || '',
    },
    {
      name: 'This File',
      //matcher: (e) => e && e.startsWith('#'),
      matcher: (e) => e === '' || (e !== undefined && /\.?\.[/\\]/.test(e)),
      async handleSearch(e) {
        if (!activeSourceNode) {
          return [];
        }

        const t = nodeNameMatcher(
          modelMenus().find((node) => node.path === e.label),
          e,
        );
        if (t === null || Array.isArray(t)) {
          return [];
        } else {
          return t.items;
        }
      },
      getRefLabel: (e) => e || '',
      getItemLabel: (e) => e.label || e.value || '',
    },
  ];
};
