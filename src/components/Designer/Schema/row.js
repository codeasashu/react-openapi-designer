// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {get, isUndefined} from 'lodash';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {Button, Intent, TextArea} from '@blueprintjs/core';
import {Popover2, Tooltip2} from '@blueprintjs/popover2';
import LocaleProvider from '../../../utils/locale';
import {DropPlus, SchemaDropdown} from '../../Common/dropdown';
import DebouncedInput from './debounced-input';
import AdvancedProperties from './advanced-properties';

const SchemaItemEntity = ({type, text}) => {
  const textStyles =
    (type === 'object' && 'text-blue-600 dark:text-blue-600') ||
    (type === 'string' && 'text-green-400 dark:text-green-400') ||
    (type === 'boolean' && 'text-yellow-400 dark:text-yellow-400') ||
    (type === 'array' && 'text-yellow-600 dark:text-yellow-600') ||
    ((type === 'integer' || type === 'number') &&
      'text-red-400 dark:text-red-400') ||
    'text-black dark:text-white';
  return (
    <div
      role="row-schema"
      className={`flex flex-no-wrap items-center ${textStyles} cursor-pointer hover:underline truncate`}>
      <span>{text}</span>
    </div>
  );
};

SchemaItemEntity.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
};

@autoBindMethodsForReact()
class Row extends React.PureComponent {
  _handleAddField() {
    const {fieldPrefix, fieldName} = this.props;
    this.props.handleField({key: fieldPrefix, value: fieldName});
  }

  _handleAddChildField() {
    const key = this.addToPrefix(['properties']);
    this.props.handleChildField({key});
  }

  _handleChangeName(value) {
    const {fieldPrefix, fieldName} = this.props;
    this.props.handleName({key: fieldPrefix, name: fieldName, value});
  }

  _handleSidebarOpen() {
    const key = this.addToPrefix(['properties']);
    this.props.handleSidebar({key});
  }

  _handleChangeSchemaType(value, prefix = ['type']) {
    const key = this.addToPrefix(prefix);
    this.props.handleSchemaType({key, value});
  }

  _handleChangeTitle(value) {
    const key = this.addToPrefix(['title']);
    this.props.handleTitle({key, value});
  }

  _handleChangeDescription(e) {
    const key = this.addToPrefix(['description']);
    this.props.handleDescription({key, value: e.target.value});
  }

  _handleDeleteItem() {
    const key = this.addToPrefix([]);
    this.props.handleDelete({key});
  }

  _handleToggleRequire() {
    const {fieldPrefix, fieldName, required} = this.props;
    this.props.handleRequire({
      key: fieldPrefix,
      value: fieldName,
      required: !required,
    });
  }

  _handleAdvancedProperty(value) {
    const key = this.addToPrefix([]);
    this.props.handleAdditionalProperties({key, value});
  }

  addToPrefix(fields) {
    return []
      .concat(this.props.fieldPrefix, this.props.fieldName, [...fields])
      .filter(Boolean);
  }

  getSubType(schema) {
    return schema.type === 'array'
      ? !isUndefined(schema.items) && schema.items.type
      : null;
  }

  render() {
    const {
      show,
      schema,
      sidebar,
      required,
      fieldName,
      fieldPrefix,
      children,
    } = this.props;

    const prefix = fieldPrefix || [];
    const name = fieldName || null;

    const sidebarOpen = get(sidebar, this.addToPrefix(['properties', 'show']));
    const indent = prefix.length
      ? prefix.filter((name) => name !== 'properties').length
      : -1;
    let padLeft = 30 * (indent + 1);
    padLeft += schema.type === 'object' ? 0 : 50;
    const styles = {paddingLeft: `${padLeft}px`};
    const isParentArray =
      this.props.root || (this.props.parent && this.props.parent === 'array');

    return show ? (
      <>
        <div role="schema-row" className="flex">
          <div className="flex flex-1">
            {!!name && schema.type === 'object' ? (
              <DropPlus
                handleAddField={this._handleAddField}
                handleAddChildField={this._handleAddChildField}
              />
            ) : (
              schema.type === 'object' && (
                <Button
                  small
                  minimal
                  icon="plus"
                  aria-label="add row"
                  onClick={this._handleAddField}
                />
              )
            )}
            <div
              className="flex flex-1 bp3-control-group row-container"
              style={styles}>
              {schema.type === 'object' && (
                <Button
                  style={{marginRight: '2px'}}
                  onClick={this._handleSidebarOpen}
                  small
                  minimal
                  aria-label="child dropdown"
                  icon={sidebarOpen ? 'chevron-down' : 'chevron-right'}
                />
              )}

              {!isParentArray && (
                <DebouncedInput
                  className="pl-1"
                  onChange={this._handleChangeName}
                  placeholder="field name"
                  value={name || ''}
                  small
                />
              )}
              {!!name && !isParentArray && <span>&nbsp;:&nbsp;</span>}
              <SchemaDropdown
                handleOnClick={this._handleChangeSchemaType}
                schema={schema}>
                <SchemaItemEntity
                  type={schema.type}
                  text={
                    schema.type === 'array' &&
                    Object.prototype.hasOwnProperty.call(schema.items, 'type')
                      ? `${schema.type} [${schema.items.type}]`
                      : schema.type
                  }
                />
              </SchemaDropdown>
            </div>
            <span>
              <Popover2
                inheritDarkTheme
                content={
                  <TextArea
                    className="outline-none border-0"
                    aria-label={'description'}
                    growVertically
                    value={schema.description || ''}
                    onChange={this._handleChangeDescription}
                  />
                }
                placement="left">
                <Tooltip2
                  role={'description'}
                  content={<span>Description</span>}>
                  <Button
                    small
                    minimal
                    icon="manual"
                    intent={schema.description ? Intent.PRIMARY : null}
                  />
                </Tooltip2>
              </Popover2>
            </span>
            <span>
              <Popover2
                content={
                  <AdvancedProperties
                    data={JSON.stringify(schema, null, 2)}
                    onChange={this._handleAdvancedProperty}
                  />
                }
                placement="right">
                <Tooltip2
                  role={'advanced properties'}
                  content={<span>{LocaleProvider('adv_setting')}</span>}>
                  <Button small minimal icon="property" />
                </Tooltip2>
              </Popover2>
            </span>
            {!!name && (
              <span>
                <Tooltip2 content="Delete field">
                  <Button
                    onClick={this._handleDeleteItem}
                    role={'delete row'}
                    small
                    minimal
                    icon="cross"
                  />
                </Tooltip2>
              </span>
            )}
            {!!name && (
              <span>
                {isParentArray ? (
                  <Button
                    disabled={isParentArray}
                    small
                    minimal
                    icon="issue"
                    role={'required field'}
                    onClick={this._handleToggleRequire}
                    intent={required ? Intent.DANGER : null}
                  />
                ) : (
                  <Tooltip2
                    role={'required field'}
                    content={LocaleProvider('required')}>
                    <Button
                      disabled={isParentArray}
                      small
                      minimal
                      icon="issue"
                      onClick={this._handleToggleRequire}
                      intent={required ? Intent.DANGER : null}
                    />
                  </Tooltip2>
                )}
              </span>
            )}
          </div>
        </div>
        {children}
      </>
    ) : null;
  }
}

Row.propTypes = {
  fieldPrefix: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  fieldName: PropTypes.string,
  required: PropTypes.bool,
  show: PropTypes.bool,
  schema: PropTypes.object,
  sidebar: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.element]),
  parent: PropTypes.string,
  root: PropTypes.bool,
  handleChildField: PropTypes.func,
  handleField: PropTypes.func,
  handleName: PropTypes.func,
  handleSidebar: PropTypes.func,
  handleSchemaType: PropTypes.func,
  handleTitle: PropTypes.func,
  handleDescription: PropTypes.func,
  handleDelete: PropTypes.func,
  handleRequire: PropTypes.func,
  handleAdditionalProperties: PropTypes.func,
};

export default Row;
