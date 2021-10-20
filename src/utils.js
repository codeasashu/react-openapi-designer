// @flow
import React from 'react';
import {get, compact} from 'lodash';

export const StatusCodes = [200, 201, 202];
// @TODO support additional methods:
// ["get", "post", "put", "patch", "delete", "head", "options", "trace"]
export const validMethods = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
];
export const validPathMethods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
};

export const ContentTypes = {
  json: 'application/json',
  xml: 'application/xml',
  form: 'application/x-www-form-urlencoded',
  multipart: 'multipart/form-data',
  text: 'text/plain; charset=utf-8',
  html: 'text/html',
  pdf: 'application/pdf',
  png: 'image/png',
};

export const defaultSchema = {
  string: {type: 'string'},
  boolean: {type: 'boolean'},
  number: {type: 'number'},
  integer: {type: 'integer'},
  array: {type: 'array', items: {type: 'string'}},
  object: {type: 'object', properties: {}, required: [], examples: {}},
};

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

export const highlightText = (text: string, query: string) => {
  if (!text || typeof text != 'string') {
    return [];
  }
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};

export const getLongestIndex = (items: Array, pattern: String) => {
  let longestIndex = 0;
  items
    .filter((x) => !!x)
    .forEach((key) => {
      const matches = Array.from(key.matchAll(pattern), (m) => m[1]);
      let idx = matches.length ? parseInt(matches[0]) : -1;
      idx = isNaN(idx) ? -1 : idx;
      if (idx >= 0) longestIndex = Math.max(idx, longestIndex);
    });
  return longestIndex;
};

export const generateExampleName = (examples: Object) => {
  const longestIndex = getLongestIndex(
    Object.keys(examples),
    /example-([\d]+)/g,
  );
  return `example-${longestIndex + 1}`;
};

export const generateHeaderName = (headers: Object) => {
  const longestIndex = getLongestIndex(Object.keys(headers), /header-([\d]+)/g);
  return `header-${longestIndex + 1}`;
};

export const sortContentTypes = (contentTypes: Array, order = []) => {
  return contentTypes.sort((a, b) => {
    const firstIndex = order.indexOf(a);
    const secondIndex = order.indexOf(b);
    if (firstIndex < 0) {
      return 1;
    }
    if (secondIndex < 0) {
      return -1;
    }
    return firstIndex - secondIndex;
  });
};

export const escapeUri = (path) => path.replaceAll(/\//g, '~1');
export const unescapeUri = (path) => path.replaceAll(/~1/g, '/');

export const getJsonPointerFromUrl = (pointer: string) => {
  // When there is no pointer, we show info as default module
  const jsonPointer = pointer || '#/info';
  return jsonPointer
    .replace('#', '')
    .split('/')
    .filter((n) => !!n);
};

export const isValidPathMethod = (method) =>
  method && Object.keys(validPathMethods).indexOf(method.toLowerCase()) >= 0;

export const extractMethodFromUri = (relativePath) => {
  if (relativePath.length < 3) return null;
  const method = relativePath[2];
  return isValidPathMethod(method) ? method.toLowerCase() : null;
};

export const getPathParameters = (pathItem) => {
  const parameters = compact(get(pathItem, 'parameters', []));
  return parameters.filter((p) => p['in'] && p['in'] === 'path');
};

const replaceInPath = (e, t, n) => {
  const r = e.toString();
  let o = '';
  let i = r;
  let a = 0;
  let s = i.indexOf(t);

  for (; s > -1; ) {
    o += r.substring(a, a + s) + n;
    i = i.substring(s + t.length, i.length);
    a += s + t.length;
    s = i.indexOf(t);
  }

  if (i.length > 0) {
    o += r.substring(r.length - i.length, r.length);
  }

  return o;
};

export const decodeUriFragment = (path) =>
  replaceInPath(replaceInPath(path, '~1', '/'), '~0', '~');

export const encodeUriFragment = (path) =>
  replaceInPath(replaceInPath(path, '~', '~0'), '/', '~1');

export const generateOperationId = (path, method) => {
  // eslint-disable-next-line no-useless-escape
  const pathRegex = /[^A-Za-z0-9-._~:?#\[\]@!$&'()*+,;=]+/g;

  const replacer = (e, t, n) => {
    if (n.length === e.length + t) {
      return '';
    } else {
      return '-';
    }
  };
  const newPath = decodeUriFragment(path);
  return `${method.toLowerCase()}${newPath.replace(pathRegex, replacer)}`;
};

export const pathToPointer = (path) => {
  return encodeUriFragmentIdentifier(path);
};

const encodeUriFragmentIdentifier = (path) => {
  if (path && typeof path !== 'object') {
    throw new TypeError('Invalid type: path must be an array of segments.');
  }

  if (path.length === 0) {
    return '#';
  }

  return `#/${path.map(encodeUriFragment).join('/')}`;
};

export const timer = async (timeout = 0) =>
  new Promise((t) => setTimeout(t, timeout));

export const methodColors = {
  get: 'success',
  post: 'info',
  put: 'warning',
  patch: 'warning',
  delete: 'danger',
  copy: 'gray',
  head: 'gray',
  link: 'gray',
  unlink: 'gray',
  purge: 'gray',
  lock: 'gray',
  unlock: 'gray',
  options: 'gray',
  trace: 'gray',
};

export const getMethodColor = (_color) => {
  if (_color in methodColors) {
    return methodColors[_color];
  } else {
    return 'gray';
  }
};

export const renameObjectKey = (originalObject, from, to) => {
  if (
    !originalObject ||
    !Object.hasOwnProperty.call(originalObject, from) ||
    to === from
  ) {
    return originalObject;
  }
  const newObject = {};
  for (const [key, value] of Object.entries(originalObject)) {
    if (from === key) {
      newObject[to] = value;
    } else {
      if (!(key in newObject)) {
        newObject[key] = value;
      }
    }
  }
  return newObject;
};
