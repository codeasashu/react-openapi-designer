// @flow
import React from 'react';
import PropTypes from 'prop-types';
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

const Parameter = ({schema, name, description, ...props}) => {
  const [title, setName] = React.useState(name);
  const [content, setDescription] = React.useState(description);

  React.useEffect(() => {
    if (name) {
      setName(name);
    }
    if (description) {
      setDescription(description);
    }
  }, [name, description]);

  const handleChange = (changes) => {
    props.onChange({name: title, description: content, schema, ...changes});
  };

  return (
    <ControlGroup className="mt-2">
      <InputGroup
        aria-label="name"
        value={title}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => handleChange({name: title})}
        className="flex-auto border border-r-0"
        placeholder={props.placeholder}
      />
      <div className="bp3-select flex-shrink border border-l-0 border-r-0">
        <select
          onChange={(e) =>
            handleChange({
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
        value={content || ''}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => handleChange({description: content})}
        className="flex-auto border border-l-0 border-r-0"
        placeholder="Description"
      />
      <ButtonGroup>
        <Tooltip2
          disabled={props.disableRequired || false}
          content={LocaleProvider('required')}>
          <Button
            disabled={props.disableRequired || false}
            icon="issue"
            onClick={() => handleChange({required: !props.required})}
            intent={props.required === true ? Intent.DANGER : null}
          />
        </Tooltip2>
        <Popover2
          content={
            <AdvancedProperties
              data={JSON.stringify(schema, null, 2)}
              onChange={(schema) => handleChange({schema})}
            />
          }
          placement="right">
          <Tooltip2 content={<span>{LocaleProvider('adv_setting')}</span>}>
            <Button icon="property" />
          </Tooltip2>
        </Popover2>
        <Tooltip2 content="Delete field">
          <Button onClick={props.onDelete} aria-label="delete" icon="trash" />
        </Tooltip2>
      </ButtonGroup>
    </ControlGroup>
  );
};

Parameter.propTypes = {
  disableRequired: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.string,
  schema: PropTypes.object,
  in: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Parameter;
