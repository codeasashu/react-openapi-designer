// @flow
import React from 'react';
import {get, compact, unset, update} from 'lodash';
import {pathMethods, methodColors} from './datasets/http';

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

export const basicSearch = (items, key) => {
  return function (query) {
    var words = query.toLowerCase().split(' ');

    return items.filter(function (item) {
      var normalizedTerm = item[key].toLowerCase();

      return words.every(function (word) {
        return normalizedTerm.indexOf(word) > -1;
      });
    });
  };
};

export const unsetCompact = (object, path) => {
  const parentPath = path.slice(0, path.lastIndexOf('.'));
  unset(object, path);
  if (Array.isArray(get(object, parentPath))) {
    update(object, parentPath, compact);
  }
};

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
  const tokens = [];
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
  method && Object.keys(pathMethods).indexOf(method.toLowerCase()) >= 0;

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

export const startsWith = (needle, haystack) => {
  if (needle instanceof Array) {
    if (haystack instanceof Array) {
      if (needle.length < haystack.length) {
        return false;
      }

      for (const item in haystack) {
        // eslint-disable-next-line no-prototype-builtins
        if (!haystack.hasOwnProperty(item)) {
          continue;
        }

        const needlePos = parseInt(needle[item]);
        const haystackPos = parseInt(haystack[item]);

        if (isNaN(needlePos) && isNaN(haystackPos)) {
          if (haystack[item] !== needle[item]) {
            return false;
          }
        } else if (haystackPos !== needlePos) {
          return false;
        }
      }
    }
  } else {
    if (typeof needle != 'string') {
      return false;
    }

    if (typeof haystackPos == 'string') {
      return needle.startsWith(haystack);
    }
  }

  return true;
};
