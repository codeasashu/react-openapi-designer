import {isObjectLike} from 'lodash';
import {NodeTypes, NodeCategories} from '../datasets/tree';
import {decodeUriFragment} from '../utils';

export const isParentNode = (e) =>
  typeof e == 'object' && e !== null && 'children' in e;

export const generateUUID = () => Math.random().toString(36).slice(2);

const idCounter = {};

const randomString = (chars, length) => {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export const generateGraphId = ({prefix, length, counter} = {}) => {
  if (counter) {
    const counterKey = prefix || 'default';
    idCounter[counterKey] = (idCounter[counterKey] || 0) + 1;
    return `${prefix || ''}${idCounter[counterKey]}`;
  }

  let uniqueId = `${prefix || ''}${randomString(
    '0123456789abcdefghijklmnopqrstuvwxyz',
    length || 8,
  )}`;

  if (length) {
    uniqueId = uniqueId.substr(0, length);
  }

  return uniqueId.toLowerCase();
};

export const raiseErrorIfNotParentNode = (node) => {
  if (!isParentNode(node)) {
    throw new TypeError('Parent node expected');
  }
};

export const formatUri = (uri, parentUri) => {
  if (parentUri === '/') {
    return parentUri + uri;
  } else {
    if (parentUri) {
      return `${parentUri}/${uri}`;
    } else {
      return '' + uri;
    }
  }
};

const normalisePath = (path) => {
  let normalisedPath;

  try {
    normalisedPath = decodeURIComponent(path);
  } catch (error) {
    normalisedPath = path.replace(/%[0-9a-f]+/gi, (match) => {
      try {
        return decodeURIComponent(match);
      } catch (error) {
        return match;
      }
    });
  }

  return decodeUriFragment(normalisedPath);
};

export const pointerToPath = (jsonPointer) => {
  if (typeof jsonPointer != 'string') {
    throw new TypeError(
      'Invalid type: JSON Pointers are represented as strings.',
    );
  }

  if (jsonPointer.length === 0 || jsonPointer[0] !== '#') {
    throw new URIError(
      'Invalid JSON Pointer syntax; URI fragment identifiers must begin with a hash.',
    );
  }

  if (jsonPointer.length === 1) {
    return [];
  }

  if (jsonPointer[1] !== '/') {
    throw new URIError('Invalid JSON Pointer syntax.');
  }

  const remainingPointer = jsonPointer.substring(2).split('/');

  const n = [];
  let startIndex = -1;

  for (; remainingPointer.length > ++startIndex; ) {
    n.push(normalisePath(remainingPointer[startIndex]));
  }

  return n;
};

export const getExtension = (fileName) =>
  fileName.substr(fileName.lastIndexOf('.') + 1);

function isPathSeparator(code) {
  const CHAR_FORWARD_SLASH = 47;
  const CHAR_BACKWARD_SLASH = 92;
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}

function validateString(value, name) {
  if (typeof value !== 'string') throw new Error(name, 'string', value);
}

export const isAbsolutePath = (path) => {
  const CHAR_COLON = 58;
  validateString(path, 'path');
  const len = path.length;
  if (len === 0) return false;

  const code = path.charCodeAt(0);
  return (
    isPathSeparator(code) ||
    // Possible device root
    (len > 2 &&
      path.getCharCodeAt(1) === CHAR_COLON &&
      isPathSeparator(path.getCharCodeAt(2)))
  );
};

export const assertUniqueName = (node) => {
  if (node.parent !== null) {
    for (const sibling of node.parent.children) {
      if (node === sibling) {
        continue;
      }
      if (node.name === sibling.name) {
        throw new Error(
          `"${node.name}" already exists. Existing Nodeid: ${sibling.id}`,
        );
      }
    }
  }
};

export const isOperationNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Operation
  );
};

export const isExampleNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Example
  );
};

export const isModelNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Model
  );
};

export const isResponseNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Response
  );
};

export const isPathNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Path
  );
};

export const isPathsNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Paths
  );
};

export const isRequestBodyNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.RequestBody
  );
};

export const isParameterNode = (node) => {
  return (
    node &&
    NodeCategories.SourceMap === node.category &&
    node.type === NodeTypes.Parameter
  );
};

export const isOperationLike = (node) =>
  NodeCategories.SourceMap === node.category &&
  NodeTypes.Operation === node.type &&
  isObjectLike(node.data.parsed);

export const isHyphenOnly = (e) => !e.match(/^(?:0|[1-9]\d*)$/) && e === '-';

export function assertParentNode(e) {
  if (!isParentNode(e)) {
    throw new TypeError('Parent node expected');
  }
}
