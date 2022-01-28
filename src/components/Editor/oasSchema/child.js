//@flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {isUndefined, get} from 'lodash';
import SchemaRow from './row';

const mapping = (name, schema, props, stores) => {
  const nameArray = [].concat(name, 'properties');
  switch (schema.type) {
    case 'array':
      return (
        <SchemaArray
          prefix={name}
          schema={schema}
          wrapperProps={props}
          stores={stores}
        />
      );
    case 'object':
      return (
        <SchemaObject
          prefix={nameArray}
          schema={schema}
          wrapperProps={props}
          stores={stores}
        />
      );
    default:
      return null;
  }
};

class SchemaArray extends PureComponent {
  shouldShowSubItems(schema) {
    return (
      !isUndefined(schema.items) &&
      ['object', 'array'].indexOf(schema.items.type) >= 0
    );
  }

  render() {
    const {stores, prefix, schema, wrapperProps} = this.props;
    return this.shouldShowSubItems(schema) ? (
      <SchemaRow
        stores={stores}
        show={!isUndefined(schema.items)}
        schema={schema.items}
        sidebar={wrapperProps.open}
        required={false}
        parent={schema.type}
        fieldName={'items'}
        fieldPrefix={prefix}
        handleName={() => {}}
        handleChildField={({key}) => {
          wrapperProps.addChildField({key});
          wrapperProps.setOpenDropdownPath({key, value: true});
        }}
        handleDelete={({key}) => {
          wrapperProps.changeValue({key, value: {}});
        }}
        handleSidebar={wrapperProps.setOpenDropdownPath}
        handleSchemaType={wrapperProps.changeType}
        handleTitle={wrapperProps.changeValue}
        handleDescription={wrapperProps.changeValue}
        handleAdditionalProperties={wrapperProps.changeValue}
        handleRequire={wrapperProps.enableRequire}>
        {mapping([].concat(prefix, 'items'), schema.items, wrapperProps)}
      </SchemaRow>
    ) : null;
  }
}

SchemaArray.propTypes = {
  stores: PropTypes.object,
  name: PropTypes.string,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  schema: PropTypes.object,
  wrapperProps: PropTypes.object,
};

const raiseError = ({value}) =>
  console.error(`The field "${value}" already exists.`);

const exists = (data, value) =>
  data.properties[value] && typeof data.properties[value] === 'object';

@autoBindMethodsForReact()
class SchemaItem extends PureComponent {
  render() {
    const {name, prefix, stores, schema, wrapperProps} = this.props;
    const itemSchema = Object.assign(
      {},
      {title: '', description: ''},
      schema.properties[name],
    );
    const isRequired = isUndefined(schema.required)
      ? false
      : schema.required.indexOf(name) !== -1;

    return (
      <SchemaRow
        stores={stores}
        show={get(wrapperProps.open, [].concat(prefix, 'show'))}
        rowIndex={this.props.rowIndex}
        schema={itemSchema}
        sidebar={wrapperProps.open}
        fieldName={name}
        fieldPrefix={prefix}
        required={isRequired}
        handleName={({key, name, value}) => {
          if (exists(schema, value)) return raiseError({key, name, value});
          wrapperProps.changeName({key, name, value});
        }}
        handleField={wrapperProps.addField}
        handleChildField={({key}) => {
          wrapperProps.addChildField({key});
          wrapperProps.setOpenDropdownPath({key, value: true});
        }}
        handleSidebar={wrapperProps.setOpenDropdownPath}
        handleSchemaType={wrapperProps.changeType}
        handleTitle={wrapperProps.changeValue}
        handleDescription={wrapperProps.changeValue}
        handleAdditionalProperties={wrapperProps.changeValue}
        handleDelete={({key}) => {
          wrapperProps.deleteItem({key});
          wrapperProps.enableRequire({
            key: prefix,
            value: name,
            required: false,
          });
        }}
        handleRequire={wrapperProps.enableRequire}>
        {mapping([].concat(prefix, name), itemSchema, wrapperProps)}
      </SchemaRow>
    );
  }
}

SchemaItem.propTypes = {
  stores: PropTypes.object,
  rowIndex: PropTypes.number,
  name: PropTypes.string,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  schema: PropTypes.object,
  wrapperProps: PropTypes.object,
};

class SchemaObject extends PureComponent {
  render() {
    const {prefix, schema, stores, wrapperProps} = this.props;
    return (
      <>
        {schema.properties &&
          Object.keys(schema.properties).map((name, index) => {
            return (
              <SchemaItem
                stores={stores}
                key={index}
                rowIndex={index}
                name={name}
                schema={schema}
                prefix={prefix}
                wrapperProps={wrapperProps}
              />
            );
          })}
      </>
    );
  }
}

SchemaObject.propTypes = {
  stores: PropTypes.object,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  schema: PropTypes.object,
  wrapperProps: PropTypes.object,
};

const SchemaChild = (props) => {
  const {wrapperProps, stores} = props;
  const item = mapping([], wrapperProps.schema, wrapperProps, stores);
  return <React.Fragment>{item}</React.Fragment>;
};

SchemaChild.propTypes = {
  wrapperProps: PropTypes.object,
  stores: PropTypes.object,
};

export default SchemaChild;
