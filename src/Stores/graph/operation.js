import {get, set, isEqual} from 'lodash';
import SourceMapNode from './sourceNode';
import VirtualNode from './virtualNode';
import GraphNode from './graphNode';
import {nodeOperations, NodeCategories, eventTypes} from '../../utils/tree';
//function handleOperation(e, t, n) { t = emitGroup

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

              console.log('applyPatch', operation);
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
          return operation;
        })(dom, operation, notifier);
      case nodeOperations.SetSourceNodeProp:
        return setNodeProp(dom, operation);
      case nodeOperations.PatchSourceNodeProp:
        return (function (dom, operation) {
          // e,t
          const node = getNodeWithException(dom, operation.id); // r

          if (NodeCategories.Source !== node.category) {
            throw new Error(
              'Setting the raw property is only allowed on source nodes.',
            );
          }

          const nodeProp = get(node, operation.prop);
          const patchedNodeProp = patchSourceNodeProp(nodeProp, operation.prop);
          set(node, operation.prop, patchedNodeProp);
          return operation;
        })(dom, operation);
      default:
        throw new Error('Non-exhaustive match for applyOperation()');
    }
  };
}

function patchNodeProp(nodeProp, value) {
  // e, t
  if (nodeOperations.Text === value.op) {
    const nodeProp = String(nodeProp || '');
    return `${nodeProp.slice(0, value.offset)}${value.value}${nodeProp.slice(
      value.offset + value.length,
    )}`;
  }

  if (
    value.path.length === 0 &&
    (nodeOperations.Add === value.op || nodeOperations.Replace === value.op)
  ) {
    return value.value;
  }

  if (nodeOperations.Move === value.op) {
    const n = value.from.slice(0, -1);

    if (isEqual(n, value.path.slice(0, -1))) {
      return {};
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
  }
}

const patchSourceNodeProp = (nodeProp, operation) => {
  let values = operation.value;
  let _nodeProp = nodeProp;
  for (const value of values) {
    // e of t
    _nodeProp = patchNodeProp(nodeProp, value);
  }

  return _nodeProp;
};

export {handleOperation};
