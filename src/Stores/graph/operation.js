import {get, set, isEqual, isObject, pull, remove, unset} from 'lodash';
import produce from 'immer';
import SourceMapNode from './sourceNode';
import VirtualNode from './virtualNode';
import GraphNode from './graphNode';
import {
  nodeOperations,
  NodeCategories,
  isHyphenOnly,
  eventTypes,
} from '../../utils/tree';
import {decodeUriFragment, renameObjectKey} from '../../utils';
import {observe} from 'mobx';
//function handleOperation(e, t, n) { t = emitGroup

//function pn(e) {
//return '/' + e.map(encodeUriFragment).join('/');
//}

function getNodeWithException(dom, nodeid) {
  const node = dom.nodes[nodeid];

  if (!node) {
    throw new Error(`Node with id ${node} does not exist.`);
  }

  return node;
}

const setNodeProp = (dom, operation) => {
  const node = getNodeWithException(dom, operation.id);

  if (get(node, operation.prop) !== operation.value) {
    set(node, operation.prop, operation.value);
  }

  return operation;
};

function handleOperation(dom, patch, notifier) {
  return function (_operation) {
    // i
    const operation = Object.assign(
      {
        // o
        trace: patch.trace,
      },
      _operation,
    );

    switch (operation.op) {
      case nodeOperations.AddNode:
        return (function (dom, operation, notifier) {
          const {node} = operation;

          const parentNode = node.parentId
            ? dom.nodes[node.parentId]
            : undefined;

          let nodeInstance = null;

          switch (node.category) {
            case NodeCategories.Source:
              if (parentNode && NodeCategories.Source !== parentNode.category) {
                throw new Error(
                  `The parent of a source node may be another source node, but you provided a ${parent.category} node.`,
                );
              }

              nodeInstance = new GraphNode(node, parentNode);
              break;
            case NodeCategories.SourceMap:
              nodeInstance = (function (node, parentNode) {
                if (
                  !parentNode ||
                  NodeCategories.Virtual === parentNode.category
                ) {
                  throw new Error(
                    'The parent of a source_map node must be another source or source_map node.',
                  );
                }
                const sourceMapNode = new SourceMapNode(node, parentNode);

                return sourceMapNode;
              })(node, parentNode);
              break;
            case NodeCategories.Virtual:
              nodeInstance = (function (node, parentNode) {
                if (!parentNode) {
                  throw new Error(
                    'Virtual nodes must have a parent, and one was not provided.',
                  );
                }

                return new VirtualNode(node, parentNode);
              })(node, parentNode);
              break;
            default:
              throw new Error('Non-exhausive match for createNode()');
          }

          dom.nodes[node.id] = nodeInstance;
          dom.nodesByUri[nodeInstance.uri] = nodeInstance;
          dom.nodesByType[nodeInstance.type] =
            dom.nodesByType[nodeInstance.type] || [];
          dom.nodesByType[nodeInstance.type].push(nodeInstance);
          if (nodeInstance.category === NodeCategories.SourceMap) {
            notifier.emit(eventTypes.DidAddSourceMapNode, {
              node: nodeInstance,
            });
          }
          observe(nodeInstance, 'uri', ({newValue, oldValue}) => {
            if (oldValue) {
              delete dom.nodesByUri[oldValue];
            }

            dom.nodesByUri[newValue] = nodeInstance;

            notifier.emit(eventTypes.DidUpdateNodeUri, {
              id: nodeInstance.id,
              newUri: newValue,
              oldUri: oldValue,
            });
          });
          return operation;
        })(dom, operation, notifier);
      case nodeOperations.MoveNode:
        return (function (dom, operation, notifier) {
          const node = getNodeWithException(dom, operation.id); // r

          const {uri} = node;

          if (operation.newParentId === null) {
            node.parent = undefined;
          } else if (
            operation.newParentId &&
            node.parentId !== operation.newParentId
          ) {
            const parent = getNodeWithException(dom, operation.newParentId);

            if (!parent) {
              throw new ReferenceError(
                `Parent with "${operation.newParentId}" id not found. Move cannot be completed`,
              );
            }

            node.parent = parent;
          }

          if (operation.newPath && node.path !== operation.newPath) {
            node.path = operation.newPath;
          }

          notifier.emit(
            eventTypes.DidMoveNode,
            Object.assign(Object.assign({}, operation), {
              oldUri: uri,
            }),
          );

          return operation;
        })(dom, operation, notifier);
      case nodeOperations.RemoveNode:
        return (function (dom, operation, notifier) {
          // e,t,n
          //const r = In(dom, operation.id)
          const node = getNodeWithException(dom, operation.id); // r
          if (node.parent) {
            pull(node.parent.children, node);
          }

          (function recursiveRemove(dom, _node) {
            // t,n
            for (const child of _node.children) {
              recursiveRemove(dom, child);
            }

            delete dom.nodes[_node.id];
            delete dom.nodesByUri[_node.uri];
            remove(dom.nodesByType[_node.type], (e) => _node.id === e.id);
          })(dom, node);

          notifier.emit(
            eventTypes.DidRemoveNode,
            Object.assign(Object.assign({}, operation), {node}),
          );
          return operation;
        })(dom, operation, notifier);
      case nodeOperations.SetSourceNodeProp:
        return setNodeProp(dom, operation);
      case nodeOperations.PatchSourceNodeProp:
        return (function (dom, operation) {
          const sourceNode = getNodeWithException(dom, operation.id); // r
          if (NodeCategories.Source !== sourceNode.category) {
            throw new Error(
              'Setting the raw property is only allowed on source nodes.',
            );
          }
          const parsedSpec = get(sourceNode, operation.prop);
          const patchedNodeProp = patchSourceNodeProp(
            parsedSpec,
            operation.value,
          );
          set(sourceNode, operation.prop, patchedNodeProp);
          notifier.emit(eventTypes.DidPatchSourceNodeProp, operation);
          return operation;
        })(dom, operation);
      default:
        throw new Error('Non-exhaustive match for applyOperation()');
    }
  };
}

function patchNodeProp(spec, operation) {
  // e, t
  if (nodeOperations.Text === operation.op) {
    const spec = String(spec || '');
    return `${spec.slice(0, operation.offset)}${operation.value}${spec.slice(
      operation.offset + operation.length,
    )}`;
  }

  if (
    operation.path.length === 0 &&
    (nodeOperations.Add === operation.op ||
      nodeOperations.Replace === operation.op)
  ) {
    return operation.value;
  }

  if (nodeOperations.Move === operation.op) {
    const fromPath = operation.from.slice(0, -1);
    if (isEqual(fromPath, operation.path.slice(0, -1))) {
      return produce(spec || {}, (draftSpec) =>
        operation.path.length > 1
          ? (set(
              draftSpec,
              fromPath,
              renameObjectKey(
                get(draftSpec, fromPath),
                String(operation.from[operation.from.length - 1]),
                String(operation.path[operation.path.length - 1]),
              ),
            ),
            draftSpec)
          : renameObjectKey(
              draftSpec,
              String(operation.from[operation.from.length - 1]),
              String(operation.path[operation.path.length - 1]),
            ),
      );
    }

    //return hn(e || {}, (e) =>
    //t.path.length > 1
    //? (Object(xe.set)(
    //e,
    //n,
    //Object(te.renameObjectKey)(
    //Object(xe.get)(e, n),
    //String(t.from[t.from.length - 1]),
    //String(t.path[t.path.length - 1]),
    //),
    //),
    //e)
    //: Object(te.renameObjectKey)(
    //e,
    //String(t.from[t.from.length - 1]),
    //String(t.path[t.path.length - 1]),
    //),
    //);
  }

  if (nodeOperations.Remove === operation.op) {
    return produce(spec || {}, (draftSpec) => {
      unset(draftSpec, operation.path);
    });
  }

  if (
    nodeOperations.Add === operation.op ||
    nodeOperations.Replace === operation.op
  ) {
    return produce(spec || {}, (draftSpec) => {
      //!(function (draftSpec, operation) {
      const {path, value, op} = operation;
      if (!isObject(draftSpec)) {
        return draftSpec;
      }

      const totalItems = path.length; //i
      const lastIndex = totalItems - 1; // o
      let counter = -1; //a
      let initialSpec = draftSpec; // s

      for (; initialSpec != null && totalItems > ++counter; ) {
        let decodedPath = decodeUriFragment(String(path[counter])); //e
        let initialValue = value; //i

        if (lastIndex !== counter) {
          const schema = initialSpec[decodedPath]; // n
          initialValue = isObject(schema)
            ? schema
            : isHyphenOnly(String(path[counter + 1]))
            ? []
            : {};
        }

        if (decodedPath === '-' && Array.isArray(initialSpec)) {
          decodedPath = String(initialSpec.length);
        }

        if (
          nodeOperations.Add === op &&
          !Number.isNaN(Number(decodedPath)) &&
          Array.isArray(initialSpec) &&
          lastIndex === counter
        ) {
          initialSpec.splice(Number(decodedPath), 0, initialValue);
        } else {
          initialSpec[decodedPath] = initialValue;
        }

        initialSpec = initialSpec[decodedPath];
      }
    });
  } else {
    return spec;
  }
}

const patchSourceNodeProp = (spec, values) => {
  let _spec = spec;
  for (const value of values) {
    _spec = patchNodeProp(spec, value);
  }
  return _spec;
};

export {handleOperation};
