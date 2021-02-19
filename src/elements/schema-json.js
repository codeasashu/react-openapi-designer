import React, { PureComponent } from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import _ from 'lodash';
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
  render() {
    const { prefix, schema, wrapperProps } = this.props;

    return (
      <SchemaRow
        show={!_.isUndefined(schema.items)}
        schema={schema.items}
        sidebar={wrapperProps.open}
        fieldName={'items'}
        fieldPrefix={prefix}
        handleName={() => {}}
        handleChildField={({ key }) => {
          wrapperProps.addChildField({ key });
          wrapperProps.setOpenValue({ key, value: true });
        }}
        handleSidebar={wrapperProps.setOpenValue}
        handleSchemaType={wrapperProps.changeType}
        handleTitle={wrapperProps.changeValue}
        handleDescription={wrapperProps.changeValue}
        handleSettings={wrapperProps.showAdv}>
        {mapping([].concat(prefix, 'items'), schema.items, wrapperProps)}
      </SchemaRow>
    );
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
    const isRequired = _.isUndefined(schema.required)
      ? false
      : schema.required.indexOf(name) !== -1;

    return (
      <SchemaRow
        show={_.get(wrapperProps.open, prefix)}
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
          wrapperProps.setOpenValue({ key, value: true });
        }}
        handleSidebar={wrapperProps.setOpenValue}
        handleSchemaType={wrapperProps.changeType}
        handleTitle={wrapperProps.changeValue}
        handleDescription={wrapperProps.changeValue}
        handleSettings={wrapperProps.showAdv}
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
