import _ from 'lodash';
import { combineReducers } from 'redux';

const CHANGE_EDITOR_SCHEMA = 'CHANGE_EDITOR_SCHEMA';
const CHANGE_NAME = 'CHANGE_NAME';
const CHANGE_VALUE = 'CHANGE_VALUE';
const CHANGE_TYPE = 'CHANGE_TYPE';
const ENABLE_REQUIRE = 'ENABLE_REQUIRE';
const REQUIRE_ALL = 'REQUIRE_ALL';
const DELETE_ITEM = 'DELETE_ITEM';
const ADD_FIELD = 'ADD_FIELD';
const ADD_CHILD_FIELD = 'ADD_CHILD_FIELD';
const SET_OPEN_VALUE = 'SET_OPEN_VALUE';

let fieldNum = 1;

const defaultSchema = {
  string: {
    type: 'string',
  },
  number: {
    type: 'number',
  },
  array: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  object: {
    type: 'object',
    properties: {},
  },
  boolean: {
    type: 'boolean',
  },
  integer: {
    type: 'integer',
  },
};

const initialSchema = {
  title: '',
  type: 'object',
  properties: {},
  required: [],
};

function handleType(schema) {
  if (!schema.type && schema.properties && typeof schema.properties === 'object') {
    schema.type = 'object';
  }
}

function handleSchema(schema) {
  if (schema && !schema.type && !schema.properties) {
    schema.type = 'string';
  }
  handleType(schema);
  if (schema.type === 'object') {
    if (!schema.properties) schema.properties = {};
    handleObject(schema.properties, schema);
  } else if (schema.type === 'array') {
    if (!schema.items) schema.items = { type: 'string' };
    handleSchema(schema.items);
  } else {
    return schema;
  }
}

function handleObject(properties) {
  for (const key in properties) {
    handleType(properties[key]);
    if (properties[key].type === 'array' || properties[key].type === 'object')
      handleSchema(properties[key]);
  }
}

const getParentKey = keys => (keys.length === 1 ? [] : _.dropRight(keys, 1));

const addRequiredFields = (state, keys, fieldName) => {
  const parentKeys = getParentKey(keys); // parent
  const parentData = parentKeys.length ? _.get(state, parentKeys) : state;
  const requiredData = [].concat(parentData.required || []);
  requiredData.push(fieldName);
  parentKeys.push('required');
  return _.set(state, parentKeys, _.uniq(requiredData));
};

const removeRequireField = (state, keys, fieldName) => {
  const parentKeys = getParentKey(keys); // parent
  const parentData = parentKeys.length ? _.get(state, parentKeys) : state;
  const requiredData = [].concat(parentData.required || []);
  const filteredRequire = requiredData.filter(i => i !== fieldName);
  parentKeys.push('required');
  return _.set(state, parentKeys, _.uniq(filteredRequire));
};

const _addChildField = (state, keys, fieldName) => {
  const currentField = _.get(state, keys);
  if (_.isUndefined(currentField)) {
    return state;
  }
  return _.update(state, keys, n =>
    _.assign(n, {
      [fieldName]: defaultSchema.string,
    }),
  );
};

const _handleEditorSchemaChange = (state, { value }) => {
  handleSchema(value);
  return { ...state, ...value };
};

const _handleAddChildField = (state, { keys, fieldNum }) => {
  const fieldName = `field_${fieldNum}`;
  const originalState = _.cloneDeep(state);
  const newState = _addChildField(originalState, keys, fieldName);
  return addRequiredFields(newState, keys, fieldName);
};

const _handleDelete = (state, { key }) => {
  const clonedState = _.cloneDeep(state);
  _.unset(clonedState, key);
  return clonedState;
};

const _handleAddField = (state, { key, value, fieldNum }) => {
  const clonedState = _.cloneDeep(state);
  const propertiesData = _.get(state, key);
  let newPropertiesData = {};
  const parentKeys = getParentKey(key);
  const parentData = parentKeys.length ? _.get(state, parentKeys) : clonedState;
  const requiredData = [].concat(parentData.required || []);

  const fieldName = `field_${fieldNum}`;

  if (value) {
    for (const i in propertiesData) {
      newPropertiesData[i] = propertiesData[i];
      if (i === value) {
        newPropertiesData[fieldName] = defaultSchema.string;
        requiredData.push(fieldName);
      }
    }
  } else {
    newPropertiesData = _.assign(propertiesData, {
      [fieldName]: defaultSchema.string,
    });
    requiredData.push(fieldName);
  }

  const newState = _.update(clonedState, key, n => _.assign(n, newPropertiesData));
  return addRequiredFields(newState, key, fieldName);
};

const _handleChangeType = (state, { key, value }) => {
  console.log('key', key, value);
  const clonedState = _.cloneDeep(state);
  const parentKeys = getParentKey(key);
  const parentData = parentKeys.length ? _.get(clonedState, parentKeys) : clonedState;

  if (parentData.type === value) {
    return clonedState;
  }

  const description = parentData.description ? { description: parentData.description } : {};
  const newParentDataItem = { ...defaultSchema[value], ...description };
  if (parentKeys.length) return _.set(clonedState, parentKeys, newParentDataItem);
  return _.assign(clonedState, newParentDataItem);
};

const _handleEnableRequire = (state, { key, value, required }) => {
  const parentKeys = getParentKey(key);
  const clonedState = _.cloneDeep(state);
  const parentData = parentKeys.length ? _.get(clonedState, parentKeys) : clonedState;
  const requiredArray = [].concat(parentData.required || []);
  const requiredFieldIndex = requiredArray.indexOf(value);
  const foundRequired = requiredFieldIndex >= 0;

  if (!required && foundRequired) {
    // Remove from required arr
    requiredArray.splice(requiredFieldIndex, 1);
  } else if (required && !foundRequired) {
    // Add to required arr
    requiredArray.push(value);
  }
  parentKeys.push('required');
  return _.set(clonedState, parentKeys, requiredArray);
};

const _handleChangeName = (state, { key, name, value }) => {
  if (!value || !value.length) {
    return state;
  }
  const clonedState = _.cloneDeep(state);
  const items = _.get(clonedState, key);

  const keyExists = Object.keys(items).indexOf(value) >= 0 && items[value] === 'object';
  if (keyExists || !_.has(items, name)) {
    return state;
  }

  items[value] = items[name];
  delete items[name];

  const newState = addRequiredFields(clonedState, key, value);
  return removeRequireField(newState, key, name);
};

const _handleChangeValue = (state, { keys, value }) => {
  const clonedState = _.cloneDeep(state);
  if (value) {
    const parentKeys = getParentKey(keys);
    const parentData = parentKeys.length ? _.get(state, parentKeys) : clonedState;
    const lastKey = _.last(keys);
    return _.set(clonedState, parentKeys, {
      ...parentData,
      ...{ [lastKey]: value },
    });
  } else {
    return _handleDelete(clonedState, keys);
  }
};

export const schemaReducer = (state = initialSchema, action) => {
  switch (action.type) {
    case CHANGE_EDITOR_SCHEMA:
      return _handleEditorSchemaChange(state, action.payload);
    case ADD_CHILD_FIELD:
      return _handleAddChildField(state, action.payload);
    case DELETE_ITEM:
      return _handleDelete(state, action.payload);
    case ADD_FIELD:
      return _handleAddField(state, action.payload);
    case CHANGE_TYPE:
      return _handleChangeType(state, action.payload);
    case ENABLE_REQUIRE:
      return _handleEnableRequire(state, action.payload);
    case CHANGE_NAME:
      return _handleChangeName(state, action.payload);
    case CHANGE_VALUE:
      return _handleChangeValue(state, action.payload);
    default:
      return state;
  }
};

const initialOpenState = {
  properties: true,
};

export const openReducer = (state = initialOpenState, action) => {
  switch (action.type) {
    case SET_OPEN_VALUE:
      const { key, value } = action.payload;
      const clonedState = _.cloneDeep(state);
      const status = _.isUndefined(value) ? !_.get(state, key) : !!value;
      return _.set(clonedState, key, status);
    default:
      return state;
  }
};

export const reducer = combineReducers({
  open: openReducer,
  schema: schemaReducer,
});

// Actions
export const changeEditorSchema = ({ value }) => ({
  type: CHANGE_EDITOR_SCHEMA,
  payload: { value },
});

export const changeName = ({ key, name, value }) => ({
  type: CHANGE_NAME,
  payload: { key, name, value },
});

export const changeValue = ({ key, value }) => ({
  type: CHANGE_VALUE,
  payload: { keys: key, value },
});

export const changeType = ({ key, value }) => ({
  type: CHANGE_TYPE,
  payload: { key, value },
});

export const enableRequire = ({ key, value, required }) => ({
  type: ENABLE_REQUIRE,
  payload: { key, value, required },
});

export const requireAll = payload => ({
  type: REQUIRE_ALL,
  payload,
});

export const deleteItem = ({ key }) => ({
  type: DELETE_ITEM,
  payload: { key },
});

export const addField = ({ key, value }) => ({
  type: ADD_FIELD,
  payload: { key, value, fieldNum: fieldNum++ },
});

export const addChildField = ({ key }) => ({
  type: ADD_CHILD_FIELD,
  payload: {
    keys: key, // @TODO change key to keys
    fieldNum: fieldNum++,
  },
});

export const setOpenValue = ({ key, value }) => ({
  type: SET_OPEN_VALUE,
  payload: { key, value },
});
