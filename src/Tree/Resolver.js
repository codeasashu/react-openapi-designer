import {get} from 'lodash';
import {
  generateUUID,
  NodeTypes,
  NodeCategories,
  isExampleNode,
  isPathNode,
  isPathsNode,
  isModelNode,
  isResponseNode,
  isRequestBodyNode,
  isParameterNode,
} from '../utils/tree';
import {decodeUriFragment} from '../utils';
import {treeTypes} from '../model';
import Node from './Node';
import OperationNode, {sortOperations} from './OperationNode';

const mapSchema = (node, parent, metadata) => {
  if (node.type === treeTypes.Model) {
    return new Node({
      id: node.id,
      type: treeTypes.Model,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === treeTypes.Response) {
    return new Node({
      id: node.id,
      type: treeTypes.Response,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === treeTypes.Example) {
    return new Node({
      id: node.id,
      type: treeTypes.Example,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === treeTypes.Parameter) {
    return new Node({
      id: node.id,
      type: treeTypes.Parameter,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === treeTypes.RequestBody) {
    return new Node({
      id: node.id,
      type: treeTypes.RequestBody,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === treeTypes.Path) {
    return new Node({
      id: node.id,
      type: treeTypes.Path,
      name: node.name,
      parent,
      metadata,
    });
  }

  throw new Error('Invalid node provided');
};

const getNodeChildren = (nodeType, openapi) => {
  if (nodeType === treeTypes.Models) {
    return get(openapi, 'components.schemas', {});
  }
  if (nodeType === treeTypes.Examples) {
    return get(openapi, 'components.examples', {});
  }
  if (nodeType === treeTypes.Parameters) {
    return get(openapi, 'components.parameters', {});
  }
  if (nodeType === treeTypes.Responses) {
    return get(openapi, 'components.responses', {});
  }
  if (nodeType === treeTypes.RequestBodies) {
    return get(openapi, 'components.requestBodies', {});
  }

  throw new Error('Invalid Node provided');
};

const determineChildNodeType = (nodeType) => {
  if (nodeType === treeTypes.Models) {
    return treeTypes.Model;
  }
  if (nodeType === treeTypes.Examples) {
    return treeTypes.Example;
  }
  if (nodeType === treeTypes.Parameters) {
    return treeTypes.Parameter;
  }
  if (nodeType === treeTypes.Responses) {
    return treeTypes.Response;
  }
  if (nodeType === treeTypes.RequestBodies) {
    return treeTypes.RequestBody;
  }

  throw new Error('Invalid Node provided');
};

const resolveSchema = (node, openapi, nodeType) => {
  const nodes = getNodeChildren(nodeType, openapi);
  const childNodeType = determineChildNodeType(nodeType);
  const children = [];
  for (const nodeName in nodes) {
    children.push({id: generateUUID(), name: nodeName, type: childNodeType});
  }
  return children.map((t) => mapSchema(t, node));
};

const resolvePath = (node, openapi) => {
  const nodes = get(openapi, ['paths'], {});
  const children = [];
  for (const nodeName in nodes) {
    children.push({id: generateUUID(), name: nodeName, type: treeTypes.Path});
  }
  return children.map((t) => mapSchema(t, node));
};

const resolveAll = (node) => {
  return [
    {
      id: generateUUID(),
      name: 'API Overview',
      type: treeTypes.Overview,
      parent: node,
    },
    {
      id: generateUUID(),
      type: treeTypes.Paths,
      name: 'Paths',
      children: [],
      parent: node,

      metadata: {
        sourceNodeId: undefined,
      },
    },
    {
      id: generateUUID(),
      type: treeTypes.Models,
      name: 'Models',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: treeTypes.RequestBodies,
      name: 'Request Bodies',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: treeTypes.Responses,
      name: 'Responses',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: treeTypes.Parameters,
      name: 'Parameters',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: treeTypes.Examples,
      name: 'Examples',
      children: [],
      parent: node,
    },
  ];
};

export const Resolve = (openapi) => (node) => {
  switch (node.type) {
    case treeTypes.Paths:
      return resolvePath(node, openapi);
    case treeTypes.Models:
      return resolveSchema(node, openapi, treeTypes.Models);
    case treeTypes.RequestBodies:
      return resolveSchema(node, openapi, treeTypes.RequestBodies);
    case treeTypes.Responses:
      return resolveSchema(node, openapi, treeTypes.Responses);
    case treeTypes.Parameters:
      return resolveSchema(node, openapi, treeTypes.Parameters);
    case treeTypes.Examples:
      return resolveSchema(node, openapi, treeTypes.Examples);
    default:
      if (node.parent === null) {
        return resolveAll(node);
      } else {
        return [];
      }
  }
};

function getChildNode(node, parent, metadata) {
  // e,t,n
  if (isModelNode(node)) {
    return new Node({
      id: node.id,
      type: NodeTypes.Model,
      name: node.path,
      parent,
      metadata,
    });
  }

  if (isResponseNode(node)) {
    return new Node({
      id: node.id,
      type: NodeTypes.Response,
      name: node.path,
      parent,
      metadata,
    });
  }

  if (isExampleNode(node)) {
    return new Node({
      id: node.id,
      type: NodeTypes.Example,
      name: node.path,
      parent,
      metadata,
    });
  }

  if (isParameterNode(node)) {
    return new Node({
      id: node.id,
      type: NodeTypes.Parameter,
      name: node.path,
      parent,
      metadata,
    });
  }

  if (isRequestBodyNode(node)) {
    return new Node({
      id: node.id,
      type: NodeTypes.RequestBody,
      name: node.path,
      parent,
      metadata,
    });
  }

  if (isPathNode(node)) {
    return new Node({
      id: node.id,
      type: NodeTypes.Path,
      name: decodeUriFragment(node.path),
      parent,
      metadata,
    });
  }

  throw new Error('Invalid node provided');
}

function _resolveExamples(treeNode) {
  const node = this.stores.graphStore.getNodeById(treeNode.id);
  if (node && NodeCategories.SourceMap === node.category) {
    return node.children
      .filter(isExampleNode)
      .map((child) => getChildNode(child, node));
  } else {
    return [];
  }
}

function _resolveRequestBodies(treeNode) {
  const node = this.stores.graphStore.getNodeById(treeNode.id);
  if (node && NodeCategories.SourceMap === node.category) {
    return node.children
      .filter(isRequestBodyNode)
      .map((child) => getChildNode(child, node));
  } else {
    return [];
  }
}

function _resolveParameters(treeNode) {
  const node = this.stores.graphStore.getNodeById(treeNode.id);
  if (node && NodeCategories.SourceMap === node.category) {
    return node.children
      .filter(isParameterNode)
      .map((child) => getChildNode(child, node, {subtype: child.subtype}));
  } else {
    return [];
  }
}

function _resolveResponses(treeNode) {
  const node = this.stores.graphStore.getNodeById(treeNode.id);
  if (node && NodeCategories.SourceMap === node.category) {
    return node.children
      .filter(isResponseNode)
      .map((child) => getChildNode(child, node));
  } else {
    return [];
  }
}

function _resolveModels(treeNode) {
  const node = this.stores.graphStore.getNodeById(treeNode.id); //n

  if (node && NodeCategories.SourceMap === node.category) {
    const nodeData = node.parentSourceNode?.data || undefined;
    const models = Object.keys(
      get(nodeData ? nodeData.parsed : undefined, node.relativeJsonPath) || {},
    );

    return node.children.filter(isModelNode).map((model) => {
      const order = models.indexOf(decodeUriFragment(model.path));
      return getChildNode(model, node, {
        order,
      });
    });
  }
  return [];
}

function _resolvePathNode(treeNode) {
  const node = this.stores.graphStore.getNodeById(treeNode.id);

  if (node && NodeCategories.SourceMap === node.category) {
    const nodeData = node.parentSourceNode?.data || undefined;
    const pathitems = Object.keys(
      get(nodeData ? nodeData.parsed : undefined, node.relativeJsonPath) || {},
    );

    return node.children.filter(isPathNode).map((pathitem) => {
      const order = pathitems.indexOf(decodeUriFragment(pathitem.path));
      return getChildNode(pathitem, node, {
        operations: new OperationNode(
          sortOperations(pathitem.children, 'path').map((_node) => {
            return {
              id: _node.id,
              method: _node.path,
            };
          }),
        ),
        order,
      });
    });
  }

  return [];
}

function _resolveAllNodes(node) {
  //const activeSourceNode = this.stores.uiStore.activeSourceNodeId;
  const activeSourceNode = this.stores.graphStore.rootNode;
  if (activeSourceNode === undefined) {
    return [];
  }

  const info = activeSourceNode.children.find(
    (node) => node.type === NodeTypes.Overview,
  );
  const components =
    activeSourceNode.children.find(
      (node) => NodeTypes.Components === node.type,
    ) || activeSourceNode; //u
  const paths = activeSourceNode.children.find(isPathsNode); //c
  const models =
    components == null
      ? undefined
      : components.children.find((e) => e.type === NodeTypes.Models); // l
  const responses =
    components == null
      ? undefined
      : components.children.find((e) => e.type === NodeTypes.Responses); //d
  const parameters =
    components == null
      ? undefined
      : components.children.find((e) => e.type === NodeTypes.Parameters); // h
  const examples =
    components == null
      ? undefined
      : components.children.find((e) => e.type === NodeTypes.Examples); //f
  const requestBodies =
    components == null
      ? undefined
      : components.children.find((e) => e.type === NodeTypes.RequestBodies); // p

  return [
    {
      id: info ? info.id : generateUUID(),
      name: 'API Overview',
      type: NodeTypes.Overview,
      parent: node,
    },
    {
      id: paths ? paths.id : generateUUID(),
      type: NodeTypes.Paths,
      name: 'Paths',
      children: [],
      parent: node,

      metadata: {
        sourceNodeId: paths == null ? undefined : paths.parentId,
      },
    },
    {
      id: models ? models.id : generateUUID(),
      type: NodeTypes.Models,
      name: 'Models',
      children: [],
      parent: node,
    },
    {
      id: requestBodies ? requestBodies.id : generateUUID(),
      type: NodeTypes.RequestBodies,
      name: 'Request Bodies',
      children: [],
      parent: node,
    },
    {
      id: responses ? responses.id : generateUUID(),
      type: NodeTypes.Responses,
      name: 'Responses',
      children: [],
      parent: node,
    },
    {
      id: parameters ? parameters.id : generateUUID(),
      type: NodeTypes.Parameters,
      name: 'Parameters',
      children: [],
      parent: node,
    },
    {
      id: examples ? examples.id : generateUUID(),
      type: NodeTypes.Examples,
      name: 'Examples',
      children: [],
      parent: node,
    },
  ];
}

function ContextResolver(node) {
  switch (node.type) {
    case NodeTypes.Paths:
      return _resolvePathNode.call(this, node);
    case NodeTypes.Models:
      return _resolveModels.call(this, node);
    case NodeTypes.RequestBodies:
      return _resolveRequestBodies.call(this, node);
    case NodeTypes.Responses:
      return _resolveResponses.call(this, node);
    case NodeTypes.Parameters:
      return _resolveParameters.call(this, node);
    case NodeTypes.Examples:
      return _resolveExamples.call(this, node);
    default:
      if (node.parent === null) {
        return _resolveAllNodes.call(this, node);
      } else {
        return [];
      }
  }
}

export {ContextResolver, getChildNode};
