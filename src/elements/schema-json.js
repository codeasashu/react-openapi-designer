import React, { PureComponent } from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { isUndefined, get } from 'lodash';
import SchemaRow from './schema-row';

const mapping = (name, schema, props) => {
  switch (schema.type) {
    case 'array':
      return <SchemaArray prefix={name} schema={schema} wrapperProps={props} />;
    case 'object':
      const nameArray = [].concat(name, 'properties');
      return <SchemaObject prefix={nameArray} schema={schema} wrapperProps={props} />;
    default:
      return null;
  }
};

class SchemaArray extends PureComponent {
  shouldShowSubItems(schema) {
    return !isUndefined(schema.items) && ['object', 'array'].indexOf(schema.items.type) >= 0;
  }

  render() {
    const { prefix, schema, wrapperProps } = this.props;
    return this.shouldShowSubItems(schema) ? (<SchemaRow
        show={!isUndefined(schema.items)}
        schema={schema.items}
        sidebar={wrapperProps.open}
        required={false}
        parent={schema.type}
        fieldName={'items'}
        fieldPrefix={prefix}
        handleName={() => {}}
        handleChildField={({ key }) => {
          wrapperProps.addChildField({ key });
          wrapperProps.setOpenDropdownPath({ key, value: true });
        }}
        handleDelete={({ key }) => {
          wrapperProps.changeValue({ key, value: {} });
        }}
        handleSidebar={wrapperProps.setOpenDropdownPath}
        handleSchemaType={wrapperProps.changeType}
        handleTitle={wrapperProps.changeValue}
        handleDescription={wrapperProps.changeValue}
        handleAdditionalProperties={wrapperProps.changeValue}
        handleRequire={wrapperProps.enableRequire}>
        {mapping([].concat(prefix, 'items'), schema.items, wrapperProps)}
      </SchemaRow>
    ) : (null);
  }
}

const raiseError = ({ key, name, value }) => console.error(`The field "${value}" already exists.`);

const exists = (data, value) =>
  data.properties[value] && typeof data.properties[value] === 'object';

@autoBindMethodsForReact()
class SchemaItem extends PureComponent {
  render() {
    const { name, prefix, schema, wrapperProps } = this.props;
    const itemSchema = Object.assign({}, { title: '', description: '' }, schema.properties[name]);
    const isRequired = isUndefined(schema.required)
      ? false
      : schema.required.indexOf(name) !== -1;

    return (
      <SchemaRow
        show={get(wrapperProps.open, [].concat(prefix, 'show'))}
        schema={itemSchema}
        sidebar={wrapperProps.open}
        fieldName={name}
        fieldPrefix={prefix}
        required={isRequired}
        handleName={({ key, name, value }) => {
          if (exists(schema, value)) return raiseError({ key, name, value });
          wrapperProps.changeName({ key, name, value });
        }}
        handleField={wrapperProps.addField}
        handleChildField={({ key }) => {
          wrapperProps.addChildField({ key });
          wrapperProps.setOpenDropdownPath({ key, value: true });
        }}
        handleSidebar={wrapperProps.setOpenDropdownPath}
        handleSchemaType={wrapperProps.changeType}
        handleTitle={wrapperProps.changeValue}
        handleDescription={wrapperProps.changeValue}
        handleAdditionalProperties={wrapperProps.changeValue}
        handleDelete={({ key }) => {
          wrapperProps.deleteItem({ key });
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

class SchemaObject extends PureComponent {
  render() {
    const { prefix, schema, wrapperProps } = this.props;
    return (
      <>
        {Object.keys(schema.properties).map((name, index) => {
          return (
            <SchemaItem
              key={index}
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

const SchemaJson = props => {
  const { wrapperProps } = props;
  const item = mapping([], wrapperProps.schema, wrapperProps);
  return <React.Fragment>{item}</React.Fragment>;
};

export default SchemaJson;
