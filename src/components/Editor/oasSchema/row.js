// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {get, isUndefined} from 'lodash';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {Button, Icon, Intent, TextArea} from '@blueprintjs/core';
import {Popover2, Tooltip2} from '@blueprintjs/popover2';
import LocaleProvider from '../../../utils/locale';
import {isRefSchema} from '../../../utils/schema';
import {SchemaDropdown, AdvancedProperties} from '../../Pickers';
import SchemaTitleEditor from '../../Editor/schemaTitle';
import {eventTypes} from '../../../datasets/tree';

const displayArrayItemEntity = (schema) =>
  schema.type === 'array' &&
  Object.prototype.hasOwnProperty.call(schema.items, 'type')
    ? `${schema.type} [${schema.items.type}]`
    : isRefSchema(schema.items)
    ? `${schema.type} [${displayRefItemEntity(schema.items)}]`
    : null;

const displayRefItemEntity = (schema) =>
  isRefSchema(schema) ? '$ref' + (schema.$ref && `[${schema.$ref}]`) : null;

const SchemaItemEntity = ({schema}) => {
  const type = schema.type || (isRefSchema(schema) && '$ref');
  const textStyles =
    (type === 'object' && 'text-blue-600 dark:text-blue-600') ||
    (type === 'string' && 'text-green-400 dark:text-green-400') ||
    (type === 'boolean' && 'text-yellow-400 dark:text-yellow-400') ||
    (type === '$ref' && 'text-purple-400 dark:text-purple-400') ||
    (type === 'array' && 'text-yellow-600 dark:text-yellow-600') ||
    ((type === 'integer' || type === 'number') &&
      'text-red-400 dark:text-red-400') ||
    'text-black dark:text-white';

  const text =
    displayArrayItemEntity(schema) ||
    displayRefItemEntity(schema) ||
    schema.type;

  return (
    <span
      className={`items-center ${textStyles} cursor-pointer hover:underline truncate`}>
      {text}
    </span>
  );
};

SchemaItemEntity.propTypes = {
  schema: PropTypes.any,
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

  calculatePadding(indentLevel, isObject) {
    let padLeft = 30 * (indentLevel + 1);
    // Objects have arrows before them, hence they are already padded
    padLeft += isObject ? 0 : 60;
    return padLeft;
  }

  render() {
    const {
      stores,
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
    const isEvenRow = this.props.rowIndex % 2 === 0;

    const sidebarOpen = get(sidebar, this.addToPrefix(['properties', 'show']));
    const indent = prefix.length
      ? prefix.filter((name) => name !== 'properties').length
      : -1;
    const padLeft = this.calculatePadding(indent, schema.type === 'object');
    const styles = {paddingLeft: `${padLeft}px`};
    const isParentArray =
      this.props.root || (this.props.parent && this.props.parent === 'array');

    const classes = classnames('flex flex-1', {
      'bg-white bg-opacity-5': isEvenRow,
    });

    return show ? (
      <>
        <div role="schema-row" className="flex">
          <div className={classes}>
            {schema.type === 'object' && (
              <div className="relative flex items-center justify-center cursor-pointer rounded hover:bg-darken-3 z-10 ml-3">
                <Icon
                  iconSize={12}
                  icon="plus"
                  aria-label="add row"
                  onClick={
                    name ? this._handleAddChildField : this._handleAddField
                  }
                />
              </div>
            )}
            <div
              className="flex flex-1 bp4-control-group row-container"
              style={styles}>
              {schema.type === 'object' && (
                <div className="relative flex items-center justify-center cursor-pointer rounded hover:bg-darken-3 z-10 ml-3">
                  <Icon
                    style={{marginRight: '12px'}}
                    onClick={this._handleSidebarOpen}
                    iconSize={12}
                    aria-label="child dropdown"
                    icon={sidebarOpen ? 'caret-down' : 'caret-right'}
                  />
                </div>
              )}

              {!isParentArray && (
                <SchemaTitleEditor
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
                <>
                  <SchemaItemEntity schema={schema} />
                  {isRefSchema(schema) && schema.$ref && (
                    <a
                      role="button"
                      className="text-blue-4 ml-2 whitespace-no-wrap"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        stores.oasStore.eventEmitter.emit(
                          eventTypes.GoToRef,
                          schema.$ref,
                        );
                      }}>
                      (go to ref)
                    </a>
                  )}
                </>
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
                    icon={<Icon iconSize={12} icon="manual" />}
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
                  <Button
                    small
                    minimal
                    icon={<Icon iconSize={12} icon="property" />}
                  />
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
                    icon={<Icon iconSize={12} icon="cross" />}
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
                    icon={<Icon iconSize={12} icon="issue" />}
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
                      icon={<Icon iconSize={12} icon="issue" />}
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
  stores: PropTypes.any,
  rowIndex: PropTypes.number,
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
