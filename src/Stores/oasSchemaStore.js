import {makeObservable, observable, reaction, computed, action} from 'mobx';
import {
  set,
  isUndefined,
  get,
  uniq,
  has,
  unset,
  last,
  dropRight,
  cloneDeep,
  isObject,
} from 'lodash';
import OrderedDict from '../utils/ordered-dict';
import {generateExampleName} from '../utils';
import GenerateSchema from '../utils/generate-schema';
import {nodeOperations, NodeTypes} from '../datasets/tree';
import {schema as defaultSchema} from '../datasets/openapi';
import {fillSchema} from '../utils/schema';
import {schemaWalk} from '@cloudflare/json-schema-walker';
import jsf from 'json-schema-faker';

jsf.define('fixedValue', (value, schema) => {
  switch (schema?.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return true;
    default:
      return value;
  }
});

const getParentKey = (keys) => (keys.length === 1 ? [] : dropRight(keys, 1));

class OasSchemaStore {
  relativeJsonPath;
  sourceNodeId;
  sidebar = {
    properties: {show: true},
  };

  constructor(props, options) {
    makeObservable(this, {
      relativeJsonPath: observable,
      sidebar: observable,
      sourceNodeId: observable,
      sourceNode: computed,
      schema: computed,
      setOpenDropdownPath: action,
      addChildField: action,
      changeType: action,
    });
    this.fieldNum = 1;

    jsf.option({
      requiredOnly: false,
      fillProperties: true,
      optionalsProbability: 0,
      alwaysFakeOptionals: true,
    });

    const {relativeJsonPath, sourceNodeId} = props;
    this.stores = options.stores;
    this.relativeJsonPath = relativeJsonPath;
    this.sourceNodeId = sourceNodeId;
    this._schema = this.getSchema();

    reaction(
      () => this.schema,
      (value) => {
        this._schema = value;
      },
      {
        fireImmediately: true,
      },
    );
  }

  get isModelNode() {
    const {activeNode} = this.stores.uiStore;
    return activeNode && activeNode.type === NodeTypes.Model;
  }

  generateSchema(code) {
    let generatedJSON = null;
    try {
      generatedJSON = JSON.parse(code);
    } catch (error) {
      console.warn('[JSON parseError]', error);
      throw 'Invalid JSON';
    }
    if (isObject(generatedJSON)) {
      const value = GenerateSchema(generatedJSON);
      this.schema = fillSchema(value);
    }
  }

  setOpenDropdownPath(key, value) {
    const sidebar = cloneDeep(this.sidebar);
    const path = [].concat(key, 'show');
    const isOpen = get(sidebar, path) === true;
    const status = isUndefined(value) ? !isOpen : !!value;
    set(sidebar, path, status);
    this.sidebar = sidebar;
  }

  addChildField(key) {
    const schema = cloneDeep(this._schema);
    const fieldName = `field_${this.fieldNum++}`;
    const updatedSchema = set(
      schema,
      [...key, fieldName],
      defaultSchema.string,
    );
    const _schema = this.addRequiredFields(updatedSchema, key, fieldName);
    this.schema = _schema;
  }

  changeValue(key, value) {
    let schema = cloneDeep(this._schema);
    if (value) {
      const parentKeys = getParentKey(key);
      const parentData = parentKeys.length ? get(schema, parentKeys) : schema;
      const lastKey = last(key);
      if (parentKeys.length)
        set(schema, parentKeys, {...parentData, ...{[lastKey]: value}});
      else schema = value;
      this.schema = schema;
    } else {
      this.deleteItem(key);
    }
  }

  changeName(key, name, value) {
    let schema = cloneDeep(this._schema);
    if (!value || !value.length) {
      value = '';
    }
    let items = get(schema, key);

    const keyExists =
      Object.keys(items).indexOf(value) >= 0 && items[value] === 'object';
    if (keyExists || !has(items, name)) {
      this.schema = schema;
    }

    let orderDict = new OrderedDict(items);
    const keyIndex = orderDict.findIndex(name);
    orderDict.insert(keyIndex, value, items[name]);
    orderDict.remove(name);
    set(schema, key, orderDict.toDict());

    const newState = this.addRequiredFields(schema, key, value);
    this.schema = this.removeRequireField(newState, key, name);
  }

  enableRequire(key, value, required) {
    const schema = cloneDeep(this._schema);
    const parentKeys = getParentKey(key);
    const parentData = parentKeys.length ? get(schema, parentKeys) : schema;
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
    this.schema = set(schema, parentKeys, requiredArray);
  }

  deleteItem(key) {
    let schema = cloneDeep(this._schema);
    unset(schema, key);
    this.schema = schema;
  }

  removeRequireField(state, keys, fieldName) {
    const parentKeys = getParentKey(keys); // parent
    const parentData = parentKeys.length ? get(state, parentKeys) : state;
    const requiredData = [].concat(parentData.required || []);
    const filteredRequire = requiredData.filter((i) => i !== fieldName);
    parentKeys.push('required');
    return set(state, parentKeys, uniq(filteredRequire));
  }

  generateExampleFromSchema() {
    const schema = cloneDeep(this._schema);
    const key = generateExampleName(this.examples || {});
    schemaWalk(
      schema,
      (_schema) => {
        if (Object.prototype.hasOwnProperty.call(_schema, 'type')) {
          switch (_schema.type.toLowerCase()) {
            case 'string':
            case 'integer':
            case 'boolean':
            case 'number':
              _schema['fixedValue'] = true;
          }
        }
      },
      null,
    );
    const value = jsf.generate(
      cloneDeep({...schema, additionalProperties: false}),
    );
    this.addExample(key, value);
  }

  get isXExample() {
    const path = this.examplesPath;
    return path && path[path.length - 1] === 'x-examples';
  }

  get examplesPath() {
    if (this.isModelNode) {
      return this.relativeJsonPath.concat(['x-examples']);
    }
    return this.relativeJsonPath.slice(0, -1).concat(['examples']);
  }

  get examples() {
    return get(this.sourceNodeData, this.examplesPath);
  }

  addExample(name, value) {
    const toAppend = this.isModelNode ? [name] : [name, 'value'];
    this.updateSpec(this.examplesPath.concat([...toAppend]), value);
  }

  renameExample(oldTitle, newTitle) {
    const examples = cloneDeep(this.examples);
    if (oldTitle === newTitle) {
      return;
    }
    const oldValue = this.examples[oldTitle];
    let orderDict = new OrderedDict(examples);
    const newKeyIndex = orderDict.findIndex(newTitle);
    if (newKeyIndex >= 0) {
      return this.deleteExample(oldTitle);
    }
    const keyIndex = orderDict.findIndex(oldTitle);
    const inserted = orderDict.insert(keyIndex, newTitle, oldValue);
    if (inserted) orderDict.remove(oldTitle);
    this.updateSpec(this.examplesPath, orderDict.toDict());
  }

  deleteExample(key) {
    const schema = cloneDeep(this._schema);
    unset(schema, ['examples', key]);
    this.schema = schema;
  }

  changeType(key, value) {
    const schema = cloneDeep(this._schema);
    const parentKeys = getParentKey(key);
    const parentData = parentKeys.length ? get(schema, parentKeys) : schema;
    if (parentData && parentData.type === value) return schema;
    const description =
      parentData && parentData.description
        ? {description: parentData.description}
        : {};
    const valueSchema =
      key.indexOf('$ref') >= 0 ? {$ref: value} : defaultSchema[value];
    const newParentDataItem = {
      ...valueSchema,
      ...description,
    };
    if (parentKeys.length) {
      this.schema = set(schema, parentKeys, newParentDataItem);
    } else {
      this.schema = newParentDataItem;
    }
  }

  addRequiredFields(state, keys, fieldName) {
    const parentKeys = getParentKey(keys); // parent
    const parentData = parentKeys.length ? get(state, parentKeys) : state;
    const requiredData = [].concat(parentData.required || []);
    requiredData.push(fieldName);
    parentKeys.push('required');
    return set(state, parentKeys, uniq(requiredData));
  }

  get sourceNode() {
    return this.stores.graphStore.getNodeById(this.sourceNodeId);
  }

  getSchema() {
    if (this.relativeJsonPath && this.relativeJsonPath.length > 0) {
      return get(this.sourceNodeData, this.relativeJsonPath);
    } else {
      return this.sourceNodeData;
    }
  }

  get sourceNodeData() {
    const node = this.sourceNode;

    if (!node) {
      console.log('No schema', node);
      return null;
    }

    return node.data.parsed;
  }

  updateSpec(path, value) {
    if (path) {
      this.stores.graphStore.graph.patchSourceNodeProp(
        this.sourceNodeId,
        'data.parsed',
        [
          {
            op: nodeOperations.Replace,
            path,
            value,
          },
        ],
      );
    }
  }

  get schema() {
    return this.getSchema();
  }

  set schema(value) {
    this.stores.graphStore.graph.patchSourceNodeProp(
      this.sourceNodeId,
      'data.parsed',
      [
        {
          op: nodeOperations.Replace,
          path: this.relativeJsonPath ? this.relativeJsonPath : [],
          value,
        },
      ],
    );
  }
}

export default OasSchemaStore;
