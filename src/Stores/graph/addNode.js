/* eslint-disable no-prototype-builtins */
import {escapeRegExp} from 'lodash';
import {NodeCategories, NodeTypes} from '../../utils/tree';
//import {exampleDoc} from '../../model';

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

const getChildNodes = (node, isSourceMap) => {
  const childNodes = {};
  for (const childNode of node.children) {
    if (isSourceMap(childNode)) {
      childNodes[childNode.uri] = childNode;
    }

    if (childNode.children && childNode.children.length) {
      Object.assign(childNodes, getChildNodes(childNode, isSourceMap));
    }
  }

  return childNodes;
};

export const initGraph = (node, graph) => {
  let childNodes = getChildNodes(node); // u

  const nodePropsUriMap = getNodeMap(
    operations,
    node.data.parsed,
    node.uri,
  ).uriMap; // c

  const nodeUriMap = {};
  const uriMaps = {};
  for (const uri in nodePropsUriMap) {
    if (!nodePropsUriMap.hasOwnProperty(uri)) {
      continue;
    }

    if (childNodes[uri]) {
      const node = graph.getNodeByUri(uri);

      if (!node) {
        continue;
      }

      uriMaps[uri] = node;
      continue;
    }

    const nodeProps = nodePropsUriMap[uri];
    // Removing current node uri from whole path will give parent node path
    const parentUri = uri.replace(
      new RegExp(`/${escapeRegExp(nodeProps.path)}$`),
      '',
    );
    const parentNode = childNodes[parentUri] || nodeUriMap[parentUri] || node; // o

    const newNode = Object.assign(Object.assign({}, nodeProps), {
      parentId: parentNode.id,
    });

    const currentNode = graph.addNode(newNode);
    nodeUriMap[currentNode.uri] = currentNode;
  }
};
