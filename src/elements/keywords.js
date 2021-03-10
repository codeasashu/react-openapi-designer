import React from 'react';
import { Switch, FormGroup, TagInput } from "@blueprintjs/core";
import DebouncedInput from './debounced-input';
import LocaleProvider from '../locale';

export const Default = (props) => {
    return  <FormGroup
                className="flex-1"
                label={LocaleProvider('default')}
                labelFor="text-input"
            >
              <DebouncedInput
                large
                value={props.value}
                placeholder={LocaleProvider('default')}
                onChange={props.onChange}
              />
            </FormGroup>
}

export const BoolDefault = (props) => {
    return  <FormGroup
                className="flex-1"
                label={LocaleProvider('default')}
                labelFor="text-input"
            ><div className="bp3-select">
              <select
                value={props.value}
                onChange={props.onChange}
                style={{ width: 200 }}
              >
                <option value="">None</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select></div>
            </FormGroup>
}

export const Format = (props) => {
   const STRING_FORMATS = [
      { name: 'date-time' },
      { name: 'date' },
      { name: 'email' },
      { name: 'hostname' },
      { name: 'ipv4' },
      { name: 'ipv6' },
      { name: 'uri' }
  ];

  return <FormGroup label="format" labelFor="text-input" className="flex-1 ml-3">
            <div className="bp3-select">
              <select
                style={{ width: 150 }}
                value={props.value}
                placeholder="Select a format"
                onChange={props.onChange}
              >
                {STRING_FORMATS.map(item => {
                  return (
                    <option value={item.name} key={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
          </div>
        </FormGroup>
}

export const Enum = (props) => {
  return <FormGroup className="flex-1 mb-0" label='enum' labelFor="text-input">
            <TagInput
              values={props.value || []}
              placeholder={LocaleProvider('enum_msg')}
              onChange={props.onChange}
            />
        </FormGroup>
};

export const Pattern = (props) => {
  return <FormGroup className="flex-1 mb-0" label='pattern' labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder="Pattern"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const MinLength = (props) => {
  return <FormGroup className="flex-1 mb-0" label={LocaleProvider('minLength')}
            labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder="min.length"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const MaxLength = (props) => {
  return <FormGroup className="flex-1 mb-0" label={LocaleProvider('maxLength')}
            labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder="max.length"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const Minimum = (props) => {
  return <div className="flex pb-2">
          <FormGroup className="flex-1 mb-0" label='minimum'>
            <DebouncedInput
              large
              value={props.value}
              placeholder='minimum'
              onChange={props.onChange}
            />
          </FormGroup>
          <FormGroup className="ml-3 mb-0 text-center" label="exclusiveMin">
            <Switch
              checked={props.exclusiveMinimum}
              onChange={props.onToggle}
            />
          </FormGroup>
        </div>
};

export const Maximum = (props) => {
  return <div className="flex pb-2">
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
              checked={props.exclusiveMaximum}
              onChange={props.onToggle}
            />
          </FormGroup>
        </div>
};

export const MultipleOf = (props) => {
  return <FormGroup className="flex-1 mb-0" label="multipleOf" labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder=">=0"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const UniqueItems = (props) => {
  return <FormGroup className="flex-1 mb-0" label="uniqueItems">
            <Switch
              checked={props.value}
              onChange={props.onToggle}
            />
        </FormGroup>
};

export const MinItems = (props) => {
  return <FormGroup className="flex-1 mb-0" label="minitems"
            labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder=">=0"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const MaxItems = (props) => {
  return <FormGroup className="flex-1 mb-0 ml-3" label="maxitems"
            labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder=">=0"
              onChange={props.onChange}
            />
        </FormGroup>
};