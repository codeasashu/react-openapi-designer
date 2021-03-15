import {
  uniq, has, set, unset, update, isUndefined, assign, get, last, dropRight,
  cloneDeep, isObject
} from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import GenerateSchema from '../../generate-schema';
import OrderedDict from '../../ordered-dict';
const jsf = require('json-schema-faker');
jsf.option({ requiredOnly: false, fillProperties: true, optionalsProbability: 0 });

let fieldNum = 1;

const getLongestIndex = (examples) => {
  let longestExampleIndex = 0;
  Object.keys(examples).forEach((key) => {
    const matches = Array.from(key.matchAll(/example\-([\d]+)/g), m => m[1]);
    let idx = matches.length ? parseInt(matches[0]) : -1;
    idx = isNaN(idx) ? -1 : idx;
    if(idx >= 0)
      longestExampleIndex = Math.max(idx, longestExampleIndex);
  });
  return longestExampleIndex;
}

const generateExampleName = (state, key=null) => {
  const longestIndex = getLongestIndex(state.examples);
  return `example-${longestIndex + 1}`;
};

export const generateExampleFromSchema = createAsyncThunk(
  'schema/generateExample', 
  async ({ key, value }, { getState, dispatch }) => {
    let { schema } = getState();
    key = key || generateExampleName(schema);
    value = value || await jsf.resolve(cloneDeep(schema));
    return { key, value };
  }
);

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

const getParentKey = keys => (keys.length === 1 ? [] : dropRight(keys, 1));

const addRequiredFields = (state, keys, fieldName) => {
  const parentKeys = getParentKey(keys); // parent
  const parentData = parentKeys.length ? get(state, parentKeys) : state;
  const requiredData = [].concat(parentData.required || []);
  requiredData.push(fieldName);
  parentKeys.push('required');
  return set(state, parentKeys, uniq(requiredData));
};

const removeRequireField = (state, keys, fieldName) => {
  const parentKeys = getParentKey(keys); // parent
  const parentData = parentKeys.length ? get(state, parentKeys) : state;
  const requiredData = [].concat(parentData.required || []);
  const filteredRequire = requiredData.filter(i => i !== fieldName);
  parentKeys.push('required');
  return set(state, parentKeys, uniq(filteredRequire));
};

const _addChildField = (state, keys, fieldName) => {
  const currentField = get(state, keys);
  if (isUndefined(currentField)) {
    return state;
  }
  return update(state, keys, n =>
    assign(n, {
      [fieldName]: defaultSchema.string,
    }),
  );
};

const _handleEditorSchemaChange = (state, { value }) => {
  handleSchema(value);
  return { ...state, ...value };
};

const _handleAddChildField = (state, { key }) => {
  const fieldName = `field_${fieldNum++}`;
  const newState = _addChildField(state, key, fieldName);
  return addRequiredFields(newState, key, fieldName);
};

const _handleDelete = (state, { key }) => {
  unset(state, key);
  return state;
};

const _handleAddField = (state, { key, value }) => {
  const propertiesData = get(state, key);
  let newPropertiesData = {};
  const parentKeys = getParentKey(key);
  const parentData = parentKeys.length ? get(state, parentKeys) : state;
  const requiredData = [].concat(parentData.required || []);

  const fieldName = `field_${fieldNum++}`;

  if (value) {
    for (const i in propertiesData) {
      newPropertiesData[i] = propertiesData[i];
      if (i === value) {
        newPropertiesData[fieldName] = defaultSchema.string;
        requiredData.push(fieldName);
      }
    }
  } else {
    newPropertiesData = assign(propertiesData, {
      [fieldName]: defaultSchema.string,
    });
    requiredData.push(fieldName);
  }

  const newState = update(state, key, n => assign(n, newPropertiesData));
  return addRequiredFields(newState, key, fieldName);
};

const _handleChangeType = (state, { key, value }) => {
  const parentKeys = getParentKey(key);
  const parentData = parentKeys.length ? get(state, parentKeys) : state;

  if (parentData.type === value)
    return state;

  const description = parentData.description ? { description: parentData.description } : {};
  const newParentDataItem = { ...defaultSchema[value], ...description };
  if (parentKeys.length) return set(state, parentKeys, newParentDataItem);
  return assign(state, newParentDataItem);
};

const _handleEnableRequire = (state, { key, value, required }) => {
  const parentKeys = getParentKey(key);
  const parentData = parentKeys.length ? get(state, parentKeys) : state;
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
  return set(state, parentKeys, requiredArray);
};

const _handleChangeName = (state, { key, name, value }) => {
  if (!value || !value.length) {
    value = '';
  }
  let items = get(state, key);

  const keyExists = Object.keys(items).indexOf(value) >= 0 && items[value] === 'object';
  if (keyExists || !has(items, name)) {
    return state;
  }

  let orderDict = new OrderedDict(items);
  const keyIndex = orderDict.findIndex(name);
  orderDict.insert(keyIndex, value, items[name]);
  orderDict.remove(name);
  set(state, key, orderDict.toDict());

  const newState = addRequiredFields(state, key, value);
  return removeRequireField(newState, key, name);
};

const _handleChangeValue = (state, { key, value }) => {
  if (value) {
    const parentKeys = getParentKey(key);
    const parentData = parentKeys.length ? get(state, parentKeys) : state;
    const lastKey = last(key);
    if(parentKeys.length)
      set(state, parentKeys, {...parentData, ...{ [lastKey]: value }});
    else state = value;
    return state;
  } else {
    return _handleDelete(state, key);
  }
};

const _handleAddExample = (state, {key, value}) => {
  return set(state, ['examples', key], value);
};

const _handleDeleteExample = (state, key) => {
  unset(state, ['examples', key])
  return state;
};

const _handleRenameExample = (state, { oldTitle, newTitle }) => {
  const oldValue = state.examples[oldTitle];
  let orderDict = new OrderedDict(state.examples);
  const newKeyIndex = orderDict.findIndex(newTitle);
  if(newKeyIndex >= 0) {
    return _handleDeleteExample(state, oldTitle);
  }
  const keyIndex = orderDict.findIndex(oldTitle);
  const inserted = orderDict.insert(keyIndex, newTitle, oldValue);
  if(inserted)
    orderDict.remove(oldTitle);
  set(state, ['examples'], orderDict.toDict());
  return state;
}

const _handleGenerateSchema = (state, code) => {
  let generatedJSON = null;
  try {
    generatedJSON = JSON.parse(code);
  } catch(error) {
    console.warn('[JSON parseError]', error);
    throw 'Invalid JSON';
  }
  if(isObject(generatedJSON)) {
    const value = GenerateSchema(generatedJSON);
    return _handleEditorSchemaChange(state, { value });
  }
  return state;
};

export const schemaSlice = createSlice({
  name: 'schema',
  initialState: {
    title: '',
    type: 'object',
    properties: {},
    required: [],
    examples: {}
  },
  reducers: {
    changeEditorSchema: (state, action) => _handleEditorSchemaChange(state, action.payload),
    changeName: (state, action) => _handleChangeName(state, action.payload),
    changeValue: (state, action) => _handleChangeValue(state, action.payload),
    changeType: (state, action) => _handleChangeType(state, action.payload),
    enableRequire: (state, action) => _handleEnableRequire(state, action.payload),
    deleteItem: (state, action) => _handleDelete(state, action.payload),
    addField: (state, action) => _handleAddField(state, action.payload),
    addChildField: (state, action) => _handleAddChildField(state, action.payload),
    addExample: (state, action) => _handleAddExample(state, action.payload),
    deleteExample: (state, action) => _handleDeleteExample(state, action.payload),
    renameExample: (state, action) => _handleRenameExample(state, action.payload),
    generateSchema: (state, action) => _handleGenerateSchema(state, action.payload),
  },
  extraReducers: {
    [generateExampleFromSchema.fulfilled]: (state, action) => {
      _handleAddExample(state, action.payload);
    }
  }
});

export default schemaSlice.reducer