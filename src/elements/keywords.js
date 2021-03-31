// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Switch, FormGroup, TagInput} from '@blueprintjs/core';
import DebouncedInput from './debounced-input';
import LocaleProvider from '../locale';

export const Default = (props) => {
  return (
    <FormGroup
      className="flex-1"
      label={LocaleProvider('default')}
      labelFor="text-input">
      <DebouncedInput
        large
        value={props.value}
        placeholder={LocaleProvider('default')}
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

Default.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const BoolDefault = (props) => {
  return (
    <FormGroup
      className="flex-1"
      label={LocaleProvider('default')}
      labelFor="text-input">
      <div className="bp3-select">
        <select
          value={props.value}
          onChange={props.onChange}
          style={{width: 200}}>
          <option value="">None</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
    </FormGroup>
  );
};

BoolDefault.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const getFormat = (format) => {
  format = format || String;
  const formats = {
    String: [
      {name: 'date-time'},
      {name: 'date'},
      {name: 'email'},
      {name: 'hostname'},
      {name: 'ipv4'},
      {name: 'ipv6'},
      {name: 'uri'},
    ],
    Number: [{name: 'float'}, {name: 'double'}],
  };

  return [].concat(formats[format.prototype.constructor.name] || []);
};

export const Format = (props) => {
  const format = getFormat(props.format || String);
  return (
    <FormGroup label="format" className="flex-1 ml-3">
      <div className="bp3-select">
        <select
          style={{width: 150}}
          value={props.value}
          placeholder="Select a format"
          onChange={props.onChange}>
          <option value="">None</option>
          {format.map((item) => {
            return (
              <option value={item.name} key={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
    </FormGroup>
  );
};

Format.propTypes = {
  format: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const Enum = (props) => {
  return (
    <FormGroup className="flex-1 mb-0" label="enum">
      <TagInput
        values={props.value || []}
        placeholder={LocaleProvider('enum_msg')}
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

Enum.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const Pattern = (props) => {
  return (
    <FormGroup className="flex-1 mb-0" label="pattern">
      <DebouncedInput
        large
        value={props.value}
        placeholder="Pattern"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

Pattern.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const MinLength = (props) => {
  return (
    <FormGroup
      className="flex-1 mb-0"
      label={LocaleProvider('minLength')}
      labelFor="text-input">
      <DebouncedInput
        large
        value={props.value}
        placeholder="min.length"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MinLength.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const MaxLength = (props) => {
  return (
    <FormGroup
      className="flex-1 mb-0 ml-3"
      label={LocaleProvider('maxLength')}
      labelFor="text-input">
      <DebouncedInput
        large
        value={props.value}
        placeholder="max.length"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MaxLength.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const Minimum = (props) => {
  return (
    <div className="flex pb-2">
      <FormGroup className="flex-1 mb-0" label="minimum">
        <DebouncedInput
          large
          value={props.value}
          placeholder="minimum"
          onChange={props.onChange}
        />
      </FormGroup>
      <FormGroup className="ml-3 mb-0 text-center" label="exclusiveMin">
        <Switch
          checked={props.exclusiveMinimum || false}
          onChange={props.onToggle}
        />
      </FormGroup>
    </div>
  );
};

Minimum.propTypes = {
  value: PropTypes.string,
  exclusiveMinimum: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export const Maximum = (props) => {
  return (
    <div className="flex pb-2">
      <FormGroup className="flex-1 mb-0" label="maximum">
        <DebouncedInput
          large
          value={props.value}
          placeholder="maximum"
          onChange={props.onChange}
        />
      </FormGroup>
      <FormGroup className="ml-3 mb-0 text-center" label="exclusiveMax">
        <Switch
          checked={props.exclusiveMaximum || false}
          onChange={props.onToggle}
        />
      </FormGroup>
    </div>
  );
};

Maximum.propTypes = {
  value: PropTypes.string,
  exclusiveMaximum: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export const MultipleOf = (props) => {
  return (
    <FormGroup className="flex-1 mb-0" label="multipleOf" labelFor="text-input">
      <DebouncedInput
        large
        value={props.value}
        placeholder=">=0"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MultipleOf.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const UniqueItems = (props) => {
  return (
    <FormGroup className="flex-1 mb-0" label="uniqueItems">
      <Switch checked={props.value || false} onChange={props.onToggle} />
    </FormGroup>
  );
};

UniqueItems.propTypes = {
  value: PropTypes.string,
  onToggle: PropTypes.func,
};

export const MinItems = (props) => {
  return (
    <FormGroup className="flex-1 mb-0" label="minitems" labelFor="text-input">
      <DebouncedInput
        large
        value={props.value}
        placeholder=">=0"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MinItems.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const MaxItems = (props) => {
  return (
    <FormGroup
      className="flex-1 mb-0 ml-3"
      label="maxitems"
      labelFor="text-input">
      <DebouncedInput
        large
        value={props.value}
        placeholder=">=0"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MaxItems.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const DisallowAdditionalProperties = (props) => {
  return (
    <FormGroup
      inline
      className="mb-0 text-center"
      label="Disallow additional properties">
      <Switch
        checked={props.value === false || false}
        onChange={props.onToggle}
      />
    </FormGroup>
  );
};

DisallowAdditionalProperties.propTypes = {
  value: PropTypes.string,
  onToggle: PropTypes.func,
};

export const ObjectBehaviour = (props) => {
  return (
    <FormGroup className="flex-1" label="Behaviour">
      <div className="bp3-select">
        <select
          value={props.value}
          onChange={props.onChange}
          style={{width: 200}}>
          <option value="">Read and write</option>
          <option value="readOnly">Read Only</option>
          <option value="writeOnly">Write Only</option>
        </select>
      </div>
    </FormGroup>
  );
};

ObjectBehaviour.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const MinProperty = (props) => {
  return (
    <FormGroup className="flex-1 mb-0" label="minProperties">
      <DebouncedInput
        large
        value={props.value}
        placeholder=">=0"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MinProperty.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export const MaxProperty = (props) => {
  return (
    <FormGroup className="flex-1 mb-0 ml-3" label="maxProperties">
      <DebouncedInput
        large
        value={props.value}
        placeholder=">=0"
        onChange={props.onChange}
      />
    </FormGroup>
  );
};

MaxProperty.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
