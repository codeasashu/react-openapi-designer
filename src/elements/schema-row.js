import React from 'react';
import _ from 'lodash';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import { Button, SvgIcon } from 'insomnia-components';
import LocaleProvider from '../locale';
import * as ui from '../ui';
import DropPlus from '../ui/drop-plus';
import SchemaSelectors from './schema-selectors';
import FieldInput from './field-input';

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

  _handleChangeSchemaType(value) {
    const key = this.addToPrefix(['type']);
    this.props.handleSchemaType({ key, value });
  }

  _handleChangeTitle(e) {
    const key = this.addToPrefix(['title']);
    this.props.handleTitle({ key, value: e.target.value });
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

  addToPrefix(fields) {
    return [].concat(this.props.fieldPrefix, this.props.fieldName, [...fields]).filter(Boolean);
  }

  render() {
    const { show, schema, sidebar, required, fieldName, fieldPrefix, children } = this.props;

    const prefix = fieldPrefix || [];
    const name = fieldName || null;

    const sidebarOpen = prefix.length ? _.get(sidebar, this.addToPrefix(['properties'])) : true;
    const indent = prefix.length ? prefix.filter(name => name !== 'properties').length : -1;
    let padLeft = 30 * (indent + 1);
    padLeft += schema.type === 'object' ? 0 : 40;
    const styles = { paddingLeft: `${padLeft}px` };

    return show ? (
      <>
        <ui.FlexRow>
          <ui.FlexItem>
            {!!name && schema.type === 'object' ? (
              <DropPlus
                handleAddField={this._handleAddField}
                handleAddChildField={this._handleAddChildField}
              />
            ) : (
              schema.type === 'object' && (
                <ui.StyledActions onClick={this._handleAddField}>
                  <SvgIcon icon="plus" />
                </ui.StyledActions>
              )
            )}
            <ui.FlexItem style={styles}>
              {schema.type === 'object' && (
                <ui.StyledNavigate show={!!sidebarOpen} onClick={this._handleSidebarOpen}>
                  <SvgIcon icon="chevron-down" />
                </ui.StyledNavigate>
              )}

              {!!name && <FieldInput onChange={this._handleChangeName} value={name} />}

              <ui.StyledTooltip
                message={
                  <SchemaSelectors
                    selectedItem={schema.type}
                    handleItemClick={this._handleChangeSchemaType}
                  />
                }
                position="top">
                <Button size="small" variant="text">
                  {schema.type}
                </Button>
              </ui.StyledTooltip>

              {!!name && (
                <ui.FieldInput
                  placeholder={LocaleProvider('title')}
                  value={schema.title || ''}
                  onChange={this._handleChangeTitle}
                />
              )}

              {!!name && (
                <ui.FieldInput
                  placeholder={LocaleProvider('description')}
                  value={schema.description || ''}
                  onChange={this._handleChangeDescription}
                />
              )}
            </ui.FlexItem>
            <ui.StyledActions font={1} onClick={this._handleSettings}>
              <ui.StyledTooltip placement="top" message={LocaleProvider('adv_setting')}>
                <SvgIcon icon="gear" />
              </ui.StyledTooltip>
            </ui.StyledActions>
            {!!name && (
              <ui.StyledActions font={1} onClick={this._handleDeleteItem}>
                <ui.StyledTooltip placement="top" message={LocaleProvider('adv_setting')}>
                  <SvgIcon icon="trashcan" />
                </ui.StyledTooltip>
              </ui.StyledActions>
            )}
            {!!name && (
              <ui.StyledActions font={1} onClick={this._handleToggleRequire}>
                <ui.StyledTooltip placement="top" message={LocaleProvider('adv_setting')}>
                  <SvgIcon theme={required ? 'danger' : 'default'} icon="warning-circle" />
                </ui.StyledTooltip>
              </ui.StyledActions>
            )}
          </ui.FlexItem>
        </ui.FlexRow>
        {children}
      </>
    ) : null;
  }
}

export default SchemaRow;
