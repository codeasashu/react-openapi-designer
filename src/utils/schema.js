import {set, map, difference, compact, isObject} from 'lodash';
import {validPathMethods} from '../utils';

export const escapeUri = (path) => path.replaceAll(/\//g, '~1');
export const unescapeUri = (path) => path.replaceAll(/~1/g, '/');

const hasProperties = (schema) =>
  Object.prototype.hasOwnProperty.call(schema, 'properties') &&
  typeof schema.properties === 'object';

const hasType = (schema) =>
  Object.prototype.hasOwnProperty.call(schema, 'type');

const hasTitle = (schema) =>
  Object.prototype.hasOwnProperty.call(schema, 'title');
const hasExamples = (schema) =>
  Object.prototype.hasOwnProperty.call(schema, 'examples');

const isObjectSchema = (schema) => hasType(schema) && schema.type === 'object';

export const fillType = (schema) => {
  let _schema = Object.assign({}, schema);
  if (!hasType(schema) && !hasProperties(schema)) {
    _schema['type'] = hasProperties(schema) ? 'object' : 'string';
  }
  return _schema;
};

const fillTitle = (schema) =>
  !hasTitle(schema) ? Object.assign({}, {title: ''}, schema) : schema;
const fillExamples = (schema) =>
  !hasExamples(schema) ? Object.assign({}, {examples: {}}, schema) : schema;

export const fillSchema = (schema) => {
  let _schema = fillType(schema);
  if (isObjectSchema(_schema)) {
    if (!hasProperties(_schema)) _schema['properties'] = {};
    _schema.properties = fillObject(_schema.properties);
  } else if (_schema.type === 'array') {
    if (!_schema.items) _schema['items'] = {type: 'string'};
    _schema.items = fillSchema(_schema.items);
  }
  _schema = fillTitle(_schema);
  _schema = fillExamples(_schema);
  return _schema;
};

export const fillObject = (properties) => {
  let _properties = {};
  for (const key in properties) {
    _properties[key] = Object.assign(
      {},
      fillType(properties[key]),
      properties[key],
    );
    if (properties[key].type === 'array' || properties[key].type === 'object')
      _properties[key] = fillSchema(properties[key]);
  }
  return _properties;
};

export const _generateOperationId = (path, method) => {
  const newpath = path.replaceAll(/[/]/g, '-').replaceAll(':', '');
  return `${method.toLowerCase()}-${newpath}`;
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

const decodeUriFragment = (path) =>
  replaceInPath(replaceInPath(path, '~1', '/'), '~0', '~');

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

export const createPathParamSchema = (name, location) =>
  Object.assign(Object.assign({}, set({}, location, 'string')), {
    name: name,
    in: 'path',
    required: true,
  });

export const getPathParametersFromUri = (uri) => {
  const matcher = /{(.+?)}/g;
  let matches = matcher.exec(uri);
  const params = [];

  for (; matches !== null; ) {
    params.push(matches[1]);
    matches = matcher.exec(uri);
  }

  return params;
};

export const getParametersFromPath = (parameters, path) => {
  const currentPathParameters = getPathParametersFromUri(
    decodeUriFragment(path),
  ); // r
  const pathParameters = parameters.filter((e) => e.in === 'path'); // i
  const otherParameters = parameters.filter((e) => e.in !== 'path'); // o
  const names = map(pathParameters, 'name'); // a
  const namesNotInPathParameters = difference(names, currentPathParameters); // s
  const pathParametersNotInNames = difference(currentPathParameters, names); // u
  const modifiedPathParameters = pathParameters.filter(
    (e) => !namesNotInPathParameters.includes(e.name),
  ); // c
  const modifiedNames = map(modifiedPathParameters, 'name'); // l

  pathParametersNotInNames.forEach((e) => {
    if (!modifiedNames.includes(e)) {
      modifiedPathParameters.push(
        Object.assign(
          Object.assign({}, set({}, ['schema', 'type'], 'string')),
          {
            name: e,
            in: 'path',
            required: true,
          },
        ),
      );
    }
  });

  return [...modifiedPathParameters, ...otherParameters];
};

export const updatePathFromParameters = (path, parameters) => {
  const urlParams = getPathParametersFromUri(path);
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

  return unescapeUri(url)
    .replace(/\/+$/, '')
    .replace(/([^:]\/)\/+/g, '$1');
};

export const modifyParametersFromPath = (params, path) => {
  const urlParams = getPathParametersFromUri(path);
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
      remainingPathParameters.push(
        createPathParamSchema(e, ['schema', 'type']),
      );
    }
  });
  return [...remainingPathParameters, ...notPathParameters];
};

function sortByMethod(method1, method2) {
  const validMethods = Object.keys(validPathMethods);
  const method1Index = validMethods.indexOf(method1); //n
  const method2Index = validMethods.indexOf(method2); // r

  if (method1Index === -1 && method2Index !== -1) {
    return 1;
  } else {
    if (method1Index !== -1 && method2Index === -1) {
      return -1;
    } else {
      return method1Index - method2Index;
    }
  }
}

export const sortOperations = (operations, path) => {
  return [...operations].sort((op1, op2) => sortByMethod(op1[path], op2[path]));
};
