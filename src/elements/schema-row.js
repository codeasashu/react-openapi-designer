import React from 'react';
import { get, isUndefined } from 'lodash';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { Colors, AnchorButton, Button, Intent, TextArea } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import LocaleProvider from '../locale';
import DropPlus from '../ui/drop-plus';
import SchemaSelectors from './schema-selectors';
import DebouncedInput from './debounced-input';
import AdvancedProperties from './advanced-properties';


const SchemaItemEntity = ({ text }) => {
  const color = (text === 'object' && Colors.BLUE5)
        || (text === 'string' && Colors.GREEN5)
        || (text === 'boolean' && Colors.YELLOW5)
        || ((text === 'integer' || text === 'number') && Colors.RED5)
        || Colors.BLACK;
  return (
    <div className="flex flex-no-wrap items-center text-blue-6 dark:text-blue-4 cursor-pointer hover:underline truncate">
      <div style={{ color }}>{ text }</div>
    </div>
  )
}

@autoBindMethodsForReact()
class SchemaRow extends React.PureComponent {
  _handleAddField(e) {
    const { fieldPrefix, fieldName } = this.props;
    this.props.handleField({ key: fieldPrefix, value: fieldName });
  }

  _handleAddChildField(e) {
    const key = this.addToPrefix(['properties']);
    this.props.handleChildField({ key });
  }

  _handleChangeName(value) {
    const { fieldPrefix, fieldName } = this.props;
    this.props.handleName({ key: fieldPrefix, name: fieldName, value });
  }

  _handleSidebarOpen(e) {
    const key = this.addToPrefix(['properties']);
    this.props.handleSidebar({ key });
  }

  _handleChangeSchemaType(value, prefix=['type']) {
    const key = this.addToPrefix(prefix);
    this.props.handleSchemaType({ key, value });
  }

  _handleChangeTitle(value) {
    const key = this.addToPrefix(['title']);
    this.props.handleTitle({ key, value });
  }

  _handleChangeDescription(e) {
    const key = this.addToPrefix(['description']);
    this.props.handleDescription({ key, value: e.target.value });
  }

  _handleSettings(e) {
    const key = this.addToPrefix([]);
    const { schema } = this.props;
    this.props.handleSettings(key, schema);
  }

  _handleDeleteItem(e) {
    const key = this.addToPrefix([]);
    this.props.handleDelete({ key });
  }

  _handleToggleRequire(e) {
    const { fieldPrefix, fieldName, required } = this.props;
    this.props.handleRequire({
      key: fieldPrefix,
      value: fieldName,
      required: !required,
    });
  }

  _handleAdvancedProperty(value) {
    const key = this.addToPrefix([]);
    this.props.handleAdditionalProperties({ key, value });
  }

  addToPrefix(fields) {
    return [].concat(this.props.fieldPrefix, this.props.fieldName, [...fields]).filter(Boolean);
  }

  getSubType(schema) {
    return schema.type === 'array' ? (!isUndefined(schema.items) && schema.items.type) : null
  }

  render() {
    const { show, schema, sidebar, required, fieldName, fieldPrefix, children } = this.props;

    const prefix = fieldPrefix || [];
    const name = fieldName || null;

    const sidebarOpen = prefix.length ? get(sidebar, this.addToPrefix(['properties'])) : true;
    const indent = prefix.length ? prefix.filter(name => name !== 'properties').length : -1;
    let padLeft = 30 * (indent + 1);
    padLeft += schema.type === 'object' ? 0 : 50;
    const styles = { paddingLeft: `${padLeft}px` };
    const isParentArray = this.props.parent && (this.props.parent === 'array');

    return show ? (
      <>
        <div className="flex">
          <div className="flex flex-1">
            {!!name && schema.type === 'object' ? (
              <DropPlus
                handleAddField={this._handleAddField}
                handleAddChildField={this._handleAddChildField}
              />
            ) : (
              schema.type === 'object' && (
                  <Button small minimal icon="plus" onClick={this._handleAddField} />
              )
            )}
            <div className="flex flex-1 bp3-control-group" style={styles}>
              {schema.type === 'object' && (
                  <Button
                    style={{marginRight: '2px'}}
                    onClick={this._handleSidebarOpen}
                    small minimal icon={!!sidebarOpen ? 'chevron-down': 'chevron-right'} />
              )}

              {!!name && !isParentArray && <DebouncedInput
                className="pl-1 bg-transparent hover:bg-gray-100 focus:bg-gray-200 outline-none" 
                onChange={this._handleChangeName} value={name} small />}
              {!!name && !isParentArray && (<span>&nbsp;:&nbsp;</span>)}
              <Popover2
                className="p-1 pt-0"
                content={<SchemaSelectors
                  schema={schema}
                  onClick={this._handleChangeSchemaType}
                />}
                placement="right">
                <SchemaItemEntity
                      text={
                        (schema.type === 'array' && schema.items.hasOwnProperty('type')
                          ? `${schema.type} [${schema.items.type}]`
                          : schema.type)
                      }
                    />
              </Popover2>
            </div>
            <span>
              {!!name && (<Popover2
                  content={
                    <TextArea
                      className="outline-none border-0"
                      growVertically
                      value={schema.description || ''}
                      onChange={this._handleChangeDescription}
                    />}
                  placement="left">
                  <Tooltip2 content={<span>{LocaleProvider('adv_setting')}</span>}>
                    <Button small minimal icon="manual" intent={!!schema.description ? Intent.PRIMARY : null} />
                  </Tooltip2>
              </Popover2>)}
            </span>
            <span>
              <Popover2
                  content={
                  <AdvancedProperties
                    data={JSON.stringify(schema, null, 2)}
                    onChange={this._handleAdvancedProperty} />
                  }
                  placement="right">
                  <Tooltip2 content={<span>{LocaleProvider('adv_setting')}</span>}>
                    <Button onClick={this._handleSettings} small minimal icon="property" />
                  </Tooltip2>
              </Popover2>
            </span>
            {!!name && (
              <span>
                <Tooltip2 content={LocaleProvider('adv_setting')}>
                  <Button onClick={this._handleDeleteItem} small minimal icon="cross" />
                </Tooltip2>
              </span>
            )}
            {!!name && (
              <span>
                {isParentArray ? (
                  <Button
                    disabled={isParentArray}
                    small minimal icon="issue"
                    onClick={this._handleToggleRequire}
                    intent={required ? Intent.DANGER : null} />
                ) : (<Tooltip2 content={LocaleProvider('adv_setting')}>
                  <Button
                    disabled={isParentArray}
                    small minimal icon="issue"
                    onClick={this._handleToggleRequire}
                    intent={required ? Intent.DANGER : null} />
                </Tooltip2>)}
              </span>
            )}
          </div>
        </div>
        {children}
      </>
    ) : null;
  }
}

export default SchemaRow;
