// @flow
import React from 'react';
import {get, set, compact, difference, isObject, map} from 'lodash';

export const StatusCodes = [200, 201, 202];
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

export const extractPathParams = (path) => {
  const pathParamRegex = /{(.+?)}/g;
  let paramsFromRegex = pathParamRegex.exec(path);
  const parameters = [];

  for (; paramsFromRegex !== null; ) {
    parameters.push(paramsFromRegex[1]);
    paramsFromRegex = pathParamRegex.exec(path);
  }
  return parameters;
};

export const modifyPathFromParameters = (path, parameters) => {
  const urlParams = extractPathParams(path);
  const parameterParams = compact(parameters || [])
    .filter((e) => e.in === 'path')
    .map((e) => e.name);
  const urlNotinParameters = difference(urlParams, parameterParams);
  const parametersNotinUrl = difference(parameterParams, urlParams);
  let url = path;

  if (urlNotinParameters.length === 1 && parametersNotinUrl.length === 1) {
    if (parametersNotinUrl[0] === '' || parametersNotinUrl[0] === undefined) {
      url = path.replace(`{${urlNotinParameters[0]}}`, '');
    } else {
      if (path.includes(`{${urlNotinParameters[0]}}`)) {
        url = path.replace(
          `{${urlNotinParameters[0]}}`,
          `{${parametersNotinUrl[0]}}`,
        );
      } else {
        if (!path.includes(`{${parametersNotinUrl[0]}}`)) {
          url = `${path}/{${parametersNotinUrl[0]}}`;
        }
      }
    }
  } else {
    if (urlNotinParameters.length === 1 && parametersNotinUrl.length === 0) {
      url = path.replace(`{${urlNotinParameters[0]}}`, '');
    } else {
      if (
        !(
          urlNotinParameters.length !== 0 ||
          parametersNotinUrl.length !== 1 ||
          parametersNotinUrl[0] === '' ||
          path.includes(`{${parametersNotinUrl[0]}}`)
        )
      ) {
        url = `${path}/{${parametersNotinUrl[0]}}`;
      }
    }
  }

  return url.replace(/\/+$/, '').replace(/([^:]\/)\/+/g, '$1');
};

export const modifyParametersFromPath = (params, path) => {
  const urlParams = extractPathParams(path);
  const pathParameters = params.filter((e) => isObject(e) && e.in === 'path');
  const notPathParameters = params.filter(
    (e) => isObject(e) && e.in !== 'path',
  );
  const arrayOfPathPaemetersName = map(pathParameters, 'name');
  const parametersNotInUrl = difference(arrayOfPathPaemetersName, urlParams);
  const urlParamsNotInparameters = difference(
    urlParams,
    arrayOfPathPaemetersName,
  );
  const remainingPathParameters = pathParameters.filter(
    (e) => !parametersNotInUrl.includes(e.name),
  );
  const remainingPathParametersNames = map(remainingPathParameters, 'name');

  urlParamsNotInparameters.forEach((e) => {
    if (!remainingPathParametersNames.includes(e)) {
      remainingPathParameters.push(formatPathParameter(e, ['schema', 'type']));
    }
  });
  return [...remainingPathParameters, ...notPathParameters];
};

const formatPathParameter = (name, location) =>
  Object.assign(Object.assign({}, set({}, location, 'string')), {
    name,
    in: 'path',
    required: true,
  });

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
