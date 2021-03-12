import React from 'react';
import { Switch, FormGroup, TagInput } from "@blueprintjs/core";
import DebouncedInput from './debounced-input';
import LocaleProvider from '../locale';

export const Default = (props) => {
    return  <FormGroup
                className="flex-1 text-black dark:text-white"
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

const getFormat = format => {
  format = format || String;
  const formats = {
    String: [
      { name: 'date-time' },
      { name: 'date' },
      { name: 'email' },
      { name: 'hostname' },
      { name: 'ipv4' },
      { name: 'ipv6' },
      { name: 'uri' }
    ],
    Number: [
      { name: 'float' },
      { name: 'double' }
    ]
  };

  return [].concat((formats[format.prototype.constructor.name] || []));
}

export const Format = (props) => {
  const format = getFormat(props.format || String);
  return <FormGroup label="format" className="flex-1 ml-3 text-black dark:text-white">
            <div className="bp3-select">
              <select
                style={{ width: 150 }}
                value={props.value}
                placeholder="Select a format"
                onChange={props.onChange}
              >
                <option value="">None</option>
                {format.map(item => {
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
  return <FormGroup className="flex-1 mb-0 text-black dark:text-white" label='enum'>
            <TagInput
              values={props.value || []}
              placeholder={LocaleProvider('enum_msg')}
              onChange={props.onChange}
            />
        </FormGroup>
};

export const Pattern = (props) => {
  return <FormGroup className="flex-1 mb-0 text-black dark:text-white" label='pattern'>
            <DebouncedInput
              large
              value={props.value}
              placeholder="Pattern"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const MinLength = (props) => {
  return <FormGroup className="flex-1 mb-0 text-black dark:text-white" label={LocaleProvider('minLength')}
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
  return <FormGroup className="flex-1 mb-0 ml-3 text-black dark:text-white" label={LocaleProvider('maxLength')}
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
          <FormGroup className="flex-1 mb-0 text-black dark:text-white" label='minimum'>
            <DebouncedInput
              large
              value={props.value}
              placeholder='minimum'
              onChange={props.onChange}
            />
          </FormGroup>
          <FormGroup className="ml-3 mb-0 text-center text-black dark:text-white" label="exclusiveMin">
            <Switch
              checked={props.exclusiveMinimum || false}
              onChange={props.onToggle}
            />
          </FormGroup>
        </div>
};

export const Maximum = (props) => {
  return <div className="flex pb-2">
          <FormGroup className="flex-1 mb-0 text-black dark:text-white" label="maximum">
            <DebouncedInput
              large
              value={props.value}
              placeholder="maximum"
              onChange={props.onChange}
            />
          </FormGroup>
          <FormGroup className="ml-3 mb-0 text-black dark:text-white text-center" label="exclusiveMax">
            <Switch
              checked={props.exclusiveMaximum || false}
              onChange={props.onToggle}
            />
          </FormGroup>
        </div>
};

export const MultipleOf = (props) => {
  return <FormGroup className="flex-1 mb-0 text-black dark:text-white" label="multipleOf" labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder=">=0"
              onChange={props.onChange}
            />
        </FormGroup>
};

export const UniqueItems = (props) => {
  return <FormGroup className="flex-1 mb-0 text-black dark:text-white" label="uniqueItems">
            <Switch
              checked={props.value || false}
              onChange={props.onToggle}
            />
        </FormGroup>
};

export const MinItems = (props) => {
  return <FormGroup className="flex-1 mb-0 text-black dark:text-white" label="minitems"
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
  return <FormGroup className="flex-1 mb-0 ml-3 text-black dark:text-white" label="maxitems"
            labelFor="text-input">
            <DebouncedInput
              large
              value={props.value}
              placeholder=">=0"
              onChange={props.onChange}
            />
        </FormGroup>
};