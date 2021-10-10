/* eslint-disable no-prototype-builtins */
import {escapeRegExp, difference} from 'lodash';
import {
  NodeCategories,
  NodeTypes,
  nodeOperations,
  eventTypes,
} from '../../utils/tree';
import {encodeUriFragment} from '../../utils';

const operations = [
  {
    match: '^info$',
    type: NodeTypes.Overview,
  },
  {
    match: '^paths$',
    type: NodeTypes.Paths,

    children: [
      {
        notMatch: '^x-',
        type: NodeTypes.Path,

        children: [
          {
            match: '^(?:get|post|put|delete|options|head|patch|trace)$',
            type: NodeTypes.Operation,
          },
        ],
      },
    ],
  },
  {
    match: '^components$',
    type: NodeTypes.Components,

    children: [
      {
        match: '^schemas$',
        type: NodeTypes.Models,

        children: [
          {
            notMatch: '^x-',
            type: NodeTypes.Model,
            subtype: 'json_schema',
          },
        ],
      },
      {
        match: '^parameters$',
        type: NodeTypes.Parameters,
        children: [
          {
            field: 'in',
            match: '^cookie$',
            type: NodeTypes.Parameter,
            subtype: 'cookie',
          },
          {
            field: 'in',
            match: '^path$',
            type: NodeTypes.Parameter,
            subtype: 'path',
          },
          {
            field: 'in',
            match: '^header$',
            type: NodeTypes.Parameter,
            subtype: 'header',
          },
          {
            field: 'in',
            match: '^query$',
            type: NodeTypes.Parameter,
            subtype: 'query',
          },
          {
            field: 'in',
            match: '^body$',
            type: NodeTypes.Parameter,
            subtype: 'body',
          },
          {
            type: NodeTypes.Parameter,
          },
        ],
      },
      {
        match: '^responses$',
        type: NodeTypes.Responses,
        children: [
          {
            notMatch: '^x-',
            type: NodeTypes.Response,
          },
        ],
      },
      {
        match: '^requestBodies$',
        type: NodeTypes.RequestBodies,
        children: [
          {
            notMatch: '^x-',
            type: NodeTypes.RequestBody,
          },
        ],
      },
      {
        type: NodeTypes.Examples,
        match: '^examples$',
        children: [
          {
            type: NodeTypes.Example,
          },
        ],
      },
    ],
  },
];

function getMatcherForKey(key, value, matchers) {
  for (const matcher of matchers) {
    let matched = true;
    let i = key;

    if (matcher.field) {
      i = value[matcher.field];
    }

    if (matcher.match) {
      matched = !key || (typeof key == 'string' && key.match(matcher.match));
    } else {
      if (matcher.notMatch) {
        matched = !i || typeof i != 'string' || !i.match(matcher.notMatch);
      }
    }

    if (matched) {
      return matcher;
    }
  }
}

const getNodeMap = (operations, parsedData, nodeKey) => {
  const uriMap = {}; // i
  const nodeTree = []; // o

  switch (typeof parsedData) {
    case 'object':
      for (const key in parsedData) {
        if (!Object.prototype.hasOwnProperty.call(parsedData, key)) {
          continue;
        }

        const formattedKey = key.replace(/~/g, '~0').replace(/\//g, '~1'); // s
        const matched = getMatcherForKey(
          formattedKey,
          parsedData[key],
          operations,
        );

        if (matched) {
          const childKey = `${nodeKey || ''}/${formattedKey}`; // t

          const childNodeProps = {
            // c
            category: NodeCategories.SourceMap,
            type: matched.type,
            path: formattedKey,
          };

          uriMap[childKey] = childNodeProps;

          if (matched.subtype) {
            childNodeProps.subtype = matched.subtype;
          }

          const copyOfNode = Object.assign(
            Object.assign({}, uriMap[childKey]),
            {
              children: [],
            },
          );

          nodeTree.push(copyOfNode);

          if (matched.children) {
            copyOfNode.children = getNodeMap(
              matched.children,
              parsedData[key],
            ).nodeTree;
            Object.assign(
              uriMap,
              getNodeMap(matched.children, parsedData[key], childKey).uriMap,
            );
          }
        }
      }
  }

  return {
    uriMap,
    nodeTree,
  };
};

function encodePath(e) {
  return '/' + e.map(encodeUriFragment).join('/');
}

const removeNodeFromUriMap = (
  operation, // e
  {
    node, // t
    currentUriMap, //n
    removeNode, // r
  },
) => {
  const nodePath = node.uri + encodePath(operation.path); //i

  if (!currentUriMap.hasOwnProperty(nodePath)) {
    return currentUriMap;
  }

  const currentNode = currentUriMap[nodePath]; //o

  if (
    currentNode === undefined ||
    NodeCategories.SourceMap !== currentNode.category ||
    currentNode.id === undefined
  ) {
    return currentUriMap;
  }

  removeNode(currentNode.id);

  for (const _node in currentUriMap) {
    if (nodePath === _node.substring(0, nodePath.length)) {
      delete currentUriMap[_node];
    }
  }

  return currentUriMap;
};

function moveNode(patch, {node, currentUriMap, moveNode}) {
  const fromNodePath = node.uri + encodePath(patch.from); // i
  const toNodePath = node.uri + encodePath(patch.path); //o

  if (!currentUriMap.hasOwnProperty(fromNodePath)) {
    return currentUriMap;
  }

  const fromNode = currentUriMap[fromNodePath]; //a

  if (
    fromNode === undefined ||
    NodeCategories.SourceMap !== fromNode.category ||
    fromNode.id === undefined
  ) {
    return currentUriMap;
  }

  const toNode = currentUriMap[node.uri + encodePath(patch.path.slice(0, -1))];

  if (
    !(
      toNode === undefined ||
      NodeCategories.SourceMap !== toNode.category ||
      toNode.id === undefined
    )
  ) {
    moveNode(
      fromNode.id,
      toNode.id,
      toNodePath.substring(toNodePath.lastIndexOf('/') + 1),
    );
    delete currentUriMap[fromNodePath];
    currentUriMap[fromNode.uri] = fromNode;
  }

  return currentUriMap;
}

export const recomputeGraphNodes = (node, graph, operation) => {
  if (NodeCategories.Source !== node.category || !node.data.parsed) {
    return;
  }

  let currentUriMap = (function getChildNodes(node, isSourceMapNode) {
    // u
    const existingChildren = {};

    for (const child of node.children) {
      if (isSourceMapNode && isSourceMapNode(child)) {
        existingChildren[child.uri] = child;
      }

      if (child.children && child.children.length) {
        Object.assign(existingChildren, getChildNodes(child, isSourceMapNode));
      }
    }

    return existingChildren;
  })(node, (_node) => NodeCategories.SourceMap === _node.category);

  if (
    operation &&
    eventTypes.ComputeSourceMap === operation.op &&
    operation.patch
  ) {
    let notModified = true;

    for (const patch of operation.patch) {
      // n
      if (patch.op === nodeOperations.Move) {
        currentUriMap = moveNode(patch, {
          node,
          currentUriMap,
          moveNode: graph.moveNode,
        });
        //u = ur(n, {
        //node: t,
        //currentUriMap: u,
        //moveNode: o,
        //})
      } else {
        if (patch.op === nodeOperations.Remove) {
          currentUriMap = removeNodeFromUriMap(patch, {
            node,
            currentUriMap,
            removeNode: graph.removeNode,
          });
        } else {
          notModified = false;
        }
      }
    }

    if (notModified) {
      return;
    }
  }

  const allUriMap = getNodeMap(operations, node.data.parsed, node.uri).uriMap;

  const nodeUriMap = {};
  const existinguUriMaps = {};
  for (const uri in allUriMap) {
    if (!allUriMap.hasOwnProperty(uri)) {
      continue;
    }

    if (currentUriMap[uri]) {
      const _node = graph.getNodeByUri(uri);

      if (!_node) {
        continue;
      }

      existinguUriMaps[uri] = _node;
      continue;
    }

    const _node = allUriMap[uri];
    // Removing current node uri from whole path will give parent node path
    const cleanedUri = uri.replace(
      new RegExp(`/${escapeRegExp(_node.path)}$`),
      '',
    );
    const parentNode =
      currentUriMap[cleanedUri] || nodeUriMap[cleanedUri] || node;

    const newNode = Object.assign(Object.assign({}, _node), {
      parentId: parentNode.id,
    });

    const currentNode = graph.addNode(newNode);
    nodeUriMap[currentNode.uri] = currentNode;
  }

  const currentNodesUris = Object.keys(currentUriMap); // h
  const allNodesUris = Object.keys(allUriMap); //f
  const newNodeUris = difference(currentNodesUris, allNodesUris); //p
  const processed = {};

  for (const nodeUri of newNodeUris) {
    const _node = currentUriMap[nodeUri];

    if (_node && _node.id) {
      if (!(_node.parentId && processed[_node.parentId])) {
        graph.removeNode(_node.id);
      }

      processed[_node.id] = true;
    }
  }
};
