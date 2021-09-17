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
