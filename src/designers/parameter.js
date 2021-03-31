// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {isEqual} from 'lodash';
import produce from 'immer';
import {Popover2, Tooltip2} from '@blueprintjs/popover2';
import {
  Intent,
  ButtonGroup,
  Button,
  ControlGroup,
  InputGroup,
} from '@blueprintjs/core';
import AdvancedProperties from '../elements/advanced-properties';
import LocaleProvider from '../locale';

@autoBindMethodsForReact()
class Parameter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name || '',
      description: this.props.description || '',
      schema: this.props.schema,
      required: !!this.props.required && this.props?.in === 'path',
    };
  }

  componentDidUpdate(oldProps, oldState) {
    if (!isEqual(oldState, this.state)) {
      if (
        this.state.name === oldState.name &&
        this.state.description === oldState.description
      )
        this.props.onChange(this.state);
    }
  }

  handleChange(field) {
    if (this.state[field] !== this.props[field]) {
      this.triggerChange();
    }
  }

  triggerChange(value = {}) {
    this.props.onChange({
      ...this.state,
      ...value,
    });
  }

  renderRow() {
    const {name, description, schema, required} = this.state;
    const {disableRequired} = this.props;
    return (
      <ControlGroup className="mt-2">
        <InputGroup
          value={name}
          onChange={(e) => this.setState({name: e.target.value})}
          onBlur={() => this.handleChange('name')}
          className="flex-auto"
          placeholder="Header0"
        />
        <div className="bp3-select flex-shrink">
          <select
            onChange={(e) =>
              this.setState({
                schema: {type: e.target.value},
              })
            }
            value={schema.type}>
            <option value="">any</option>
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="integer">integer</option>
            <option value="boolean">boolean</option>
            <option value="array">array</option>
          </select>
        </div>
        <InputGroup
          value={description}
          onChange={(e) => this.setState({description: e.target.value})}
          onBlur={() => this.handleChange('description')}
          className="flex-auto"
          placeholder="Description"
        />
        <ButtonGroup>
          <Tooltip2
            disabled={disableRequired || false}
            content={LocaleProvider('required')}>
            <Button
              disabled={disableRequired || false}
              icon="issue"
              onClick={() => this.setState({required: !required})}
              intent={required === true ? Intent.DANGER : null}
            />
          </Tooltip2>
          <Popover2
            content={
              <AdvancedProperties
                data={JSON.stringify(schema, null, 2)}
                onChange={(e) =>
                  this.setState(
                    produce((draft) => {
                      draft.schema = e;
                    }),
                  )
                }
              />
            }
            placement="right">
            <Tooltip2 content={<span>{LocaleProvider('adv_setting')}</span>}>
              <Button icon="property" />
            </Tooltip2>
          </Popover2>
          <Tooltip2 content="Delete field">
            <Button onClick={this.props.onDelete} icon="trash" />
          </Tooltip2>
        </ButtonGroup>
      </ControlGroup>
    );
  }

  render() {
    return this.renderRow();
  }
}

Parameter.propTypes = {
  disableRequired: PropTypes.bool,
  name: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.string,
  schema: PropTypes.object,
  in: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Parameter;
