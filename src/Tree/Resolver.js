import {get} from 'lodash';
import {
  generateUUID,
  isExampleNode,
  isPathNode,
  isPathsNode,
  isModelNode,
  isResponseNode,
  isRequestBodyNode,
  isParameterNode,
} from '../utils/tree';
import {NodeTypes, NodeCategories} from '../datasets/tree';
import {decodeUriFragment} from '../utils';
import Node from './Node';
import OperationNode, {sortOperations} from './OperationNode';

const mapSchema = (node, parent, metadata) => {
  if (node.type === NodeTypes.Model) {
    return new Node({
      id: node.id,
      type: NodeTypes.Model,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === NodeTypes.Response) {
    return new Node({
      id: node.id,
      type: NodeTypes.Response,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === NodeTypes.Example) {
    return new Node({
      id: node.id,
      type: NodeTypes.Example,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === NodeTypes.Parameter) {
    return new Node({
      id: node.id,
      type: NodeTypes.Parameter,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === NodeTypes.RequestBody) {
    return new Node({
      id: node.id,
      type: NodeTypes.RequestBody,
      name: node.name,
      parent,
      metadata,
    });
  }
  if (node.type === NodeTypes.Path) {
    return new Node({
      id: node.id,
      type: NodeTypes.Path,
      name: node.name,
      parent,
      metadata,
    });
  }

  throw new Error('Invalid node provided');
};

const getNodeChildren = (nodeType, openapi) => {
  if (nodeType === NodeTypes.Models) {
    return get(openapi, 'components.schemas', {});
  }
  if (nodeType === NodeTypes.Examples) {
    return get(openapi, 'components.examples', {});
  }
  if (nodeType === NodeTypes.Parameters) {
    return get(openapi, 'components.parameters', {});
  }
  if (nodeType === NodeTypes.Responses) {
    return get(openapi, 'components.responses', {});
  }
  if (nodeType === NodeTypes.RequestBodies) {
    return get(openapi, 'components.requestBodies', {});
  }

  throw new Error('Invalid Node provided');
};

const determineChildNodeType = (nodeType) => {
  if (nodeType === NodeTypes.Models) {
    return NodeTypes.Model;
  }
  if (nodeType === NodeTypes.Examples) {
    return NodeTypes.Example;
  }
  if (nodeType === NodeTypes.Parameters) {
    return NodeTypes.Parameter;
  }
  if (nodeType === NodeTypes.Responses) {
    return NodeTypes.Response;
  }
  if (nodeType === NodeTypes.RequestBodies) {
    return NodeTypes.RequestBody;
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
    children.push({id: generateUUID(), name: nodeName, type: NodeTypes.Path});
  }
  return children.map((t) => mapSchema(t, node));
};

const resolveAll = (node) => {
  return [
    {
      id: generateUUID(),
      name: 'API Overview',
      type: NodeTypes.Overview,
      parent: node,
    },
    {
      id: generateUUID(),
      type: NodeTypes.Paths,
      name: 'Paths',
      children: [],
      parent: node,

      metadata: {
        sourceNodeId: undefined,
      },
    },
    {
      id: generateUUID(),
      type: NodeTypes.Models,
      name: 'Models',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: NodeTypes.RequestBodies,
      name: 'Request Bodies',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: NodeTypes.Responses,
      name: 'Responses',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: NodeTypes.Parameters,
      name: 'Parameters',
      children: [],
      parent: node,
    },
    {
      id: generateUUID(),
      type: NodeTypes.Examples,
      name: 'Examples',
      children: [],
      parent: node,
    },
  ];
};

export const Resolve = (openapi) => (node) => {
  switch (node.type) {
    case NodeTypes.Paths:
      return resolvePath(node, openapi);
    case NodeTypes.Models:
      return resolveSchema(node, openapi, NodeTypes.Models);
    case NodeTypes.RequestBodies:
      return resolveSchema(node, openapi, NodeTypes.RequestBodies);
    case NodeTypes.Responses:
      return resolveSchema(node, openapi, NodeTypes.Responses);
    case NodeTypes.Parameters:
      return resolveSchema(node, openapi, NodeTypes.Parameters);
    case NodeTypes.Examples:
      return resolveSchema(node, openapi, NodeTypes.Examples);
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
